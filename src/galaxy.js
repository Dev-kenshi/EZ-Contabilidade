window.GXinit=function(D){
  D=D||{normas:[],reforma:[]};
  var PAL={"NBC TG":"#f0c75e","NBC TSP":"#a9c0e0","NBC TA":"#ffffff","NBC TR":"#e6dcc4","NBC TO":"#cfc6b2","NBC TSC":"#d9cfe6","NBC TI":"#bfc8d6","NBC TP":"#e8d9a8","NBC PG":"#f7ecc8","NBC PA":"#d6d0c4","NBC PI":"#b8c4d2","NBC PP":"#d9c79a","NBC TDS":"#b9d4b0","ITG":"#efe2b8","CTG":"#c7c1b4","CTA":"#e2ddd2","CTO":"#c4bdb0","CTSC":"#c8c2cf","Reforma Tributária":"#ffd76a"};
  var NAMES={"NBC TG":"Normas gerais (IFRS)","NBC TSP":"Setor público","NBC TA":"Auditoria independente","NBC TR":"Revisão","NBC TO":"Asseguração","NBC TSC":"Serviços correlatos","NBC TI":"Auditoria interna","NBC TP":"Perícia","NBC PG":"Profissional geral e ética","NBC PA":"Auditor independente","NBC PI":"Auditor interno","NBC PP":"Perito","NBC TDS":"Sustentabilidade","ITG":"Interpretações","CTG":"Comunicados gerais","CTA":"Comunicados de auditoria","CTO":"Comunicados de asseguração","CTSC":"Comunicados de serviços","Reforma Tributária":"IBS, CBS e IS"};
  var items=[];
  (D.normas||[]).forEach(function(n){var g=n.grupo||'Outras';items.push({k:'n',codigo:n.codigo,titulo:n.titulo,grupo:g,correlacao:n.correlacao||'',resumo:n.resumo||'',url:n.url||'',pg:n.pagina_grupo||'',arq:n.arquivo||''})});
  (D.reforma||[]).forEach(function(n){items.push({k:'r',codigo:n.codigo,titulo:n.titulo,grupo:'Reforma Tributária',tipo:n.tipo||'',data:n.data||'',resumo:n.resumo||'',url:n.url||'',verificar:!!n.verificar})});
  var groups=[];items.forEach(function(it){if(groups.indexOf(it.grupo)<0)groups.push(it.grupo)});
  var order=Object.keys(PAL);groups.sort(function(a,b){var x=order.indexOf(a),y=order.indexOf(b);return (x<0?99:x)-(y<0?99:y)});
  function col(g){return PAL[g]||'#cfcdc6'}
  function norm(s){return (s||'').toString().normalize('NFD').replace(/[̀-ͯ]/g,'').toLowerCase()}
  items.forEach(function(it){it.hay=norm([it.codigo,it.titulo,it.grupo,NAMES[it.grupo],it.correlacao,it.resumo,it.tipo,it.data].join(' '))});

  // counts
  var cN=document.getElementById('gxN'),cR=document.getElementById('gxR'),cG=document.getElementById('gxG');
  if(cN)cN.textContent=items.filter(function(i){return i.k==='n'}).length;
  if(cR)cR.textContent=items.filter(function(i){return i.k==='r'}).length;
  if(cG)cG.textContent=groups.length;
  var hn=document.getElementById('heroN');if(hn)hn.textContent=items.length;

  // layout
  var nonR=groups.filter(function(g){return g!=='Reforma Tributária'});
  var centers={};
  var byG={};items.forEach(function(it){(byG[it.grupo]=byG[it.grupo]||[]).push(it)});
  var big=nonR.filter(function(g){return g!=='NBC TG'&&byG[g].length>=10}),small=nonR.filter(function(g){return g!=='NBC TG'&&byG[g].length<10});
  centers['NBC TG']={x:0,y:-10};
  big.forEach(function(g,i){var a=-Math.PI/2+i/big.length*Math.PI*2+.35;centers[g]={x:Math.cos(a)*410,y:Math.sin(a)*250}});
  small.forEach(function(g,i){var a=-Math.PI/2+(i+.5)/small.length*Math.PI*2;centers[g]={x:Math.cos(a)*700,y:Math.sin(a)*420}});
  nonR.forEach(function(g){var arr=byG[g],c=centers[g];var k=g==='NBC TG'?17:13;
    arr.forEach(function(it,i){var r=k*Math.sqrt(i+1.5),a=i*2.399963;it.bx=c.x;it.by=c.y;it.r=r;it.a=a;it.sp=(0.00004+Math.random()*0.00004)*(i%2?1:-1)*(60/(r+20))});
    c.rad=k*Math.sqrt(arr.length+1.5)+16;
  });
  var R=byG['Reforma Tributária']||[];
  R.sort(function(a,b){return (a.data||'').localeCompare(b.data||'')});
  var yrs={};
  R.forEach(function(it,i){var t=R.length>1?i/(R.length-1):0;var a=Math.PI*(0.62+t*1.5);var rr=820+t*260;
    it.bx=Math.cos(a)*rr*1.12;it.by=Math.sin(a)*rr*.66;it.r=0;it.a=0;it.sp=0;it.arm=true;
    var y=(it.data||'').slice(0,4);if(y&&!yrs[y]){yrs[y]=1;it.yr=y}});
  if(R.length){var mid=R[Math.floor(R.length*.3)];centers['Reforma Tributária']={x:mid.bx-40,y:mid.by+70,rad:40,arm:true}}

  var PORT=(document.getElementById('gx')||{}).clientWidth<(document.getElementById('gx')||{}).clientHeight;
  if(PORT){items.forEach(function(it){var x=it.bx;it.bx=it.by;it.by=x});Object.keys(centers).forEach(function(k){var c=centers[k],x=c.x;c.x=c.y;c.y=x})}
  // label below cluster when it sits in the lower half
  Object.keys(centers).forEach(function(k){centers[k].below=centers[k].y>60&&!centers[k].arm});
  if(R.length&&!PORT){var lm=R.reduce(function(a,b){return b.by<a.by?b:a});centers['Reforma Tributária'].x=lm.bx;centers['Reforma Tributária'].y=lm.by-110}
  // canvas
  var cv=document.getElementById('gx');if(!cv)return;
  var ctx=cv.getContext('2d'),W=0,H=0,DPR=Math.min(devicePixelRatio||1,2);
  var view={x:0,y:0,s:.5},target={x:0,y:0,s:.5};
  function fit(){var w=cv.clientWidth,h=cv.clientHeight;var s=PORT?Math.min(w/1600,h/2500):Math.min(w/2550,h/1650);s=Math.max(.13,Math.min(.75,s));target.s=s;target.x=0;target.y=-40}
  function size(){W=cv.clientWidth;H=cv.clientHeight;cv.width=W*DPR;cv.height=H*DPR;ctx.setTransform(DPR,0,0,DPR,0,0)}
  size();fit();view.s=target.s*.6;view.x=target.x;view.y=target.y;
  addEventListener('resize',function(){size();});
  var bg=[];for(var i=0;i<260;i++)bg.push({x:Math.random()*2-1,y:Math.random()*2-1,z:Math.random(),t:Math.random()*6});

  var q='',off={},hover=null,sel=null;
  function vis(it){return !off[it.grupo]}
  function hit(it){return vis(it)&&(!q||it.hay.indexOf(q)>=0)}
  function filtered(){return items.filter(hit)}
  function toS(x,y){return {x:(x-view.x)*view.s+W/2,y:(y-view.y)*view.s+H/2}}
  function toW(x,y){return {x:(x-W/2)/view.s+view.x,y:(y-H/2)/view.s+view.y}}
  function pos(it,t){if(it.arm)return {x:it.bx,y:it.by};var a=it.a+t*it.sp*(reduce?0:1);return {x:it.bx+Math.cos(a)*it.r,y:it.by+Math.sin(a)*it.r*.82}}
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var visible=false;new IntersectionObserver(function(e){visible=e[0].isIntersecting}).observe(cv);
  var T=0;
  function draw(t){
    requestAnimationFrame(draw);if(!visible)return;T=t;
    view.x+=(target.x-view.x)*.12;view.y+=(target.y-view.y)*.12;view.s+=(target.s-view.s)*.12;
    ctx.clearRect(0,0,W,H);
    // background stars
    bg.forEach(function(b){var px=(b.x*W*.6+W/2-view.x*view.s*b.z*.15),py=(b.y*H*.6+H/2-view.y*view.s*b.z*.15);
      px=((px%W)+W)%W;py=((py%H)+H)%H;ctx.globalAlpha=.25+.35*Math.abs(Math.sin(t*.0008+b.t));ctx.fillStyle='#cfd8e6';ctx.fillRect(px,py,b.z*1.4+.4,b.z*1.4+.4)});
    ctx.globalAlpha=1;
    var anyQ=!!q;var nq=anyQ?filtered().length:0;
    // reform arm path
    if(R.length&&!off['Reforma Tributária']){ctx.beginPath();R.forEach(function(it,i){var p=toS(it.bx,it.by);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y)});
      ctx.strokeStyle='rgba(255,215,106,.4)';ctx.lineWidth=1.4;ctx.setLineDash([4,6]);ctx.stroke();ctx.setLineDash([])}
    // cluster glows + labels
    groups.forEach(function(g){var c=centers[g];if(!c||off[g])return;var p=toS(c.x,c.y);
      if(!c.arm){var rr=c.rad*view.s*1.5;var gr=ctx.createRadialGradient(p.x,p.y,0,p.x,p.y,rr);gr.addColorStop(0,hexA(col(g),anyQ?.05:.16));gr.addColorStop(1,hexA(col(g),0));ctx.fillStyle=gr;ctx.beginPath();ctx.arc(p.x,p.y,rr,0,7);ctx.fill()}
    });
    // constellations
    ctx.lineWidth=1;nonR.forEach(function(g){if(off[g])return;var arr=byG[g],c=col(g);ctx.strokeStyle=hexA(c,anyQ?.04:.16);ctx.beginPath();
      for(var i=1;i<arr.length;i++){var a=pos(arr[i-1],t),b=pos(arr[i],t);var pa=toS(a.x,a.y),pb=toS(b.x,b.y);ctx.moveTo(pa.x,pa.y);ctx.lineTo(pb.x,pb.y)}ctx.stroke()});
    // nodes
    var pts=[];
    items.forEach(function(it){if(!vis(it))return;var w=pos(it,t),p=toS(w.x,w.y);it.sx=p.x;it.sy=p.y;
      if(p.x<-20||p.y<-20||p.x>W+20||p.y>H+20)return;
      var m=hit(it),c=col(it.grupo);var base=(it.arm?5:(it.grupo==='NBC TG'?4:3.4))*Math.max(.8,Math.min(1.3,view.s*2.2));
      var a=anyQ?(m?1:.12):.9;
      if(m&&(anyQ||it===hover||it===sel)){ctx.globalAlpha=a*.35;ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,base*3.4,0,7);ctx.fill()}
      ctx.globalAlpha=a*.18;ctx.fillStyle=c;ctx.beginPath();ctx.arc(p.x,p.y,base*1.9,0,7);ctx.fill();ctx.globalAlpha=a;ctx.beginPath();ctx.arc(p.x,p.y,(it===hover||it===sel)?base*1.8:base,0,7);ctx.fill();
      if(window.EZG&&EZG.isSeen(it.codigo)){ctx.strokeStyle='rgba(240,199,94,'+a+')';ctx.lineWidth=1.3;ctx.beginPath();ctx.arc(p.x,p.y,base*2.4,0,7);ctx.stroke()}
      if((m&&anyQ&&(nq<=14||view.s>1.1))||(view.s>1.1&&m&&!anyQ)||it===hover||it===sel){pts.push(it)}
    });
    ctx.globalAlpha=1;
    // year ticks on the reform arm
    if(!off['Reforma Tributária']&&!anyQ){ctx.font='400 '+Math.round(Math.max(14,Math.min(26,40*view.s)))+'px "Bebas Neue", sans-serif';ctx.fillStyle='rgba(255,215,106,.95)';ctx.textAlign='center';
      var lx=-999,ly=-999;R.forEach(function(it){if(it.yr&&it.sx!=null&&Math.hypot(it.sx-lx,it.sy-ly)>52){lx=it.sx;ly=it.sy;var c=toS(0,-20);var dx=it.sx-c.x,dy=it.sy-c.y,l=Math.hypot(dx,dy)||1;ctx.fillText(it.yr,it.sx+dx/l*26,it.sy+dy/l*26+5)}})}
    // node labels
    ctx.font='600 11px Inter, sans-serif';ctx.textAlign='left';
    pts.forEach(function(it){ctx.fillStyle=it.arm?'rgba(255,230,160,.95)':'rgba(245,243,238,.95)';
      var lbl=it.arm?(it.codigo+(it.data?' · '+it.data.slice(0,4):'')):it.codigo;ctx.fillText(lbl,it.sx+8,it.sy+4)});
    // group labels
    groups.forEach(function(g){var c=centers[g];if(!c||off[g])return;var p=toS(c.x,c.y);var y=c.arm?p.y+28:(c.below?p.y+c.rad*view.s+22:p.y-c.rad*view.s-14);
      if(view.s<.3&&!c.arm&&(byG[g]||[]).length<10&&!off[g]&&groups.some(function(k){return !off[k]&&k!==g})){c.lx=null;return}
      ctx.textAlign='center';var fs=Math.round(Math.max(15,Math.min(30,32*view.s*2)));ctx.font='400 '+fs+'px "Bebas Neue", sans-serif';var txt=g==='Reforma Tributária'?'REFORMA TRIBUTÁRIA':g;var tw=ctx.measureText(txt).width;
      ctx.globalAlpha=anyQ?.35:1;rr(p.x-tw/2-12,y-fs*.82,tw+24,fs*1.12,fs*.56);ctx.fillStyle='rgba(8,10,16,.78)';ctx.fill();ctx.strokeStyle=hexA(col(g),.55);ctx.lineWidth=1;ctx.stroke();
      ctx.fillStyle=col(g);ctx.fillText(txt,p.x,y);ctx.globalAlpha=1;y+=6;
      if(view.s>.4){ctx.font='500 10.5px Inter, sans-serif';ctx.fillStyle='rgba(225,222,214,.78)';ctx.fillText((NAMES[g]||'')+' · '+(byG[g]||[]).length,p.x,y+15)}c.lx=p.x;c.ly=y});
  }
  function rr(x,y,w,h,r){ctx.beginPath();ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath()}
  function hexA(h,a){var n=parseInt(h.slice(1),16);return 'rgba('+(n>>16)+','+(n>>8&255)+','+(n&255)+','+a+')'}
  requestAnimationFrame(draw);

  // interaction
  var tip=document.getElementById('gxTip'),drag=null,moved=0,pinch=null,ptrs={};
  function pick(x,y){var best=null,bd=14*14;items.forEach(function(it){if(!vis(it)||it.sx==null)return;if(q&&!hit(it))return;var dx=it.sx-x,dy=it.sy-y,d=dx*dx+dy*dy;if(d<bd){bd=d;best=it}});return best}
  function pickGroup(x,y){var g=null;groups.forEach(function(k){var c=centers[k];if(c&&c.lx!=null&&Math.abs(c.lx-x)<60&&Math.abs(c.ly-y)<16)g=k});return g}
  function rel(e){var r=cv.getBoundingClientRect();return {x:e.clientX-r.left,y:e.clientY-r.top}}
  cv.addEventListener('pointerdown',function(e){cv.setPointerCapture(e.pointerId);ptrs[e.pointerId]=rel(e);var k=Object.keys(ptrs);
    if(k.length===2){var a=ptrs[k[0]],b=ptrs[k[1]];pinch={d:Math.hypot(a.x-b.x,a.y-b.y),s:target.s};drag=null}else{drag={x:e.clientX,y:e.clientY,vx:target.x,vy:target.y};moved=0;cv.classList.add('drag')}});
  cv.addEventListener('pointermove',function(e){var p=rel(e);if(ptrs[e.pointerId])ptrs[e.pointerId]=p;var k=Object.keys(ptrs);
    if(pinch&&k.length===2){var a=ptrs[k[0]],b=ptrs[k[1]];target.s=clamp(pinch.s*Math.hypot(a.x-b.x,a.y-b.y)/pinch.d);view.s=target.s;return}
    if(drag){var dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved=Math.max(moved,Math.abs(dx)+Math.abs(dy));target.x=drag.vx-dx/view.s;target.y=drag.vy-dy/view.s;view.x=target.x;view.y=target.y;tip.style.opacity=0;return}
    var it=pick(p.x,p.y);hover=it;cv.style.cursor=it||pickGroup(p.x,p.y)?'pointer':'grab';
    if(it){tip.innerHTML='<b>'+esc(it.grupo)+'</b>'+esc(it.codigo)+'<br>'+esc(it.titulo);tip.style.left=it.sx+'px';tip.style.top=it.sy+'px';tip.style.opacity=1}else tip.style.opacity=0});
  function up(e){delete ptrs[e.pointerId];if(Object.keys(ptrs).length<2)pinch=null;cv.classList.remove('drag');
    if(drag&&moved<6){var p=rel(e);var it=pick(p.x,p.y);if(it)open(it);else{var g=pickGroup(p.x,p.y);if(g)focusG(g)}}drag=null}
  cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  cv.addEventListener('pointerleave',function(){hover=null;tip.style.opacity=0});
  cv.addEventListener('wheel',function(e){e.preventDefault();var p=rel(e),w=toW(p.x,p.y);var ns=clamp(target.s*Math.exp(-e.deltaY*.0015));
    target.x=w.x-(p.x-W/2)/ns;target.y=w.y-(p.y-H/2)/ns;target.s=ns},{passive:false});
  function clamp(s){return Math.max(.18,Math.min(3.2,s))}
  function focusG(g){var c=centers[g];if(!c)return;target.x=c.x;target.y=c.y;target.s=clamp(c.arm?.7:Math.min(2.2,Math.min(W,H)/(c.rad*3.2)))}
  document.getElementById('gxIn').onclick=function(){target.s=clamp(target.s*1.35)};
  document.getElementById('gxOut').onclick=function(){target.s=clamp(target.s/1.35)};
  document.getElementById('gxReset').onclick=function(){fit()};
  function esc(s){return (s||'').toString().replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}

  // panel
  var pnl=document.getElementById('gxPanel');
  function open(it){sel=it;if(window.EZG)EZG.seen(it);var m='';
    if(it.correlacao)m+='<span>'+esc(it.correlacao)+'</span>';if(it.tipo)m+='<span>'+esc(it.tipo)+'</span>';if(it.data)m+='<span>'+esc(it.data)+'</span>';if(it.verificar)m+='<span class="warn">Conferir texto oficial</span>';
    pnl.innerHTML='<button class="x" aria-label="Fechar">&times;</button><div class="g">'+esc(it.grupo)+' &middot; '+esc(NAMES[it.grupo]||'')+'</div><h3>'+esc(it.codigo)+'</h3><div class="t">'+esc(it.titulo)+'</div><div class="m">'+m+'</div><p class="r">'+esc(it.resumo)+'</p><div class="acts">'+
      (it.url?'<a class="btn gold" href="'+esc(it.url)+'" target="_blank" rel="noopener">Abrir texto oficial &rarr;</a>':(it.pg?'<a class="btn gold" href="'+esc(it.pg)+'" target="_blank" rel="noopener">Ver no site do CFC &rarr;</a>':''))+'<button class="btn ghost" data-c="1">Copiar para minha IA</button><div class="gx-more">'+(it.k==='n'?'<a href="https://www.in.gov.br/consulta/-/buscar/dou?q=%22'+encodeURIComponent(it.codigo.replace(/\s*\(R\d+\)/,''))+'%22&s=todos&exactDate=all&sortType=0" target="_blank" rel="noopener">Buscar no Diário Oficial</a>':'')+(it.arq?'<a href="'+esc(it.arq)+'" target="_blank" rel="noopener" title="O servidor antigo do CFC costuma ser lento">Arquivo .doc do CFC (lento)</a>':'')+'</div>'+(D.links_verificados?'<p class="gx-ver">&#10003; Links verificados em '+esc(D.links_verificados)+'</p>':'')+'</div>';
    pnl.classList.add('open');pnl.querySelector('.x').onclick=function(){pnl.classList.remove('open');sel=null};
    pnl.querySelector('[data-c]').onclick=function(){copy(md([it])+'\n'+SRC,'Norma copiada');if(window.EZG)EZG.exported()};
    var w=pos(it,T);target.x=w.x+(W>700?120/target.s:0);target.y=w.y;if(target.s<.8)target.s=.9;
  }

  // filters UI
  var chips=document.getElementById('gxChips'),inp=document.getElementById('gxQ'),list=document.getElementById('gxList'),selN=document.getElementById('gxSel');
  var h='<button class="gx-chip all" data-g="*">Todos</button>';
  groups.forEach(function(g){h+='<button class="gx-chip" data-g="'+esc(g)+'"><i style="background:'+col(g)+'"></i>'+esc(g==='Reforma Tributária'?'Reforma':g)+' <small>'+byG[g].length+'</small></button>'});
  chips.innerHTML=h;
  chips.addEventListener('click',function(e){var b=e.target.closest('.gx-chip');if(!b)return;var g=b.getAttribute('data-g');
    if(g==='*'){off={}}else{var allOn=groups.every(function(k){return !off[k]});if(allOn){groups.forEach(function(k){off[k]=k!==g})}else{off[g]=!off[g];if(groups.every(function(k){return off[k]}))off={}}}
    chips.querySelectorAll('.gx-chip[data-g]').forEach(function(c){var k=c.getAttribute('data-g');if(k!=='*')c.classList.toggle('off',!!off[k])});
    var on=groups.filter(function(k){return !off[k]});if(on.length===1)focusG(on[0]);else fit();refresh()});
  var tmr;inp.addEventListener('input',function(){clearTimeout(tmr);tmr=setTimeout(function(){q=norm(inp.value.trim());refresh();
    var f=filtered();if(q&&f.length&&f.length<=40){var sx=0,sy=0;f.forEach(function(it){var w=pos(it,T);sx+=w.x;sy+=w.y});target.x=sx/f.length;target.y=sy/f.length;if(f.length===1){target.s=1.4}}},120)});
  addEventListener('keydown',function(e){if(e.key==='/'&&document.activeElement!==inp&&!/INPUT|TEXTAREA/.test(document.activeElement.tagName)){var r=cv.getBoundingClientRect();if(r.top<innerHeight&&r.bottom>0){e.preventDefault();inp.focus()}}if(e.key==='Escape'){pnl.classList.remove('open');sel=null}});
  function refresh(){var f=filtered();selN.textContent=f.length+(f.length===1?' item':' itens');
    if(!f.length){list.innerHTML='<div class="empty">Nada encontrado. Tente "estoques", "IFRS 16", "CBS" ou "auditoria".</div>';return}
    var out='';f.slice(0,300).forEach(function(it,i){out+='<div class="row" data-i="'+items.indexOf(it)+'"><b>'+esc(it.codigo)+'</b><span>'+esc(it.titulo)+'</span><em>'+esc(it.correlacao||it.data||it.grupo)+'</em></div>'});
    if(f.length>300)out+='<div class="empty">+'+(f.length-300)+' itens. Refine a busca.</div>';list.innerHTML=out}
  list.addEventListener('click',function(e){var r=e.target.closest('.row');if(!r)return;var it=items[+r.getAttribute('data-i')];open(it);cv.scrollIntoView({behavior:'smooth',block:'center'})});
  refresh();

  // export
  var SRC='Fonte: mapa de normas EZ Contabilidade (Emanuel Luz). Confira sempre o texto oficial no CFC (cfc.org.br) e no Planalto (planalto.gov.br).';
  function clean(arr){return arr.map(function(it){var o={codigo:it.codigo,titulo:it.titulo,grupo:it.grupo};if(it.correlacao)o.correlacao=it.correlacao;if(it.tipo)o.tipo=it.tipo;if(it.data)o.data=it.data;o.resumo=it.resumo;if(it.url)o.url=it.url;else if(it.pg)o.url=it.pg;if(it.verificar)o.verificar=true;return o})}
  function md(arr){var by={},o='';arr.forEach(function(it){(by[it.grupo]=by[it.grupo]||[]).push(it)});
    Object.keys(by).forEach(function(g){o+='\n## '+g+(NAMES[g]?' ('+NAMES[g]+')':'')+'\n\n';by[g].forEach(function(it){o+='- **'+it.codigo+'**: '+it.titulo+(it.correlacao?' ['+it.correlacao+']':'')+(it.data?' ('+it.data+')':'')+'. '+it.resumo+((it.url||it.pg)?' '+(it.url||it.pg):'')+'\n'})});return o.trim()+'\n'}
  function prompt(arr){return 'Você é um assistente especialista em contabilidade brasileira e na reforma tributária do consumo (IBS, CBS e Imposto Seletivo).\n\nRegras:\n1. Use a base de normas abaixo como referência principal e cite sempre o código da norma (ex.: NBC TG 16, LC 214/2025).\n2. Quando a resposta depender de texto que não está na base, diga isso e indique onde conferir (cfc.org.br ou planalto.gov.br).\n3. Explique em linguagem simples, com um exemplo numérico quando ajudar.\n4. Não invente números de normas, artigos ou alíquotas.\n5. Lembre que a resposta é educativa e não substitui um contador registrado.\n\nBase de normas ('+arr.length+' itens, atualizada em '+(D.atualizado||'2026')+'):\n\n'+md(arr)+'\n'+SRC+'\n\nAgora aguarde a minha pergunta.'}
  var toast=document.getElementById('gxToast');
  function copy(txt,msg){function ok(){toast.textContent=msg;toast.classList.add('on');setTimeout(function(){toast.classList.remove('on')},1800)}
    try{if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(txt).then(ok,function(){fb(txt)&&ok()});return}}catch(e){}
    if(fb(txt))ok();else{toast.textContent='Selecione e copie manualmente';toast.classList.add('on');setTimeout(function(){toast.classList.remove('on')},2200)}}
  function fb(txt){try{var ta=document.createElement('textarea');ta.value=txt;ta.style.position='fixed';ta.style.opacity='0';document.body.appendChild(ta);ta.select();var r=document.execCommand('copy');ta.remove();return r}catch(e){return false}}
  document.getElementById('gxCpPrompt').onclick=function(){copy(prompt(filtered()),'Prompt copiado. Cole no ChatGPT, Claude ou Gemini');if(window.EZG)EZG.exported()};
  document.getElementById('gxCpMd').onclick=function(){copy('# Normas de contabilidade e reforma tributária\n\n'+md(filtered())+'\n'+SRC,'Markdown copiado');if(window.EZG)EZG.exported()};
  document.getElementById('gxCpJson').onclick=function(){copy(JSON.stringify({fonte:SRC,atualizado:D.atualizado||'',itens:clean(filtered())},null,2),'JSON copiado');if(window.EZG)EZG.exported()};

  // tour
  var cap=document.getElementById('gxCap'),tourT=null,tourI=0;
  function stopTour(){if(tourT){clearInterval(tourT);tourT=null;cap.classList.remove('on');document.getElementById('gxTour').classList.remove('on')}}
  function step(){var gs=groups.filter(function(g){return !off[g]});if(tourI>=gs.length){stopTour();fit();if(window.EZG)EZG.tour();return}
    var g=gs[tourI++];focusG(g);cap.innerHTML='<b>'+esc(g==='Reforma Tributária'?'Reforma tributária':g)+'</b>'+esc(NAMES[g]||'')+' &middot; '+byG[g].length+(byG[g].length===1?' item':' itens');cap.classList.add('on')}
  document.getElementById('gxTour').onclick=function(){if(tourT){stopTour();return}pnl.classList.remove('open');tourI=0;step();tourT=setInterval(step,2600);this.classList.add('on')};
  cv.addEventListener('pointerdown',stopTour);cv.addEventListener('wheel',stopTour);
  // norma do dia
  var dEl=document.getElementById('gxDay');
  if(dEl&&items.length){var pool=items.filter(function(i){return i.k==='n'&&i.resumo});var dt=new Date(),di=(dt.getFullYear()*372+dt.getMonth()*31+dt.getDate())%pool.length,it=pool[di];
    dEl.innerHTML='<span class="k">Norma do dia</span><b>'+esc(it.codigo)+'</b><span class="t">'+esc(it.titulo)+'</span><span class="go">Abrir &rarr;</span>';
    dEl.onclick=function(){if(window.EZG&&EZG.mark)EZG.mark('dia','Norma do dia');cv.scrollIntoView({behavior:'smooth',block:'center'});setTimeout(function(){open(it)},450)}}
};
