// Leis contábeis no globo (fonte: github.com/ctresb/leis, licença MIT)
(function(){
  var D=(window.EZ_LEIS||[]).map(function(o){o.titulo=(o.titulo||'').replace(/\s+/g,' ').trim();o.h=norm([o.titulo,o.ementa,o.orgao,o.tipo,o.data].join(' '));return o});
  function norm(s){return (s||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
  function esc(s){return (s||'').replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
  function br(d){var p=(d||'').split('-');return p.length===3?p[2]+'/'+p[1]+'/'+p[0]:d}
  var st=document.getElementById('gstage'),q=document.getElementById('lq'),so=document.getElementById('ls'),list=document.getElementById('ll'),cnt=document.getElementById('lc'),chips=document.getElementById('lchips');
  if(!list)return;
  var org='*',lim=40;
  // version buttons 1 / 2
  document.querySelectorAll('[data-gm]').forEach(function(b){b.onclick=function(){var m=+b.getAttribute('data-gm');document.querySelectorAll('[data-gm]').forEach(function(x){x.classList.toggle('on',x===b)});if(window.EZGlobe)EZGlobe.mode(m)}});
  // pins
  var nB=D.filter(function(o){return o.orgao!=='CVM'}).length,nR=D.length-nB;
  function pinEl(txt,o){var e=document.createElement('button');e.className='lpin';e.innerHTML=txt;e.onclick=function(){setOrg(o);document.getElementById('leis').scrollIntoView({behavior:'smooth',block:'start'})};st.appendChild(e);return e}
  if(window.EZGlobe&&EZGlobe.pins)EZGlobe.pins([
    {lat:-15.7939,lon:-47.8828,n:nB,el:pinEl('<b>Brasília</b>'+nB+' normas &middot; Federal e CFC','BSB')},
    {lat:-22.9068,lon:-43.1729,n:nR,el:(function(e){e.classList.add('dn');return e})(pinEl('<b>Rio de Janeiro</b>'+nR+' normas &middot; CVM','CVM'))}]);
  var ORGS=[['*','Todas'],['Federal','Leis federais'],['CFC','CFC'],['CVM','CVM']];
  chips.innerHTML=ORGS.map(function(o){var n=o[0]==='*'?D.length:D.filter(function(x){return x.orgao===o[0]}).length;return '<button data-o="'+o[0]+'">'+o[1]+' <small>'+n+'</small></button>'}).join('');
  chips.onclick=function(e){var b=e.target.closest('button');if(b)setOrg(b.getAttribute('data-o'))};
  function setOrg(o){org=o;lim=40;chips.querySelectorAll('button').forEach(function(b){var k=b.getAttribute('data-o');b.classList.toggle('on',k===o||(o==='BSB'&&(k==='Federal'||k==='CFC')))});render()}
  function render(){var k=norm(q.value.trim()),s=so.value;
    var r=D.filter(function(o){return (org==='*'||o.orgao===org||(org==='BSB'&&o.orgao!=='CVM'))&&(!k||o.h.indexOf(k)>=0)});
    r.sort(s==='az'?function(a,b){return a.titulo.localeCompare(b.titulo,'pt',{numeric:true})}:s==='desc'?function(a,b){return b.data.localeCompare(a.data)||a.titulo.localeCompare(b.titulo,'pt')}:function(a,b){return a.data.localeCompare(b.data)||a.titulo.localeCompare(b.titulo,'pt')});
    cnt.textContent=r.length+(r.length===1?' norma':' normas');
    if(!r.length){list.innerHTML='<div class="lempty">Nada encontrado. Tente "6.404", "exame de suficiência", "CPC 47" ou "Simples".</div>';return}
    list.innerHTML=r.slice(0,lim).map(function(o){return '<article class="lrow"><div class="ld">'+br(o.data)+'<span class="lo '+o.orgao.toLowerCase()+'">'+o.orgao+'</span></div><div class="lt"><b>'+esc(o.titulo)+'</b><p>'+esc(o.ementa)+'</p><div class="la">'+(o.url?'<a href="'+esc(o.url)+'" target="_blank" rel="noopener">Texto oficial &rarr;</a>':'')+'<a href="https://github.com/ctresb/leis/blob/main/'+encodeURI(o.arquivo)+'" target="_blank" rel="noopener">Ver no acervo</a></div></div></article>'}).join('')+
      (r.length>lim?'<button class="lmore" id="lmore">Mostrar mais '+Math.min(40,r.length-lim)+' de '+(r.length-lim)+'</button>':'');
    var m=document.getElementById('lmore');if(m)m.onclick=function(){lim+=40;render()}}
  var t;q.addEventListener('input',function(){clearTimeout(t);t=setTimeout(function(){lim=40;render()},120)});so.onchange=function(){lim=40;render()};
  setOrg('*');
})();
