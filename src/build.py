"""Gera o index.html do site EZ Contabilidade.
Uso: python3 src/build.py   (rode na raiz do projeto)
"""
import os, base64, json, subprocess, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
P = lambda *a: os.path.join(ROOT, *a)
B64 = lambda p: base64.b64encode(open(P(p),'rb').read()).decode()
A = B64('assets/foto-poltrona.jpg')
S = B64('assets/foto-sorriso.jpg')
LOGO = 'data:image/png;base64,' + B64('assets/logo-ez.png')
MONO = 'data:image/svg+xml;base64,' + B64('assets/ez-monogram.svg')
MANUAL = "https://drive.google.com/file/d/1tZUdhQxEQAaKb--z3ND4S6lukWqo-PQV/view"
IG = "https://www.instagram.com/emanuelluz.contabilidade/"
TAP = "https://emanuelluz.taplink.bio/"

html = f'''<!DOCTYPE html>
<html lang="pt-BR"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>EZ Contabilidade | Emanuel Luz</title>
<meta name="description" content="Emanuel Luz. Ciências Contábeis na UEFS, Tech Lead do Contador do Amanhã, Diretor de Projetos da Consulte Jr. Contabilidade, reforma tributária e inteligência artificial.">
<link rel="icon" href="{MONO}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,400;1,600&display=swap" rel="stylesheet">
<style>
:root{{--ink:#0a0a0a;--navy:#0e1a2b;--navy2:#13233a;--gold:#d4a32a;--gold2:#f0c75e;--paper:#efede8;--fg:#f2f1ed;--mute:#9a988f;--line:rgba(255,255,255,.12)}}
*{{box-sizing:border-box;margin:0;padding:0}}
html{{scroll-behavior:smooth}}
body{{background:var(--ink);color:var(--fg);font-family:Inter,system-ui,sans-serif;-webkit-font-smoothing:antialiased;overflow-x:hidden}}
a{{color:inherit;text-decoration:none}}
.wrap{{max-width:1180px;margin:0 auto;padding:0 28px}}
.kick{{font-size:12px;letter-spacing:.3em;text-transform:uppercase;font-weight:600;color:var(--gold)}}
.serif{{font-family:"Playfair Display",serif}}
.bebas{{font-family:"Bebas Neue",sans-serif;letter-spacing:.01em}}
/* nav */
nav{{position:fixed;top:0;left:0;right:0;z-index:50;transition:background .3s,border-color .3s;border-bottom:1px solid transparent}}
nav.solid{{background:rgba(10,10,10,.85);backdrop-filter:blur(12px);border-color:var(--line)}}
nav .wrap{{display:flex;align-items:center;justify-content:space-between;height:72px}}
.logo{{display:flex;align-items:center;gap:12px;font-weight:600;letter-spacing:.18em;font-size:13px}}
.logo b{{width:38px;height:38px;border:1px solid var(--gold);border-radius:50%;display:grid;place-items:center;font-family:"Playfair Display",serif;font-style:italic;color:var(--gold);letter-spacing:0;font-size:17px}}
.links{{display:flex;gap:30px;font-size:14px;color:#cfcdc6}}
.links a:hover{{color:var(--gold2)}}
.btn{{display:inline-flex;align-items:center;gap:10px;padding:14px 22px;border-radius:999px;font-weight:600;font-size:14px;transition:transform .2s,background .2s,color .2s}}
.btn.gold{{background:var(--gold);color:#0a0a0a}}
.btn.gold:hover{{background:var(--gold2);transform:translateY(-2px)}}
.btn.ghost{{border:1px solid var(--line);color:var(--fg)}}
.btn.ghost:hover{{border-color:var(--gold)}}
.menu{{display:none;background:none;border:0;color:var(--fg);font-size:26px;cursor:pointer}}
/* hero */
header{{position:relative;min-height:100vh;display:flex;align-items:center;background:radial-gradient(ellipse at 75% 40%,#16263d 0%,#0a0a0a 55%);overflow:hidden}}
.hero{{display:grid;grid-template-columns:1.15fr .85fr;gap:40px;align-items:center;padding-top:90px;padding-bottom:60px}}
h1{{font-family:"Playfair Display",serif;font-weight:700;font-size:clamp(44px,6vw,86px);line-height:1;letter-spacing:-.015em;margin:22px 0 26px}}
h1 i{{font-weight:400;color:var(--gold2)}}
.lead{{font-size:18px;line-height:1.6;color:#c9c7c0;max-width:560px}}
.ctas{{display:flex;gap:14px;margin-top:36px;flex-wrap:wrap}}
.photo{{position:relative;aspect-ratio:3/4;border-radius:22px;overflow:hidden;border:1px solid var(--line);box-shadow:0 40px 80px rgba(0,0,0,.5)}}
.photo img{{width:100%;height:100%;object-fit:cover;filter:grayscale(1) contrast(1.08)}}
.photo::after{{content:"";position:absolute;inset:0;background:linear-gradient(180deg,transparent 55%,rgba(10,10,10,.75))}}
.badge{{position:absolute;left:18px;bottom:18px;z-index:2;background:rgba(14,26,43,.85);backdrop-filter:blur(8px);border:1px solid rgba(212,163,42,.5);border-radius:14px;padding:12px 16px;font-size:13px;line-height:1.4}}
.badge b{{color:var(--gold2);display:block;font-size:11px;letter-spacing:.2em;text-transform:uppercase}}
#gl{{position:absolute;right:-6%;top:50%;transform:translateY(-50%);width:62vw;max-width:900px;aspect-ratio:1;opacity:.55;pointer-events:none}}
.scroll{{position:absolute;bottom:26px;left:50%;transform:translateX(-50%);font-size:11px;letter-spacing:.3em;color:var(--mute)}}
/* stats */
.stats{{border-top:1px solid var(--line);border-bottom:1px solid var(--line);background:var(--navy)}}
.stats .wrap{{display:grid;grid-template-columns:repeat(4,1fr)}}
.stat{{padding:34px 22px;border-right:1px solid var(--line)}}
.stat:last-child{{border-right:0}}
.stat .bebas{{font-size:44px;color:var(--gold2);line-height:1}}
.stat p{{font-size:14px;color:#c9c7c0;margin-top:8px;line-height:1.45}}
/* sections */
section{{padding:120px 0}}
.light{{background:var(--paper);color:#111}}
.light .kick{{color:#8a6a12}}
h2{{font-family:"Playfair Display",serif;font-size:clamp(34px,4.2vw,58px);line-height:1.04;font-weight:700;margin:16px 0 22px;letter-spacing:-.01em}}
h2 i{{font-weight:400}}
.sub{{font-size:17px;line-height:1.65;color:#bdbbb4;max-width:640px}}
.light .sub{{color:#3a3936}}
.about{{display:grid;grid-template-columns:.8fr 1.2fr;gap:70px;align-items:center}}
.about .photo{{aspect-ratio:4/5}}
.about p{{font-size:17px;line-height:1.75;color:#2b2a27;margin-bottom:18px}}
.tags{{display:flex;flex-wrap:wrap;gap:10px;margin-top:26px}}
.tags span{{border:1px solid #c9c6bf;border-radius:999px;padding:8px 14px;font-size:13px;color:#2b2a27}}
.grid4{{display:grid;grid-template-columns:repeat(4,1fr);gap:18px;margin-top:56px}}
.card{{background:linear-gradient(180deg,#121212,#0d0d0d);border:1px solid var(--line);border-radius:18px;padding:30px 26px;transition:transform .3s,border-color .3s}}
.card:hover{{transform:translateY(-6px);border-color:rgba(212,163,42,.55)}}
.card .n{{font-family:"Bebas Neue";font-size:40px;color:var(--gold)}}
.card h3{{font-size:19px;margin:14px 0 10px;font-weight:600}}
.card p{{font-size:14.5px;line-height:1.6;color:#aeaca5}}
.proj{{display:grid;grid-template-columns:repeat(3,1fr);gap:20px;margin-top:56px}}
.pc{{background:#fff;border:1px solid #dcd9d2;border-radius:18px;padding:30px;display:flex;flex-direction:column;transition:transform .3s,box-shadow .3s}}
.pc:hover{{transform:translateY(-6px);box-shadow:0 24px 50px rgba(0,0,0,.08)}}
.pc .tag{{font-size:11px;letter-spacing:.2em;text-transform:uppercase;color:#8a6a12;font-weight:600}}
.pc h3{{font-family:"Playfair Display",serif;font-size:26px;margin:12px 0;color:#0d0d0d}}
.pc p{{font-size:15px;line-height:1.6;color:#3a3936;flex:1}}
.pc a{{margin-top:22px;font-weight:600;font-size:14px;color:#0e1a2b;border-bottom:1px solid #d4a32a;align-self:flex-start;padding-bottom:3px}}
.pc.full{{grid-column:1/-1}}
.pc.wide{{grid-column:span 2;background:var(--navy);color:var(--fg);border-color:var(--navy)}}
.pc.wide h3{{color:var(--fg)}}.pc.wide p{{color:#c9c7c0}}.pc.wide .tag{{color:var(--gold2)}}.pc.wide a{{color:var(--gold2)}}
.timeline{{margin-top:56px;border-left:1px solid var(--line);padding-left:34px}}
.ti{{position:relative;padding-bottom:40px}}
.ti::before{{content:"";position:absolute;left:-40px;top:6px;width:11px;height:11px;border-radius:50%;background:var(--gold);box-shadow:0 0 0 6px rgba(212,163,42,.15)}}
.ti .when{{font-family:"Bebas Neue";font-size:24px;color:var(--gold2)}}
.ti h3{{font-size:20px;margin:4px 0 6px}}
.ti p{{color:#aeaca5;font-size:15px;line-height:1.6;max-width:680px}}
.content{{display:grid;grid-template-columns:1.1fr .9fr;gap:24px;margin-top:56px}}
.feature{{position:relative;border-radius:22px;padding:44px;background:linear-gradient(135deg,var(--navy) 0%,#0a0a0a 100%);border:1px solid rgba(212,163,42,.35);overflow:hidden}}
.feature .bebas{{font-size:120px;line-height:.9;color:var(--gold2)}}
.feature h3{{font-family:"Playfair Display",serif;font-size:34px;margin:10px 0 14px}}
.feature p{{color:#c9c7c0;line-height:1.65;margin-bottom:28px;max-width:440px}}
.list a{{display:flex;justify-content:space-between;align-items:center;padding:24px 4px;border-bottom:1px solid var(--line);font-size:17px;transition:padding .2s,color .2s}}
.list a:hover{{padding-left:12px;color:var(--gold2)}}
.list small{{display:block;font-size:13px;color:var(--mute);margin-top:4px}}
.contact{{text-align:center;background:radial-gradient(ellipse at 50% 0%,#16263d 0%,#0a0a0a 60%)}}
.contact h2{{font-size:clamp(40px,6vw,80px)}}
.contact .ctas{{justify-content:center}}
.lk{{max-width:560px;margin:44px auto 0;text-align:left}}
.lk a,.lk div.soon{{display:flex;align-items:center;gap:18px;border:1px solid var(--line);border-radius:16px;padding:18px 20px;margin-bottom:12px;transition:background .2s,border-color .2s}}
.lk a:hover{{background:#151515;border-color:rgba(212,163,42,.55)}}
.lk .main{{background:var(--fg);color:#0a0a0a;border-color:var(--fg)}}
.lk .main:hover{{background:#fff}}
.lk .n{{font-family:"Bebas Neue";font-size:30px;min-width:36px}}
.lk .t{{flex:1;font-weight:600;font-size:16px;line-height:1.3}}
.lk .t small{{display:block;font-weight:400;font-size:13px;color:#8d8c87;margin-top:3px}}
.lk .main .t small{{color:#4a4945}}
.lk .tag{{font-size:10px;letter-spacing:.18em;text-transform:uppercase;border:1px solid currentColor;border-radius:99px;padding:5px 10px;opacity:.75;white-space:nowrap}}
.lk .soon{{opacity:.5}}

/* upgrades */
.prog{{position:fixed;top:0;left:0;height:2px;width:100%;background:var(--gold);transform-origin:0 50%;transform:scaleX(0);z-index:60}}
body::after{{content:"";position:fixed;inset:0;pointer-events:none;z-index:80;opacity:.05;background:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}}
.marq{{overflow:hidden;border-bottom:1px solid var(--line);background:#0a0a0a;padding:18px 0}}
.marq .tr{{display:flex;gap:56px;width:max-content;animation:mq 38s linear infinite}}
.marq span{{font-family:"Bebas Neue";font-size:26px;letter-spacing:.06em;color:#cfcdc6;white-space:nowrap}}
.marq span i{{color:var(--gold);font-style:normal;margin-right:56px}}
@keyframes mq{{to{{transform:translateX(-50%)}}}}
.idx{{font-family:"Playfair Display",serif;font-style:italic;color:var(--gold);font-size:18px;margin-right:10px;letter-spacing:0;text-transform:none}}
.light .idx{{color:#8a6a12}}
.sl .w{{display:inline-block;overflow:hidden;vertical-align:top}}
.sl .w>span{{display:inline-block;transform:translateY(105%);transition:transform .9s cubic-bezier(.2,.7,.1,1)}}
.sl.on .w>span{{transform:none}}
.pill{{position:fixed;right:22px;bottom:22px;z-index:55;display:flex;align-items:center;gap:10px;background:var(--gold);color:#0a0a0a;font-weight:600;font-size:14px;padding:14px 20px;border-radius:999px;box-shadow:0 14px 40px rgba(0,0,0,.45);transform:translateY(140%);transition:transform .45s cubic-bezier(.2,.7,.1,1)}}
.pill.show{{transform:none}}
.cur{{position:fixed;left:0;top:0;width:34px;height:34px;border:1px solid var(--gold);border-radius:50%;pointer-events:none;z-index:90;transform:translate(-50%,-50%);transition:width .25s,height .25s,background .25s;mix-blend-mode:difference}}
.cur.big{{width:64px;height:64px;background:rgba(212,163,42,.25)}}
@media (hover:none){{.cur{{display:none}}}}
.faq{{max-width:820px;margin-top:48px}}
.faq details{{border-bottom:1px solid #d3d0c8;padding:22px 0}}
.faq summary{{cursor:pointer;list-style:none;display:flex;justify-content:space-between;gap:20px;font-size:19px;font-weight:600;color:#111}}
.faq summary::-webkit-details-marker{{display:none}}
.faq summary::after{{content:"+";font-family:"Bebas Neue";font-size:30px;color:#8a6a12;line-height:.8;transition:transform .3s}}
.faq details[open] summary::after{{transform:rotate(45deg)}}
.faq p{{margin-top:12px;font-size:16px;line-height:1.65;color:#3a3936}}
.brand{{display:grid;grid-template-columns:.9fr 1.1fr;gap:60px;align-items:center}}
.brandbox{{border:1px solid rgba(212,163,42,.4);border-radius:22px;padding:56px 40px;background:linear-gradient(135deg,var(--navy),#0a0a0a);display:grid;place-items:center;min-height:320px}}
.brandbox img{{width:100%;max-width:440px}}
.ez{{font-family:"Playfair Display",serif;font-size:22px;line-height:1.6;color:#cfcdc6}}
.ez b{{color:var(--gold2);font-weight:700}}
@media (max-width:960px){{.brand{{grid-template-columns:1fr}}.pill{{left:16px;right:16px;justify-content:center}}}}
@media (prefers-reduced-motion:reduce){{.marq .tr{{animation:none}}.sl .w>span{{transform:none}}}}
footer{{border-top:1px solid var(--line);padding:30px 0;color:var(--mute);font-size:13px}}
footer .wrap{{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap}}
.rv{{opacity:0;transform:translateY(28px);transition:opacity .9s ease,transform .9s ease}}
.rv.on{{opacity:1;transform:none}}
@media (prefers-reduced-motion:reduce){{.rv{{opacity:1;transform:none;transition:none}}html{{scroll-behavior:auto}}}}
@media (max-width:960px){{
 .links{{display:none}}.menu{{display:block}}
 .links.open{{display:flex;position:absolute;top:72px;left:0;right:0;flex-direction:column;background:#0a0a0a;padding:20px 28px;border-bottom:1px solid var(--line)}}
 .hero,.about,.content{{grid-template-columns:1fr}}
 .hero .photo{{max-width:420px}}
 .grid4{{grid-template-columns:1fr 1fr}}.proj{{grid-template-columns:1fr}}.pc.wide,.pc.full{{grid-column:auto}}
 .stats .wrap{{grid-template-columns:1fr 1fr}}.stat:nth-child(2){{border-right:0}}.stat{{border-bottom:1px solid var(--line)}}
 section{{padding:84px 0}} #gl{{width:120vw;right:-40%;opacity:.35}}
}}
@media (max-width:560px){{.grid4{{grid-template-columns:1fr}}.feature .bebas{{font-size:84px}}}}
__GXCSS__
</style></head>
<body>
<div class="prog" id="prog"></div><div class="cur" id="cur"></div>
<a class="pill" id="pill" data-manual href="{MANUAL}" target="_blank" rel="noopener">Manual do IR 2027 grátis &rarr;</a>
<nav id="nav"><div class="wrap">
  <a href="#topo" class="logo"><img src="{MONO}" alt="Monograma EZ Contabilidade" style="width:40px;height:40px">EMANUEL LUZ</a>
  <div class="links" id="links"><a href="#normas">Normas</a><a href="#desafio">Desafio</a><a href="#atuacao">Atuação</a><a href="#conteudo">Grátis</a><a href="#projetos">Projetos</a><a href="#sobre">Sobre</a><a href="#marca">Marca</a><a href="#local">Local</a><a href="#faq">FAQ</a><a href="#contato">Links</a></div>
  <button class="menu" id="menu" aria-label="Abrir menu">&#9776;</button>
</div></nav>

<header id="topo">
  <div class="hero-type" aria-hidden="true">EZ</div>
  <canvas id="gl" aria-hidden="true"></canvas><canvas id="gl2" aria-hidden="true"></canvas>
  <div class="wrap hero">
    <div class="rv">
      <div class="kick">Contabilidade &middot; Estratégia &middot; Tecnologia</div>
      <h1>Contabilidade<br>que <span class="ol">pensa</span><br><i>em dados.</i></h1>
      <p class="lead">Explico impostos, reforma tributária e inteligência artificial para quem quer decidir melhor. Sou Emanuel Luz, Ciências Contábeis na UEFS e aprovado no Exame do CFC.</p>
      <div class="ctas">
        <a class="btn gold" href="{MANUAL}" target="_blank" rel="noopener">Baixar o Manual do IR 2027 &rarr;</a>
        <a class="btn ghost" href="#normas">Explorar as normas</a>
      </div>
      <div class="hero-cta2"><span class="live"></span><span>Novo: mapa gratuito com <b id="heroN">200</b> normas do CFC e atos da reforma. <a href="#normas">Abrir a galáxia</a></span></div>
    </div>
    <div class="hero-photo-wrap rv"><div class="ring"></div><div class="gmode hmode"><button data-hv="1" class="on"><b>1</b><span>Rede</span></button><button data-hv="2"><b>2</b><span>Satélite</span></button></div>
      <div class="photo"><img src="data:image/jpeg;base64,{A}" alt="Emanuel Luz de terno, sentado em uma poltrona, em preto e branco">
      <div class="badge"><b>Aprovado</b>Exame de Suficiência CFC 2/2026</div></div>
      <span class="chip3 c1"><i></i>IBS &middot; CBS</span><span class="chip3 c2"><i></i>IFRS</span><span class="chip3 c3"><i></i>NBC TG</span><span class="chip3 c4"><i></i>IA aplicada</span>
    </div>
  </div>
  <div class="scroll">ROLE &darr;</div>
  <div class="floor3d" aria-hidden="true"></div>
</header>

<div class="marq" aria-hidden="true"><div class="tr">
  <span><i>&#9670;</i>Ciências Contábeis UEFS</span><span><i>&#9670;</i>Aprovado no Exame CFC 2/2026</span><span><i>&#9670;</i>Tech Lead Contador do Amanhã</span><span><i>&#9670;</i>Diretor de Projetos Consulte Jr.</span><span><i>&#9670;</i>Comercial Ambev</span><span><i>&#9670;</i>Fundador Quality Jacuípe</span>
  <span><i>&#9670;</i>Ciências Contábeis UEFS</span><span><i>&#9670;</i>Aprovado no Exame CFC 2/2026</span><span><i>&#9670;</i>Tech Lead Contador do Amanhã</span><span><i>&#9670;</i>Diretor de Projetos Consulte Jr.</span><span><i>&#9670;</i>Comercial Ambev</span><span><i>&#9670;</i>Fundador Quality Jacuípe</span>
</div></div>
<div class="stats"><div class="wrap">
  <div class="stat rv"><div class="bebas">CFC</div><p>Aprovado no Exame de Suficiência 2/2026</p></div>
  <div class="stat rv"><div class="bebas">Tech Lead</div><p>Projeto de extensão Contador do Amanhã, IA na contabilidade</p></div>
  <div class="stat rv"><div class="bebas">Diretor</div><p>Diretoria de Projetos da Consulte Jr., empresa júnior da UEFS</p></div>
  <div class="stat rv"><div class="bebas">Fundador</div><p>Quality Jacuípe Desenvolvimento Digital</p></div>
</div></div>

<section id="normas"><div class="wrap">
  <div class="gx-head rv">
    <div><div class="kick"><span class="idx">&#9670;</span>Mapa gratuito</div><h2 class="sl">A galáxia das <i>normas contábeis.</i></h2>
    <p class="sub">Todas as Normas Brasileiras de Contabilidade do CFC e os atos da reforma tributária em um só lugar. Pesquise, filtre e exporte para a sua própria IA. Cada norma aberta vale XP. De graça.</p></div>
    <div class="gx-count"><div><b id="gxN">0</b><span>Normas CFC</span></div><div><b id="gxR">0</b><span>Atos da reforma</span></div><div><b id="gxG">0</b><span>Grupos</span></div></div>
  </div>
  <div class="gx-bar rv"><label class="gx-search"><span aria-hidden="true">&#9906;</span><input id="gxQ" type="search" placeholder="Busque: estoques, IFRS 16, CBS, auditoria, LC 214..." autocomplete="off" aria-label="Buscar normas"><kbd>/</kbd></label></div>
  <div class="gx-chips" id="gxChips"></div>
  <div class="gx-day rv" id="gxDay" role="button" tabindex="0"></div>
  <div class="gx-stage rv">
    <canvas id="gx" aria-label="Mapa interativo das normas contábeis"></canvas>
    <div class="gx-tip" id="gxTip"></div><div class="gx-cap" id="gxCap"></div>
    <div class="gx-tools"><button id="gxIn" aria-label="Aproximar">+</button><button id="gxOut" aria-label="Afastar">&minus;</button><button id="gxReset" aria-label="Centralizar">&#8634;</button><button id="gxTour">&#9654; Tour</button></div>
    <div class="gx-hint">Arraste &middot; Role para zoom &middot; Clique numa estrela</div>
    <aside class="gx-panel" id="gxPanel" aria-live="polite"></aside>
  </div>
  <div class="gx-export">
    <div class="gx-list" id="gxList" aria-label="Lista de resultados"></div>
    <div class="gx-box">
      <div class="kick">Leve para a sua IA</div>
      <h3>Exporte o que você filtrou.</h3>
      <p>Filtre por grupo ou busca e copie o resultado. O prompt já vem pronto para colar no ChatGPT, Claude ou Gemini e transformar a IA em um assistente contábil com base nas normas.</p>
      <div class="sel" id="gxSel">0 itens</div>
      <div class="btns">
        <button class="btn gold" id="gxCpPrompt">Copiar prompt para IA <span>&rarr;</span></button>
        <button class="btn ghost" id="gxCpMd">Copiar em Markdown <span>MD</span></button>
        <button class="btn ghost" id="gxCpJson">Copiar em JSON <span>{{ }}</span></button>
      </div>
      <p class="note">Resumos educativos. Confira sempre o texto oficial antes de aplicar.</p>
    </div>
  </div>
  <p class="gx-src">Fontes: <a href="https://cfc.org.br/tecnica/normas-brasileiras-de-contabilidade/" target="_blank" rel="noopener">CFC, Normas Brasileiras de Contabilidade</a> &middot; <a href="https://www.planalto.gov.br/" target="_blank" rel="noopener">Planalto</a> &middot; <a href="https://www.gov.br/receitafederal/" target="_blank" rel="noopener">Receita Federal</a> &middot; Atualizado em __UPD__.</p>
</div></section>
<div class="gx-toast" id="gxToast"></div>


<section class="light" id="desafio"><div class="wrap qz-grid">
  <div class="rv"><div class="kick"><span class="idx">&#9670;</span>Desafio relâmpago</div><h2 class="sl">Você passaria no <i>Exame do CFC?</i></h2>
  <p class="sub">Cinco perguntas sobre normas e reforma tributária. Cada acerto vale 10 XP. Errou? A resposta leva você direto à norma na galáxia.</p></div>
  <div class="qz rv" id="ezQuiz"></div>
</div></section>
<section id="jornada"><div class="wrap">
  <div class="rv"><div class="kick"><span class="idx">&#9670;</span>Sua jornada</div><h2 class="sl">Do estágio a <i>Contador do Amanhã.</i></h2>
  <p class="sub">Explore o site, abra normas, faça o desafio e leve o conteúdo para a sua IA. Seu progresso fica salvo neste navegador.</p></div>
  <div class="ez-trail rv" id="ezTrail"></div>
  <div class="jn-grid">
    <div class="jn-lv rv"><div class="k">Seu nível</div><h3 id="ezLevelBig">Estagiário</h3><div class="big"><span id="ezXpBig">0</span> XP</div><p id="ezNext"></p>
      <ul><li><b>+10 XP</b> por seção explorada</li><li><b>+5 XP</b> por norma aberta na galáxia</li><li><b>+10 XP</b> por acerto no desafio</li><li><b>+15 XP</b> no tour guiado</li><li><b>+20 XP</b> ao exportar para a sua IA</li></ul></div>
    <div class="badges rv" id="ezBadges"></div>
  </div>
</div></section>
<section id="atuacao"><div class="wrap">
  <div class="rv"><div class="kick"><span class="idx">01</span>Atuação</div><h2 class="sl">Quatro frentes, <i>um objetivo.</i></h2><p class="sub">Levar a contabilidade para onde as decisões são tomadas: com dados, tecnologia e clareza.</p></div>
  <div class="grid4">
    <div class="card rv"><div class="n">01</div><h3>Contabilidade e tributos</h3><p>Reforma tributária, IBS e CBS, imposto de renda e planejamento tributário explicados com números reais.</p></div>
    <div class="card rv"><div class="n">02</div><h3>Auditoria e estratégia</h3><p>Leitura crítica de demonstrações, indicadores e processos. Do controle ao relatório que orienta a gestão.</p></div>
    <div class="card rv"><div class="n">03</div><h3>Tecnologia e IA</h3><p>Agentes de IA, automações e sistemas que tiram o trabalho repetitivo da rotina contábil.</p></div>
    <div class="card rv"><div class="n">04</div><h3>Consultoria</h3><p>Projetos de custos, processos, mercado e tributos para pequenos negócios, com a equipe da Consulte Jr.</p></div>
  </div>
</div></section>

<section class="light" id="conteudo"><div class="wrap">
  <div class="rv"><div class="kick"><span class="idx">02</span>Conteúdo gratuito</div><h2 class="sl">Aprenda <i>de graça.</i></h2></div>
  <div class="content">
    <div class="feature rv" style="color:var(--fg)">
      <div class="bebas">IR 2027</div>
      <h3>Manual do IR 2027</h3>
      <p>Treze páginas com a isenção de R$ 5 mil, as tabelas, o alerta das duas rendas e os erros que levam à malha fina.</p>
      <a class="btn gold" href="{MANUAL}" target="_blank" rel="noopener">Baixar grátis &rarr;</a>
    </div>
    <div class="list rv">
      <a href="{IG}" target="_blank" rel="noopener"><span>Reforma tributária em 6 telas<small>Carrossel no Instagram</small></span>&rarr;</a>
      <a href="{IG}" target="_blank" rel="noopener"><span>O seu prato em 2027<small>Os dois lados da cesta básica</small></span>&rarr;</a>
      <a href="{IG}" target="_blank" rel="noopener"><span>Split payment explicado<small>O imposto antes do caixa</small></span>&rarr;</a>
      <a href="{TAP}" target="_blank" rel="noopener"><span>Todos os links<small>emanuelluz.taplink.bio</small></span>&rarr;</a>
    </div>
  </div>
</div></section>

<section class="light" id="projetos" style="background:#e6e3dc"><div class="wrap">
  <div class="rv"><div class="kick"><span class="idx">03</span>Projetos</div><h2 class="sl">Projetos e <i>parcerias.</i></h2><p class="sub">Ferramentas reais, usadas em sala de aula, em consultoria e em negócios.</p></div>
  <div class="proj">
    <div class="pc wide rv"><div class="tag">Inteligência artificial &middot; UEFS</div><h3>ÍCARO</h3><p>Assistente de aula com voz e rosto holográfico, desenvolvido em colaboração com o Prof. Rômulo Benício para a 1ª Imersão Tecnológica Contábil da UEFS (ITCONT 2026), no projeto Contador do Amanhã.</p><a href="https://itcont-uefs.onrender.com/" target="_blank" rel="noopener">Ver o ÍCARO &rarr;</a></div>
    <div class="pc rv"><div class="tag">Consultoria &middot; Dados</div><h3>Plataforma de pesquisa de mercado</h3><p>Sistema próprio de coleta e análise usado pela Consulte Jr. Atendeu o maior case da empresa em 2026.</p></div>
    <div class="pc rv full"><div class="tag">Empresa &middot; Sistemas</div><h3>Quality Jacuípe</h3><p>Sistemas de gestão sob medida, calculadora de propostas, gerador de contratos e auditoria de sites. Parte da visão do Vale do Jacuípe.</p></div>
  </div>
</div></section>

<section class="light" id="sobre"><div class="wrap about">
  <div class="photo rv"><img src="data:image/jpeg;base64,{S}" alt="Emanuel Luz sorrindo, de terno e gravata, em preto e branco"></div>
  <div class="rv">
    <div class="kick"><span class="idx">04</span>Sobre</div>
    <h2 class="sl">Do balanço ao código, <i>no mesmo raciocínio.</i></h2>
    <p>Estou no 7º semestre de Ciências Contábeis na Universidade Estadual de Feira de Santana, com conclusão prevista para 2027. Fui aprovado no Exame de Suficiência do CFC em 2026.</p>
    <p>Atuo na área comercial da Ambev, dirijo a Diretoria de Projetos da Consulte Jr. e lidero a frente de tecnologia do Contador do Amanhã. Também fundei a Quality Jacuípe, onde desenvolvo sistemas sob medida.</p>
    <p>No Instagram, explico reforma tributária, imposto de renda e IA sem complicação.</p>
    <div class="tags"><span>Reforma tributária</span><span>Imposto de renda</span><span>Auditoria</span><span>Consultoria</span><span>Agentes de IA</span><span>Automação</span><span>Análise de dados</span></div>
  </div>
</div></section>

<section id="marca"><div class="wrap brand">
  <div class="brandbox rv"><img src="{LOGO}" alt="Logo EZ Contabilidade: Emanuel luZ"></div>
  <div class="rv">
    <div class="kick"><span class="idx">06</span>A marca</div>
    <h2 class="sl">EZ <i>Contabilidade.</i></h2>
    <p class="ez"><b>E</b> de Emanuel. <b>Z</b> de lu<b>Z</b>. <b>Contabilidade</b> como ofício.</p>
    <p class="sub" style="margin-top:18px">Uma marca que junta o meu nome à minha profissão. Contabilidade, consultoria e tecnologia com método e cuidado em cada detalhe. Em inglês, EZ Accounting.</p>
  </div>
</div></section>

<section id="trajetoria"><div class="wrap">
  <div class="rv"><div class="kick"><span class="idx">05</span>Trajetória</div><h2 class="sl">Passo a passo, <i>com método.</i></h2></div>
  <div class="timeline">
    <div class="ti rv"><div class="when">2027</div><h3>Conclusão de Ciências Contábeis, UEFS</h3><p>Formatura prevista para o primeiro semestre. TCC sobre educação financeira dos estudantes da UEFS.</p></div>
    <div class="ti rv"><div class="when">2026</div><h3>Aprovado no Exame de Suficiência do CFC</h3><p>Prova da FGV em setembro. Próximo passo: registro no CRC.</p></div>
    <div class="ti rv"><div class="when">2026</div><h3>Diretor de Projetos, Consulte Jr.</h3><p>Gestão de cinco consultores em projetos de custos, processos, marketing, tributos e pesquisa de mercado.</p></div>
    <div class="ti rv"><div class="when">2026</div><h3>Tech Lead, Contador do Amanhã</h3><p>Inteligência artificial e tecnologias emergentes na transformação da contabilidade. Desenvolvimento do ÍCARO com o Prof. Rômulo Benício.</p></div>
    <div class="ti rv"><div class="when">Hoje</div><h3>Estágio na área comercial da Ambev</h3><p>Apuração de resultados e indicadores de eficiência na operação de Feira de Santana.</p></div>
  </div>
</div></section>

<section class="light" id="faq"><div class="wrap">
  <div class="rv"><div class="kick"><span class="idx">07</span>Perguntas frequentes</div><h2 class="sl">Antes de <i>falar comigo.</i></h2></div>
  <div class="faq rv">
    <details><summary>Você já é contador registrado?</summary><p>Ainda não. Fui aprovado no Exame de Suficiência do CFC e conclúo o curso em 2027. Depois da formatura, faço o registro no CRC-BA.</p></details>
    <details><summary>O conteúdo substitui um contador?</summary><p>Não. Os posts e o manual são educativos. Para decidir sobre o seu caso, procure um contador registrado.</p></details>
    <details><summary>O Manual do IR 2027 é mesmo gratuito?</summary><p>Sim. São 13 páginas em PDF, sem cadastro. Também envio pelo direct para quem comenta IR nos meus posts.</p></details>
    <details><summary>Você desenvolve sites e sistemas?</summary><p>Sim, pela Quality Jacuípe: sistemas de gestão sob medida, sites e ferramentas para pequenos negócios.</p></details>
    <details><summary>Como falar com você?</summary><p>Pelo direct do Instagram @emanuelluz.contabilidade. Respondo projetos, parcerias e convites para palestras.</p></details>
  </div>
</div></section>


<section id="local"><div class="floor3d" aria-hidden="true"></div><div class="wrap loc">
  <div class="rv"><div class="kick"><span class="idx">&#9670;</span>Onde estou</div><h2 class="sl">De Feira de Santana <i>para o Brasil.</i></h2>
  <p class="sub">Minha base é Feira de Santana, na Bahia, a Princesa do Sertão. Daqui saem os conteúdos, os projetos e a galáxia de normas, de graça, para qualquer lugar.</p>
  <div class="coord">12°16&prime;S &middot; 38°58&prime;O<small>Feira de Santana &middot; Bahia &middot; Brasil</small></div>
  <div class="chips"><span><i></i>UEFS</span><span><i></i>Princesa do Sertão</span><span><i></i>Conteúdo online para todo o país</span></div></div>
  <div class="gstage rv" id="gstage"><div class="gmode"><button data-gm="1" class="on"><b>1</b><span>Tema EZ</span></button><button data-gm="2"><b>2</b><span>Satélite real</span></button></div><canvas id="globe" aria-label="Globo 3D com a localização de Feira de Santana, Bahia"></canvas>
    <div class="glbl" id="globeLbl"><div><b>Feira de Santana, BA</b><small>Você está aqui com a EZ</small></div></div>
    <div class="gtools"><span>Arraste para girar</span><button id="globeHome">&#9678; Centralizar</button></div></div>
</div><div class="wrap">
<div id="leis" class="rv"><div class="lhead"><div><div class="kick"><span class="idx">&#9670;</span>Leis contábeis no mapa</div><h3>Do Decreto-Lei 9.295 <i>às resoluções de hoje.</i></h3>
<p>As leis federais que regem a contabilidade, as resoluções do CFC e os atos contábeis da CVM, marcados no globo. Pesquise e ordene por data ou em ordem alfabética.</p></div><div id="lc"></div></div>
<div class="lctl"><label class="gx-search"><span aria-hidden="true">&#9906;</span><input id="lq" type="search" placeholder="Busque: 6.404, exame de suficiência, CPC 47, escrituração..." aria-label="Buscar leis contábeis"></label>
<select id="ls" aria-label="Ordenar"><option value="asc">Data: mais antigas</option><option value="desc">Data: mais recentes</option><option value="az">Ordem alfabética (A a Z)</option></select></div>
<div id="lchips"></div><div id="ll"></div>
<p class="lsrc">Fonte: acervo <a href="https://github.com/ctresb/leis" target="_blank" rel="noopener">ctresb/leis</a> (licença MIT), com textos convertidos de fontes oficiais. Confira sempre o Diário Oficial antes de citar. Imagens de satélite: NASA Blue Marble.</p></div>
</div></section>
<section class="contact" id="contato"><div class="floor3d" aria-hidden="true"></div><div class="wrap rv">
  <div class="kick">Contato</div>
  <h2 class="sl">Vamos <i>conversar?</i></h2>
  <p class="sub" style="margin:0 auto">Projetos, palestras, parcerias ou uma dúvida sobre impostos. Me chame no Instagram.</p>
  <div class="lk">
    <a class="main" href="{MANUAL}" target="_blank" rel="noopener"><span class="n">01</span><span class="t">Manual do IR 2027<small>Guia gratuito em PDF, 13 páginas</small></span><span class="tag">Grátis</span></a>
    <div class="soon"><span class="n">02</span><span class="t">Notícias diárias no WhatsApp<small>Resumo de contabilidade todo dia</small></span><span class="tag">Em breve</span></div>
    <div class="soon"><span class="n">03</span><span class="t">Agente de IA: Assistente da Reforma<small>Tire dúvidas sobre IBS e CBS</small></span><span class="tag">Em breve</span></div>
    <a href="{IG}" target="_blank" rel="noopener"><span class="n">04</span><span class="t">Instagram<small>@emanuelluz.contabilidade</small></span><span>&rarr;</span></a>
    <a href="https://www.instagram.com/cont_amanha/" target="_blank" rel="noopener"><span class="n">05</span><span class="t">Projeto Contador do Amanhã<small>IA na contabilidade | UEFS</small></span><span>&rarr;</span></a>
  </div>
</div></section>

<footer><div class="floor3d" aria-hidden="true" style="height:100%"></div><div class="wrap"><span>&copy; 2026 EZ Contabilidade &middot; Emanuel Luz &middot; Feira de Santana, Bahia &middot; <i class="serif">Contabilidade com método.</i></span><span>Conteúdo educativo. Não substitui a orientação de um contador.</span></div></footer>

<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
<script>
(function(){{
  var nav=document.getElementById('nav');
  addEventListener('scroll',function(){{nav.classList.toggle('solid',scrollY>40)}});
  var m=document.getElementById('menu'),l=document.getElementById('links');
  m.addEventListener('click',function(){{l.classList.toggle('open')}});
  l.querySelectorAll('a').forEach(function(a){{a.addEventListener('click',function(){{l.classList.remove('open')}})}});
  var io=new IntersectionObserver(function(es){{es.forEach(function(e){{if(e.isIntersecting){{e.target.classList.add('on');io.unobserve(e.target)}}}})}},{{threshold:.12}});
  document.querySelectorAll('.rv').forEach(function(el){{io.observe(el)}});
  var prog=document.getElementById('prog'),pill=document.getElementById('pill'),cont=document.getElementById('conteudo');
  function onS(){{var h=document.documentElement;prog.style.transform='scaleX('+(scrollY/(h.scrollHeight-innerHeight))+')';
    var r=cont.getBoundingClientRect();pill.classList.toggle('show',scrollY>innerHeight*.8&&!(r.top<innerHeight&&r.bottom>0))}}
  addEventListener('scroll',onS);onS();
  document.querySelectorAll('h2.sl').forEach(function(h){{
    var out='';h.childNodes.forEach(function(n){{
      if(n.nodeType===3){{n.textContent.split(/(\s+)/).forEach(function(w){{out+=/^\s+$/.test(w)?w:(w?'<span class="w"><span>'+w+'</span></span>':'')}})}}
      else if(n.nodeName==='BR'){{out+='<br>'}}
      else{{out+='<span class="w"><span>'+n.outerHTML+'</span></span>'}}
    }});h.innerHTML=out;
    h.querySelectorAll('.w>span').forEach(function(sp,i){{sp.style.transitionDelay=(i*60)+'ms'}});
    io.observe(h)}});
  var cur=document.getElementById('cur'),cx=0,cy=0,tx=0,ty=0;
  if(matchMedia('(hover:hover)').matches){{
    addEventListener('mousemove',function(e){{tx=e.clientX;ty=e.clientY}});
    (function f(){{cx+=(tx-cx)*.18;cy+=(ty-cy)*.18;cur.style.left=cx+'px';cur.style.top=cy+'px';requestAnimationFrame(f)}})();
    document.querySelectorAll('a,button,summary').forEach(function(el){{el.addEventListener('mouseenter',function(){{cur.classList.add('big')}});el.addEventListener('mouseleave',function(){{cur.classList.remove('big')}})}});
    document.querySelectorAll('.btn,.pill').forEach(function(b){{
      b.addEventListener('mousemove',function(e){{var r=b.getBoundingClientRect();b.style.transform='translate('+((e.clientX-r.left-r.width/2)*.25)+'px,'+((e.clientY-r.top-r.height/2)*.35)+'px)'}});
      b.addEventListener('mouseleave',function(){{b.style.transform=''}})}});
  }}
  // 3D network sphere
  var c=document.getElementById('gl');
  if(!window.THREE||!c) return;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var r=new THREE.WebGLRenderer({{canvas:c,alpha:true,antialias:true}});
  r.setPixelRatio(Math.min(devicePixelRatio,2));
  var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,100);cam.position.z=6.2;
  var g=new THREE.Group();sc.add(g);
  var N=180,pts=[];
  for(var i=0;i<N;i++){{var y=1-(i/(N-1))*2,rad=Math.sqrt(1-y*y),th=i*2.399963;pts.push(new THREE.Vector3(Math.cos(th)*rad,y,Math.sin(th)*rad).multiplyScalar(2))}}
  var pg=new THREE.BufferGeometry().setFromPoints(pts);
  g.add(new THREE.Points(pg,new THREE.PointsMaterial({{color:0xf0c75e,size:.05}})));
  var lp=[];for(var a=0;a<N;a++)for(var b=a+1;b<N;b++)if(pts[a].distanceTo(pts[b])<.62)lp.push(pts[a],pts[b]);
  g.add(new THREE.LineSegments(new THREE.BufferGeometry().setFromPoints(lp),new THREE.LineBasicMaterial({{color:0x8fa6c4,transparent:true,opacity:.35}})));
  var core=new THREE.Mesh(new THREE.IcosahedronGeometry(.9,1),new THREE.MeshBasicMaterial({{color:0xd4a32a,wireframe:true,transparent:true,opacity:.25}}));g.add(core);
  function size(){{var w=c.clientWidth,h=c.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}}
  size();addEventListener('resize',size);
  var mx=0,my=0;addEventListener('pointermove',function(e){{mx=e.clientX/innerWidth-.5;my=e.clientY/innerHeight-.5}});
  (function loop(t){{g.rotation.y=(reduce?0:t*.00015)+mx*.4;g.rotation.x=my*.3;core.rotation.y=-t*.0003;r.render(sc,cam);requestAnimationFrame(loop)}})(0);
}})();
</script>
<script>window.EZ_ASSETS={{mono:"{MONO}",logo:"{LOGO}",manual:"{MANUAL}",ig:"{IG}"}};window.GX=__GXDATA__;window.EZ_LAND=__LAND__;window.EZ_LEIS=__LEIS__;</script>
<script>__GAMEJS__</script>
<script>__GLOBEJS__</script>
<script>__LEISJS__</script>
<script>__GXJS__
(function(){{var done=false;function go(d){{if(done)return;done=true;window.GXinit(d)}}
try{{var t=setTimeout(function(){{go(window.GX)}},2500);fetch('data/galaxia.json',{{cache:'no-store'}}).then(function(r){{if(!r.ok)throw 0;return r.json()}}).then(function(d){{clearTimeout(t);go(d&&d.normas?d:window.GX)}}).catch(function(){{clearTimeout(t);go(window.GX)}})}}catch(e){{go(window.GX)}}}})();</script>
</body></html>'''
import datetime
def L(p):
    try: return json.load(open(p))
    except Exception as e: print('no data',p,e); return []
if subprocess.run([sys.executable,'tools/validar_dados.py'],cwd=ROOT).returncode: sys.exit('Build cancelado: corrija os erros de validacao.')
LS=L(P('data','links_status.json')) or {}
NOR=L(P('data','normas_cfc.json')); REF=L(P('data','reforma.json'))
UPD='12/11/2026'
data=json.dumps({'normas':NOR,'reforma':REF,'atualizado':UPD,'links_verificados':LS.get('verificado','') if isinstance(LS,dict) else ''},ensure_ascii=False).replace('</','<\\/')
html=html.replace('__LEIS__',json.dumps([{k:o[k] for k in ('titulo','tipo','data','ementa','orgao','url','arquivo')} for o in json.load(open(P('data','leis.json')))],ensure_ascii=False).replace('\u2014',',').replace('</','<\\/')).replace('__LAND__',open(P('data','land-dots.json')).read()).replace('__GXCSS__',open(P('src','galaxy.css')).read()+open(P('src','game.css')).read()).replace('__GXJS__',open(P('src','galaxy.js')).read()).replace('__GXDATA__',data).replace('__GAMEJS__',open(P('src','game.js')).read()).replace('__GLOBEJS__',open(P('src','globe.js')).read()).replace('__LEISJS__',open(P('src','leis.js')).read()).replace('__UPD__',UPD)
open(P('index.html'),'w').write(html)
open(P('data','galaxia.json'),'w').write(json.dumps({'normas':NOR,'reforma':REF,'atualizado':UPD,'links_verificados':LS.get('verificado','') if isinstance(LS,dict) else ''},ensure_ascii=False,indent=1))
print(len(html)//1024, "KB")
