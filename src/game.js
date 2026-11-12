(function(){
  // ===== EZ game: XP, levels, badges (saved per browser) =====
  var KEY='ez_game_v1',S={xp:0,seen:{},sec:{},badges:{},quiz:0};
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
    hud.querySelector('.fill').style.width=pct+'%';
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
    xp:xp
  };
  document.addEventListener('DOMContentLoaded',init);if(document.readyState!=='loading')init();
  var done=false;
  function init(){if(done)return;done=true;
    hud=el('<button class="ez-hud" id="ezHud" aria-label="Seu progresso"><span class="ic">EZ</span><span class="tx"><span class="lv"></span><span class="bar"><span class="fill"></span></span></span><span class="xp"></span><span class="nb"></span></button>');
    document.body.appendChild(hud);toastEl=el('<div class="ez-toast" role="status"></div>');document.body.appendChild(toastEl);
    hud.onclick=function(){var t=document.getElementById('jornada');if(t)t.scrollIntoView({behavior:'smooth'})};
    var secs=document.querySelectorAll('section[id]');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var id=e.target.id;if(!S.sec[id]){S.sec[id]=1;save();xp(10,'Seção explorada');
      if(Array.prototype.every.call(secs,function(s){return S.sec[s.id]}))badge('explorador')}}})},{threshold:.35});
    secs.forEach(function(s){io.observe(s)});
    render();quizInit();
  }
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
