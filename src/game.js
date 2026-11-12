(function(){
  // ===== EZ game: XP, levels, badges (saved per browser) =====
  var KEY='ez_game_v1',S={xp:0,seen:{},sec:{},badges:{},quiz:0,marks:{},welcomed:0};var AS=window.EZ_ASSETS||{};
  try{var raw=localStorage.getItem(KEY);if(raw){var o=JSON.parse(raw);for(var k in o)S[k]=o[k]}}catch(e){}
  function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
  var LV=[[0,'Estagiário'],[60,'Assistente'],[160,'Analista'],[320,'Sênior'],[520,'Contador do Amanhã']];
  var BD={
    primeira:['Primeira estrela','Abriu a primeira norma da galáxia'],
    curioso:['Curioso','Abriu 10 normas diferentes'],
    cartografo:['Cartógrafo','Visitou normas de 6 grupos'],
    reformista:['Reformista','Abriu 5 atos da reforma tributária'],
    exportador:['Exportador','Levou as normas para a sua IA'],
    gabarito:['Gabarito','Acertou 5 de 5 no desafio'],
    explorador:['Explorador','Percorreu todas as seções do site'],
    turista:['Turista espacial','Fez o tour guiado pela galáxia']
  };
  function level(){var i=0;LV.forEach(function(l,j){if(S.xp>=l[0])i=j});return i}
  var hud,toastEl,lvlBefore=level();
  function el(h){var d=document.createElement('div');d.innerHTML=h;return d.firstChild}
  function render(){
    if(!hud)return;var i=level(),cur=LV[i][0],nxt=LV[i+1]?LV[i+1][0]:cur;
    var pct=LV[i+1]?Math.round((S.xp-cur)/(nxt-cur)*100):100;
    hud.querySelector('.lv').textContent=LV[i][1];
    hud.querySelector('.xp').textContent=S.xp+' XP';
    hud.querySelector('.fill').style.width=pct+'%';var r1=hud.querySelector('.r1');if(r1)r1.style.strokeDashoffset=(125.7*(1-pct/100)).toFixed(1);
    hud.querySelector('.nb').textContent=Object.keys(S.badges).length+'/'+Object.keys(BD).length;
    var g=document.getElementById('ezBadges');
    if(g){var h='';Object.keys(BD).forEach(function(k){var on=S.badges[k];h+='<div class="bdg'+(on?' on':'')+'" title="'+BD[k][1]+'"><span>'+(on?'&#9733;':'&#9734;')+'</span><b>'+BD[k][0]+'</b><small>'+BD[k][1]+'</small></div>'});g.innerHTML=h}
    var lb=document.getElementById('ezLevelBig');if(lb)lb.textContent=LV[i][1];
    var xb=document.getElementById('ezXpBig');if(xb)xb.textContent=S.xp;
    var nx=document.getElementById('ezNext');if(nx)nx.textContent=LV[i+1]?('Faltam '+(nxt-S.xp)+' XP para '+LV[i+1][1]):'Nível máximo. Parabéns!';
  }
  function toast(t,s){if(!toastEl)return;toastEl.innerHTML='<b>'+t+'</b>'+(s?'<span>'+s+'</span>':'');toastEl.classList.remove('on');void toastEl.offsetWidth;toastEl.classList.add('on');clearTimeout(toastEl._t);toastEl._t=setTimeout(function(){toastEl.classList.remove('on')},2600)}
  function xp(n,why){S.xp+=n;save();var l=level();
    if(l>lvlBefore){lvlBefore=l;toast('Subiu de nível: '+LV[l][1],'+'+n+' XP · '+why)}else toast('+'+n+' XP',why);
    if(hud){hud.classList.remove('pop');void hud.offsetWidth;hud.classList.add('pop')}render()}
  function badge(id){if(S.badges[id]||!BD[id])return;S.badges[id]=1;save();setTimeout(function(){toast('Conquista: '+BD[id][0],BD[id][1])},900);render()}
  window.EZG={
    seen:function(it){var id=it.codigo;if(S.seen[id])return;S.seen[id]=it.grupo;save();xp(it.k==='r'?6:5,'Nova norma: '+id);
      var ids=Object.keys(S.seen),gs={},rc=0;ids.forEach(function(k){gs[S.seen[k]]=1;if(S.seen[k]==='Reforma Tributária')rc++});
      badge('primeira');if(ids.length>=10)badge('curioso');if(Object.keys(gs).length>=6)badge('cartografo');if(rc>=5)badge('reformista')},
    isSeen:function(id){return !!S.seen[id]},
    exported:function(){if(!S.badges.exportador)xp(20,'Exportou para a IA');badge('exportador')},
    tour:function(){if(!S.badges.turista)xp(15,'Tour guiado');badge('turista')},
    quiz:function(score){if(score>S.quiz){xp((score-S.quiz)*10,'Desafio: '+score+'/5');S.quiz=score;save()}if(score===5)badge('gabarito')},
    xp:xp,
    mark:function(k,why){if(S.marks[k])return;S.marks[k]=1;save();xp(10,why||'Etapa da trilha')}
  };
  document.addEventListener('DOMContentLoaded',init);if(document.readyState!=='loading')init();
  var done=false;
  function init(){if(done)return;done=true;
    hud=el('<button class="ez-hud" id="ezHud" aria-label="Abrir sua trilha"><span class="ic"><svg viewBox="0 0 44 44" class="ring"><circle cx="22" cy="22" r="20" class="r0"/><circle cx="22" cy="22" r="20" class="r1"/></svg><img src="'+(AS.mono||'')+'" alt=""></span><span class="tx"><span class="nm">EZ Trilha</span><span class="lv"></span><span class="bar"><span class="fill"></span></span></span><span class="xp"></span><span class="nb"></span></button>');
    document.body.appendChild(hud);toastEl=el('<div class="ez-toast" role="status"></div>');document.body.appendChild(toastEl);
    hud.onclick=function(){openWelcome()};
    var secs=document.querySelectorAll('section[id]');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id=e.target.id;if(!S.sec[id]){S.sec[id]=1;save();xp(10,'Seção explorada');
      if(Array.prototype.every.call(secs,function(s){return S.sec[s.id]}))badge('explorador')}}})},{threshold:.35});
    secs.forEach(function(s){io.observe(s)});
    render();quizInit();
    document.addEventListener('click',function(e){var a=e.target.closest('a[href]');if(!a)return;if(AS.manual&&a.href===AS.manual)window.EZG.mark('manual','Baixou o Manual do IR');else if(AS.ig&&a.href===AS.ig)window.EZG.mark('ig','Visitou o Instagram')});
    // 3D tilt + glare on cards
    if(matchMedia('(hover:hover)').matches&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
      document.querySelectorAll('.card,.pc,.feature,.gx-box,.bdg,.jn-lv,.brandbox,.qz,.stat,.hero-photo-wrap .photo,.about .photo,.gx-day,.lk a').forEach(function(c){
        var max=c.classList.contains('photo')?7:(c.classList.contains('qz')||c.classList.contains('gx-box')?4:9);
        c.classList.add('tilt');if(getComputedStyle(c).position==='static')c.style.position='relative';var g=document.createElement('span');g.className='glare';c.appendChild(g);
        c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width,y=(e.clientY-r.top)/r.height;
          c.classList.add('tilting');c.style.transform='perspective(900px) rotateY('+((x-.5)*max*2).toFixed(2)+'deg) rotateX('+((.5-y)*max*2).toFixed(2)+'deg) translateZ(6px)';c.style.setProperty('--gx',(x*100)+'%');c.style.setProperty('--gy',(y*100)+'%')});
        c.addEventListener('mouseleave',function(){c.classList.remove('tilting');c.style.transform=''})})}
    var tb=document.getElementById('ezTrail');if(tb){window.EZG.trail(tb);var ob=new IntersectionObserver(function(e){if(e[0].isIntersecting)window.EZG.trail(tb)});ob.observe(tb)}
    if(!S.welcomed){setTimeout(function(){openWelcome()},1400)}
  }
  // ===== welcome pop-up + holographic trail =====
  var STEPS=[
    {k:'manual',t:'Manual do IR 2027',d:'PDF de 13 páginas com a isenção de R$ 5 mil, tabelas e erros que levam à malha fina.',go:AS.manual,ext:1,x:9,y:80},
    {k:'galaxia',t:'Galáxia das normas',d:'213 normas do CFC e 50 atos da reforma tributária em um mapa interativo.',go:'#normas',x:26,y:58},
    {k:'dia',t:'Norma do dia',d:'Uma norma diferente todo dia, com resumo e link oficial.',go:'#gxDay',x:42,y:76},
    {k:'desafio',t:'Desafio relâmpago',d:'Cinco perguntas no estilo do Exame do CFC, com explicação.',go:'#desafio',x:57,y:46},
    {k:'ia',t:'Leve para a sua IA',d:'Prompt pronto para ChatGPT, Claude ou Gemini com as normas filtradas.',go:'#normas',x:69,y:66},
    {k:'ig',t:'Conteúdo no Instagram',d:'Reforma, imposto de renda e IA explicados sem complicação.',go:AS.ig,ext:1,x:84,y:40}
  ];
  function stepDone(st){if(st.k==='galaxia')return Object.keys(S.seen).length>0;if(st.k==='desafio')return S.quiz>0;if(st.k==='ia')return !!S.badges.exportador;return !!S.marks[st.k]}
  var wm=null;
  function pathD(){var p=STEPS.map(function(s){return [s.x*10,s.y*5]});p.push([960,100]);var d='M'+p[0][0]+','+p[0][1];
    for(var i=1;i<p.length;i++){var a=p[i-1],b=p[i],mx=(a[0]+b[0])/2;d+=' C'+mx+','+a[1]+' '+mx+','+b[1]+' '+b[0]+','+b[1]}return d}
  function trailHTML(){var done=STEPS.filter(stepDone).length,i=level(),nodes='',lbs='';
    STEPS.forEach(function(st,j){var ok=stepDone(st);
      nodes+='<button class="hn'+(ok?' ok':'')+'" style="left:'+st.x+'%;top:'+st.y+'%;--d:'+(j*.12)+'s" data-s="'+j+'" aria-label="'+st.t+'"><span class="beam"></span><span class="disc"><b>'+(ok?'&#10003;':(j+1))+'</b></span></button>';
      lbs+='<span class="hl'+(ok?' ok':'')+'" data-l="'+j+'">'+st.t+'</span>'});
    lbs+='<span class="hl end" data-l="end">Contador do Amanhã</span>';
    return '<div class="holo"><div class="scan"></div><div class="hstat"><span>Trilha</span><b>'+done+'/6</b><span>'+LV[i][1]+' &middot; '+S.xp+' XP</span></div>'+
      '<div class="plane"><div class="floor"></div><svg viewBox="0 0 1000 500" preserveAspectRatio="none"><defs><linearGradient id="hg" x1="0" x2="1"><stop offset="0" stop-color="#f2efe6"/><stop offset=".5" stop-color="#cfcabd"/><stop offset="1" stop-color="#f0c75e"/></linearGradient></defs>'+
      '<path d="'+pathD()+'" class="pb"/><path d="'+pathD()+'" class="pf"/></svg>'+nodes+
      '<div class="hn end" style="left:96%;top:20%" data-e="1"><span class="beam"></span><span class="disc crown"><b>&#9819;</b></span></div></div><div class="hls">'+lbs+'</div></div>'}
  var raf=0;
  function liveLabels(holo){if(!holo)return;var discs=holo.querySelectorAll('.hn'),ls=holo.querySelectorAll('.hl');
    function tick(){if(!holo.isConnected||!holo.offsetParent){raf=0;return}var hr=holo.getBoundingClientRect();
      discs.forEach(function(n,k){var d=n.querySelector('.disc').getBoundingClientRect(),l=ls[k];if(!l)return;l.style.left=(d.left+d.width/2-hr.left)+'px';l.style.top=(d.top-hr.top-8)+'px'});
      requestAnimationFrame(tick)}
    tick()}
  window.EZG.trail=function(box){if(!box)return;box.innerHTML=trailHTML();box.querySelectorAll('[data-s]').forEach(function(b){b.onclick=function(){go(STEPS[+b.getAttribute('data-s')])}});liveLabels(box.querySelector('.holo'))};
  function openWelcome(){
    if(!wm){wm=el('<div class="ez-wm" role="dialog" aria-modal="true" aria-labelledby="ezWmT"></div>');document.body.appendChild(wm);
      wm.addEventListener('click',function(e){if(e.target===wm||e.target.closest('[data-x]'))closeWelcome()});
      addEventListener('keydown',function(e){if(e.key==='Escape'&&wm.classList.contains('on'))closeWelcome()})}
    var done=STEPS.filter(stepDone).length,i=level();
    var list='';
    STEPS.forEach(function(st,j){var ok=stepDone(st);
      list+='<button class="wl'+(ok?' ok':'')+'" data-s="'+j+'"><span class="n">'+(ok?'&#10003;':('0'+(j+1)))+'</span><span class="tt"><b>'+st.t+'</b><small>'+st.d+'</small></span><span class="g">Grátis</span></button>'});
    wm.innerHTML='<div class="ez-wbox">'+
      '<button class="wx" data-x aria-label="Fechar">&times;</button>'+
      '<div class="wh"><div class="wlogo" aria-label="EZ Contabilidade"><img src="'+(AS.mono||'')+'" alt=""><span><b>EZ <em>Contabilidade</em></b><small>Emanuel luZ &middot; Accounting</small></span></div><div><div class="kick">Bem-vindo à EZ Contabilidade</div><h2 id="ezWmT">Tudo aqui é <i>de graça.</i></h2>'+
      '<p>Siga a trilha, ganhe XP e chegue ao nível <b>Contador do Amanhã</b>. Seu progresso fica salvo neste navegador.</p></div></div>'+
      trailHTML()+'<div class="wlist">'+list+'</div>'+
      '<div class="wacts"><button class="btn gold" data-start>Começar a trilha &rarr;</button><button class="btn ghost" data-x>Explorar sozinho</button></div></div>';
    liveLabels(wm.querySelector('.holo'));
    wm.querySelectorAll('[data-s]').forEach(function(b){b.onclick=function(){go(STEPS[+b.getAttribute('data-s')])}});
    wm.querySelector('[data-start]').onclick=function(){var nx=STEPS.filter(function(s){return !stepDone(s)})[0]||STEPS[1];go(nx)};
    wm.classList.add('on');document.documentElement.style.overflow='hidden';
    if(!S.welcomed){S.welcomed=1;save()}
  }
  function closeWelcome(){if(wm){wm.classList.remove('on');document.documentElement.style.overflow=''}}
  function go(st){
    if(st.ext){if(st.k==='manual')window.EZG.mark('manual','Baixou o Manual do IR');if(st.k==='ig')window.EZG.mark('ig','Visitou o Instagram');window.open(st.go,'_blank','noopener');return}
    closeWelcome();var t=document.querySelector(st.go);if(!t)return;
    setTimeout(function(){t.scrollIntoView({behavior:'smooth',block:st.k==='dia'?'center':'start'});if(st.k==='dia')setTimeout(function(){t.click()},700)},150)
  }
  window.EZG.open=openWelcome;
  // ===== quiz =====
  var Q=[
    {q:'Qual norma do CFC trata de estoques?',o:['NBC TG 27','NBC TG 16','NBC TG 01','NBC TG 06'],a:1,e:'NBC TG 16 (R2), correlata ao CPC 16 e ao IAS 2. A NBC TG 27 trata do ativo imobilizado.',s:'TG 16'},
    {q:'A CBS, contribuição federal da reforma, substitui quais tributos?',o:['ICMS e ISS','IPI e IOF','PIS e Cofins','IRPJ e CSLL'],a:2,e:'A CBS substitui PIS e Cofins. O IBS, de estados e municípios, substitui ICMS e ISS.',s:'CBS'},
    {q:'Qual norma corresponde ao IFRS 16, de arrendamentos?',o:['NBC TG 06','NBC TG 47','NBC TG 48','NBC TG 16'],a:0,e:'NBC TG 06 (R3), correlata ao CPC 06 (R2). A TG 47 é receita (IFRS 15) e a TG 48, instrumentos financeiros (IFRS 9).',s:'IFRS 16'},
    {q:'Em que ano ICMS e ISS deixam de existir e o IBS vigora plenamente?',o:['2027','2029','2030','2033'],a:3,e:'Em 2033 termina a transição. Antes disso, ICMS e ISS caem aos poucos a partir de 2029.',s:'2033'},
    {q:'Qual norma reúne o Código de Ética Profissional do Contador?',o:['ITG 2000','NBC PG 01','NBC PA 01','NBC TG 00'],a:1,e:'NBC PG 01. A ITG 2000 trata da escrituração contábil e a NBC PA 01, da gestão da qualidade em firmas de auditoria.',s:'PG 01'}
  ];
  function quizInit(){var box=document.getElementById('ezQuiz');if(!box)return;var i=0,score=0,locked=false;
    function show(){if(i>=Q.length){var msg=score===5?'Gabaritou. Você está pronto para o Exame do CFC.':score>=3?'Mandou bem. Revise as que errou na galáxia.':'Bom começo. A galáxia está aqui para isso.';
        box.innerHTML='<div class="qz-end"><div class="qz-score">'+score+'<small>/5</small></div><h3>'+msg+'</h3><div class="qz-acts"><button class="btn gold" id="qzAgain">Jogar de novo</button><a class="btn ghost" href="#normas">Explorar a galáxia</a></div></div>';
        window.EZG.quiz(score);document.getElementById('qzAgain').onclick=function(){i=0;score=0;show()};return}
      var q=Q[i],h='<div class="qz-top"><span>Pergunta '+(i+1)+' de 5</span><span class="qz-dots">';
      Q.forEach(function(_,j){h+='<i class="'+(j<i?'d':j===i?'c':'')+'"></i>'});
      h+='</span></div><h3>'+q.q+'</h3><div class="qz-opts">';q.o.forEach(function(o,j){h+='<button data-j="'+j+'"><span>'+'ABCD'[j]+'</span>'+o+'</button>'});
      h+='</div><div class="qz-fb" id="qzFb"></div>';box.innerHTML=h;locked=false;
      box.querySelectorAll('.qz-opts button').forEach(function(b){b.onclick=function(){if(locked)return;locked=true;var j=+b.getAttribute('data-j'),ok=j===q.a;if(ok)score++;
        box.querySelectorAll('.qz-opts button').forEach(function(x,k){if(k===q.a)x.classList.add('ok');else if(k===j)x.classList.add('no');x.disabled=true});
        var fb=document.getElementById('qzFb');fb.innerHTML='<b>'+(ok?'Certo.':'Quase.')+'</b> '+q.e+'<div class="qz-row"><button class="lnk" id="qzSee">Ver na galáxia</button><button class="btn gold" id="qzNext">'+(i<4?'Próxima &rarr;':'Ver resultado')+'</button></div>';fb.classList.add('on');
        document.getElementById('qzNext').onclick=function(){i++;show()};
        document.getElementById('qzSee').onclick=function(){var inp=document.getElementById('gxQ');if(inp){inp.value=q.s;inp.dispatchEvent(new Event('input'));document.getElementById('normas').scrollIntoView({behavior:'smooth'})}};
      }})}
    show()}
})();
