"""Browser-level regression checks for the galaxy and quiz interactions."""

import base64
import hashlib
import http.server
import json
import os
import shutil
import socket
import struct
import subprocess
import tempfile
import threading
import time
import unittest
import urllib.request
from functools import partial
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]


class DevTools:
    """Small Chrome DevTools Protocol client using only Python's standard library."""

    def __init__(self, websocket_url):
        from urllib.parse import urlparse

        parsed = urlparse(websocket_url)
        self.socket = socket.create_connection((parsed.hostname, parsed.port), timeout=10)
        self.socket.settimeout(10)
        key = base64.b64encode(os.urandom(16)).decode("ascii")
        request = (
            f"GET {parsed.path} HTTP/1.1\r\n"
            f"Host: {parsed.hostname}:{parsed.port}\r\n"
            "Upgrade: websocket\r\n"
            "Connection: Upgrade\r\n"
            f"Sec-WebSocket-Key: {key}\r\n"
            "Sec-WebSocket-Version: 13\r\n\r\n"
        )
        self.socket.sendall(request.encode("ascii"))
        response = b""
        while not response.endswith(b"\r\n\r\n"):
            response += self.socket.recv(1)
        if b" 101 " not in response.split(b"\r\n", 1)[0]:
            raise RuntimeError(f"Chrome DevTools WebSocket handshake failed: {response!r}")
        expected = base64.b64encode(
            hashlib.sha1((key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11").encode()).digest()
        )
        if b"Sec-WebSocket-Accept: " + expected not in response:
            raise RuntimeError("Chrome DevTools returned an invalid WebSocket handshake.")
        self.command_id = 0

    def close(self):
        self.socket.close()

    def _send_frame(self, opcode, payload):
        mask = os.urandom(4)
        length = len(payload)
        header = bytearray([0x80 | opcode])
        if length < 126:
            header.append(0x80 | length)
        elif length < 65536:
            header.append(0x80 | 126)
            header.extend(struct.pack("!H", length))
        else:
            header.append(0x80 | 127)
            header.extend(struct.pack("!Q", length))
        header.extend(mask)
        masked = bytes(byte ^ mask[index % 4] for index, byte in enumerate(payload))
        self.socket.sendall(header + masked)

    def _read_exactly(self, size):
        data = bytearray()
        while len(data) < size:
            part = self.socket.recv(size - len(data))
            if not part:
                raise RuntimeError("Chrome DevTools closed the connection.")
            data.extend(part)
        return bytes(data)

    def _read_message(self):
        chunks = bytearray()
        while True:
            first, second = self._read_exactly(2)
            opcode = first & 0x0F
            length = second & 0x7F
            if length == 126:
                length = struct.unpack("!H", self._read_exactly(2))[0]
            elif length == 127:
                length = struct.unpack("!Q", self._read_exactly(8))[0]
            mask = self._read_exactly(4) if second & 0x80 else None
            payload = self._read_exactly(length)
            if mask:
                payload = bytes(byte ^ mask[index % 4] for index, byte in enumerate(payload))
            if opcode == 0x9:
                self._send_frame(0xA, payload)
                continue
            if opcode == 0x8:
                raise RuntimeError("Chrome DevTools ended the WebSocket session.")
            if opcode in (0x1, 0x0):
                chunks.extend(payload)
                if first & 0x80:
                    return json.loads(chunks.decode("utf-8"))

    def call(self, method, params=None):
        self.command_id += 1
        request_id = self.command_id
        self._send_frame(
            0x1,
            json.dumps({"id": request_id, "method": method, "params": params or {}}).encode(),
        )
        while True:
            message = self._read_message()
            if message.get("id") != request_id:
                continue
            if "error" in message:
                raise RuntimeError(f"{method} failed: {message['error']}")
            return message.get("result", {})

    def evaluate(self, expression):
        result = self.call(
            "Runtime.evaluate",
            {"expression": expression, "returnByValue": True, "awaitPromise": True},
        )
        if "exceptionDetails" in result:
            raise AssertionError(result["exceptionDetails"].get("text", "Browser evaluation failed"))
        return result.get("result", {}).get("value")

    def wait_for(self, expression, timeout=10):
        deadline = time.monotonic() + timeout
        while time.monotonic() < deadline:
            if self.evaluate(expression):
                return
            time.sleep(0.1)
        state = self.evaluate(
            "JSON.stringify({ready: document.readyState, title: document.title, "
            "quiz: document.getElementById('ezQuiz')?.innerHTML.slice(0, 500), "
            "chips: document.getElementById('gxChips')?.innerHTML.slice(0, 300)})"
        )
        raise AssertionError(
            f"Timed out waiting for browser condition: {expression}; page state: {state}"
        )


class GalaxyGameInteractionsTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        browser = shutil.which("chromium") or shutil.which("chromium-browser") or shutil.which("google-chrome")
        if not browser:
            raise unittest.SkipTest("A Chromium browser is required for browser interaction tests.")

        cls.server = http.server.ThreadingHTTPServer(
            ("127.0.0.1", 0),
            partial(http.server.SimpleHTTPRequestHandler, directory=str(ROOT)),
        )
        cls.server_thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.server_thread.start()
        cls.temp_dir = tempfile.TemporaryDirectory(prefix="ez-contabilidade-test-")
        cls.browser_process = subprocess.Popen(
            [
                browser,
                "--headless=new",
                "--no-sandbox",
                "--disable-dev-shm-usage",
                "--no-first-run",
                "--no-default-browser-check",
                "--remote-debugging-port=0",
                f"--user-data-dir={cls.temp_dir.name}",
                "about:blank",
            ],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
        )
        port_file = Path(cls.temp_dir.name) / "DevToolsActivePort"
        deadline = time.monotonic() + 15
        while time.monotonic() < deadline and not port_file.exists():
            if cls.browser_process.poll() is not None:
                raise RuntimeError("Chromium exited before opening its DevTools endpoint.")
            time.sleep(0.1)
        if not port_file.exists():
            raise RuntimeError("Chromium did not open its DevTools endpoint.")

        devtools_port = int(port_file.read_text().splitlines()[0])
        cls.devtools_base = f"http://127.0.0.1:{devtools_port}"
        cls._wait_for_devtools()
        pages = json.loads(urllib.request.urlopen(cls.devtools_base + "/json/list").read())
        page = next(entry for entry in pages if entry.get("type") == "page")
        cls.cdp = DevTools(page["webSocketDebuggerUrl"])
        cls.cdp.call("Page.enable")
        cls.cdp.call("Runtime.enable")
        app_port = cls.server.server_address[1]
        cls.cdp.call("Page.navigate", {"url": f"http://127.0.0.1:{app_port}/"})
        cls.cdp.wait_for(
            "!!(document.querySelector('#gxChips .gx-chip') && "
            "document.querySelector('#ezQuiz .qz-opts button'))"
        )

    @classmethod
    def _wait_for_devtools(cls):
        deadline = time.monotonic() + 10
        while time.monotonic() < deadline:
            try:
                urllib.request.urlopen(cls.devtools_base + "/json/list", timeout=1).close()
                return
            except OSError:
                time.sleep(0.1)
        raise RuntimeError("Chromium DevTools endpoint did not become ready.")

    @classmethod
    def tearDownClass(cls):
        if hasattr(cls, "cdp"):
            cls.cdp.close()
        if hasattr(cls, "browser_process"):
            cls.browser_process.terminate()
            try:
                cls.browser_process.wait(timeout=5)
            except subprocess.TimeoutExpired:
                cls.browser_process.kill()
        if hasattr(cls, "server"):
            cls.server.shutdown()
            cls.server.server_close()
        if hasattr(cls, "temp_dir"):
            cls.temp_dir.cleanup()

    def test_galaxy_search_filter_export_quiz_and_saved_progress(self):
        cdp = self.cdp
        cdp.evaluate("localStorage.clear()")
        cdp.call("Page.reload", {"ignoreCache": True})
        cdp.wait_for("!!document.querySelector('#gxList .row')")

        # Search without case sensitivity, then open a result in the galaxy panel.
        cdp.evaluate(
            "(() => { const input = document.getElementById('gxQ'); "
            "input.value = 'estoques'; input.dispatchEvent(new Event('input')); })()"
        )
        cdp.evaluate("new Promise(resolve => setTimeout(resolve, 180))")
        self.assertTrue(
            cdp.evaluate(
                "Array.from(document.querySelectorAll('#gxList .row b'))"
                ".some(item => item.textContent.includes('NBC TG 16'))"
            )
        )
        opened_code = cdp.evaluate(
            "(() => { const code = document.querySelector('#gxList .row b').textContent; "
            "document.querySelector('#gxList .row').click(); return code; })()"
        )
        cdp.wait_for(
            "document.getElementById('gxPanel').classList.contains('open') && "
            "document.getElementById('gxPanel').textContent.includes(" + json.dumps(opened_code) + ")"
        )

        # Filter the reforma group, search within it, and verify JSON export reflects both filters.
        cdp.evaluate(
            "document.querySelector('#gxChips .gx-chip[data-g=\"*\"]').click(); "
            "document.querySelector('#gxChips .gx-chip[data-g=\"Reforma Tributária\"]').click()"
        )
        cdp.evaluate(
            "(() => { const input = document.getElementById('gxQ'); "
            "input.value = 'split payment'; input.dispatchEvent(new Event('input')); })()"
        )
        cdp.evaluate("new Promise(resolve => setTimeout(resolve, 180))")
        cdp.evaluate(
            "window.__copied = null; "
            "Object.defineProperty(navigator, 'clipboard', {configurable: true, "
            "value: {writeText: text => {window.__copied = text; return Promise.resolve();}}}); "
            "document.getElementById('gxCpJson').click()"
        )
        cdp.wait_for("window.__copied !== null")
        exported = cdp.evaluate("JSON.parse(window.__copied)")
        result_count = cdp.evaluate("document.querySelectorAll('#gxList .row').length")
        self.assertGreater(result_count, 0, "The filtered search should show matching results.")
        self.assertEqual(len(exported["itens"]), result_count)
        self.assertTrue(exported["itens"])
        self.assertTrue(all(item["grupo"] == "Reforma Tributária" for item in exported["itens"]))
        self.assertTrue(
            all("split payment" in (
                item["codigo"] + " " + item["titulo"] + " " + item["resumo"]
            ).lower()
                for item in exported["itens"])
        )

        # Complete all five questions, then confirm quiz progress survives a page reload.
        for answer_index in (1, 2, 0, 3, 1):
            cdp.evaluate(
                "document.querySelector('#ezQuiz .qz-opts button[data-j=\""
                + str(answer_index)
                + "\"]').click()"
            )
            cdp.wait_for("!!document.getElementById('qzNext')")
            cdp.evaluate("document.getElementById('qzNext').click()")
        cdp.wait_for("document.querySelector('#ezQuiz .qz-score')?.textContent.includes('5')")
        saved_state = cdp.evaluate("JSON.parse(localStorage.getItem('ez_game_v1'))")
        self.assertEqual(saved_state["quiz"], 5)
        self.assertTrue(saved_state["badges"].get("gabarito"))
        self.assertTrue(saved_state["badges"].get("exportador"))
        self.assertIn(opened_code, saved_state["seen"])
        xp_before_reload = cdp.evaluate("document.getElementById('ezXpBig').textContent")

        cdp.call("Page.reload", {"ignoreCache": True})
        cdp.wait_for(
            "document.getElementById('ezXpBig')?.textContent === "
            + json.dumps(xp_before_reload)
            + " && !!document.querySelector('#ezBadges .bdg.on b')"
        )
        self.assertEqual(cdp.evaluate("document.getElementById('ezXpBig').textContent"), xp_before_reload)
        self.assertTrue(
            cdp.evaluate(
                "Array.from(document.querySelectorAll('#ezBadges .bdg.on b'))"
                ".some(item => item.textContent === 'Gabarito')"
            )
        )


if __name__ == "__main__":
    unittest.main(verbosity=2)
