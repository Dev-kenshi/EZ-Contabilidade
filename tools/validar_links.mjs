// Testa todos os links da galáxia pela internet e grava data/links_status.json.
// Uso: node tools/validar_links.mjs   (Node 18+)
import fs from 'node:fs';
const N = JSON.parse(fs.readFileSync('data/normas_cfc.json', 'utf8'));
const R = JSON.parse(fs.readFileSync('data/reforma.json', 'utf8'));
const urls = new Set();
for (const it of [...N, ...R]) { if (it.url) urls.add(it.url); if (it.pagina_grupo) urls.add(it.pagina_grupo); }
const TIMEOUT = 15000, UA = 'Mozilla/5.0 (EZ Contabilidade link check)';
async function check(u) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), TIMEOUT);
  try {
    let r = await fetch(u, { method: 'HEAD', redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': UA } });
    if (r.status === 405 || r.status === 403) r = await fetch(u, { method: 'GET', redirect: 'follow', signal: ctl.signal, headers: { 'user-agent': UA } });
    return { status: r.status, ok: r.status < 400 };
  } catch (e) { return { status: 0, ok: false, erro: e.name === 'AbortError' ? 'timeout' : String(e.message || e) }; }
  finally { clearTimeout(t); }
}
const list = [...urls], out = {}; let i = 0;
async function worker() { while (i < list.length) { const u = list[i++]; out[u] = await check(u); } }
await Promise.all(Array.from({ length: 8 }, worker));
const bad = Object.entries(out).filter(([, v]) => !v.ok);
const hoje = new Date().toLocaleDateString('pt-BR');
fs.writeFileSync('data/links_status.json', JSON.stringify({ verificado: hoje, total: list.length, quebrados: bad.length, links: out }, null, 1));
console.log(`Links testados: ${list.length} · quebrados: ${bad.length}`);
for (const [u, v] of bad) console.log(`  QUEBRADO ${v.status || v.erro}: ${u}`);
process.exit(bad.length ? 1 : 0);
