// Globo 3D com a localização de Emanuel Luz (Feira de Santana, BA)
function mkGlobe(cv,HERO){if(!cv||!window.THREE)return;
  var DOTS=window.EZ_LAND||[];var LAT=-12.2664,LON=-38.9663,R=1;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true});r.setPixelRatio(Math.min(devicePixelRatio,2));
  var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(36,1,.1,100);cam.position.set(0,0,4.1);
  function v3(lat,lon,rad){var la=lat*Math.PI/180,lo=lon*Math.PI/180;return new THREE.Vector3(rad*Math.cos(la)*Math.cos(lo),rad*Math.sin(la),-rad*Math.cos(la)*Math.sin(lo))}
  var pivot=new THREE.Group(),globe=new THREE.Group();sc.add(pivot);pivot.add(globe);var dotsG=new THREE.Group(),satG=new THREE.Group();globe.add(dotsG);globe.add(satG);satG.visible=false;
  // core sphere
  dotsG.add(new THREE.Mesh(new THREE.SphereGeometry(R*.985,64,64),new THREE.MeshBasicMaterial({color:0x0b1422,transparent:true,opacity:.92})));
  // graticule
  var gm=new THREE.LineBasicMaterial({color:0xf2efe6,transparent:true,opacity:.07});
  for(var la=-60;la<=60;la+=30){var pts=[];for(var lo=0;lo<=360;lo+=4)pts.push(v3(la,lo,R*.99));dotsG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pts),gm))}
  for(var lo2=0;lo2<360;lo2+=30){var pp=[];for(var la2=-90;la2<=90;la2+=4)pp.push(v3(la2,lo2,R*.99));dotsG.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(pp),gm))}
  // land dots, gold near Feira de Santana
  var pos=[],col=[],home=v3(LAT,LON,1),c=new THREE.Color(),gold=new THREE.Color(0xf0c75e),plat=new THREE.Color(0xd9d4c7);
  for(var i=0;i<DOTS.length;i+=2){var p=v3(DOTS[i],DOTS[i+1],R);pos.push(p.x,p.y,p.z);var d=p.distanceTo(home);c.copy(plat).lerp(gold,Math.max(0,1-d/.55));col.push(c.r,c.g,c.b)}
  var dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));dg.setAttribute('color',new THREE.Float32BufferAttribute(col,3));
  dotsG.add(new THREE.Points(dg,new THREE.PointsMaterial({size:.026,vertexColors:true,transparent:true,opacity:.95})));
  // atmosphere glow (sprite)
  var g2=document.createElement('canvas');g2.width=g2.height=256;var x=g2.getContext('2d'),grd=x.createRadialGradient(128,128,60,128,128,128);
  grd.addColorStop(0,'rgba(240,199,94,0)');grd.addColorStop(.5,'rgba(240,199,94,.10)');grd.addColorStop(.6,'rgba(242,239,230,.05)');grd.addColorStop(1,'rgba(240,199,94,0)');x.fillStyle=grd;x.fillRect(0,0,256,256);
  var glow=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(g2),transparent:true,depthWrite:false}));glow.scale.set(3.1,3.1,1);sc.add(glow);
  // satellite version (real NASA Blue Marble imagery), loaded on demand
  sc.add(new THREE.AmbientLight(0xffffff,.55));var sun=new THREE.DirectionalLight(0xffffff,1.05);sun.position.set(3,1.5,4);sc.add(sun);
  var satLoaded=false,clouds=null;
  function loadSat(){if(satLoaded)return;satLoaded=true;var L=new THREE.TextureLoader();
    var mat=new THREE.MeshPhongMaterial({map:L.load('assets/earth-day.jpg'),bumpMap:L.load('assets/earth-bump.jpg'),bumpScale:.035,specular:new THREE.Color(0x333333),shininess:12});
    satG.add(new THREE.Mesh(new THREE.SphereGeometry(R,96,96),mat));
    clouds=new THREE.Mesh(new THREE.SphereGeometry(R*1.012,64,64),new THREE.MeshPhongMaterial({color:0xffffff,alphaMap:L.load('assets/earth-clouds.jpg'),transparent:true,opacity:.75,depthWrite:false}));satG.add(clouds)}
  var api={mode:function(m){dotsG.visible=m===1;satG.visible=m===2;if(m===2)loadSat();glow.material.opacity=m===2?.55:1;orb.visible=m===1;sat.visible=m===1}};
  // law markers (Brasília: federal + CFC, Rio: CVM)
  var LAWPIN=[];api.pins=function(list){list.forEach(function(p){var g=new THREE.Group(),pp=v3(p.lat,p.lon,R);g.position.copy(pp);g.lookAt(pp.clone().multiplyScalar(2));
      var h=.08+Math.min(.35,p.n/600);var col=new THREE.Mesh(new THREE.CylinderGeometry(.012,.012,h,10),new THREE.MeshBasicMaterial({color:0xf2efe6,transparent:true,opacity:.9}));col.rotation.x=Math.PI/2;col.position.z=h/2;g.add(col);
      var cap=new THREE.Mesh(new THREE.SphereGeometry(.022,12,12),new THREE.MeshBasicMaterial({color:0xffffff}));cap.position.z=h;g.add(cap);globe.add(g);LAWPIN.push({g:g,cap:cap,el:p.el})})};
  // marker
  var mk=new THREE.Group();globe.add(mk);var mp=v3(LAT,LON,R);mk.position.copy(mp);mk.lookAt(mp.clone().multiplyScalar(2));
  mk.add(new THREE.Mesh(new THREE.SphereGeometry(.028,16,16),new THREE.MeshBasicMaterial({color:0xffe39a})));
  var beam=new THREE.Mesh(new THREE.CylinderGeometry(.006,.006,.34,8),new THREE.MeshBasicMaterial({color:0xf0c75e,transparent:true,opacity:.85}));beam.rotation.x=Math.PI/2;beam.position.z=.17;mk.add(beam);
  var rings=[];for(var k=0;k<3;k++){var rg=new THREE.Mesh(new THREE.RingGeometry(.03,.038,48),new THREE.MeshBasicMaterial({color:0xf0c75e,transparent:true,side:THREE.DoubleSide}));rg.position.z=.002;mk.add(rg);rings.push(rg)}
  // decorative orbit
  var orb=new THREE.Mesh(new THREE.TorusGeometry(1.32,.0025,8,160),new THREE.MeshBasicMaterial({color:0xf0c75e,transparent:true,opacity:.35}));orb.rotation.x=Math.PI/2.4;orb.rotation.y=.3;sc.add(orb);
  var sat=new THREE.Mesh(new THREE.SphereGeometry(.025,12,12),new THREE.MeshBasicMaterial({color:0xf2efe6}));sc.add(sat);
  // face Feira de Santana to the camera
  globe.quaternion.setFromUnitVectors(mp.clone().normalize(),new THREE.Vector3(0,0,1));
  pivot.rotation.x=.12;
  function size(){var w=cv.clientWidth,h=cv.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix()}
  size();addEventListener('resize',size);
  // drag
  var drag=null,vy=0,vx=0,ry=0,rx=.12,back=false;
  if(!HERO)cv.addEventListener('pointerdown',function(e){drag={x:e.clientX,y:e.clientY,ry:ry,rx:rx};cv.setPointerCapture(e.pointerId);cv.classList.add('drag');back=false});
  cv.addEventListener('pointermove',function(e){if(!drag)return;ry=drag.ry+(e.clientX-drag.x)*.006;rx=Math.max(-.9,Math.min(.9,drag.rx+(e.clientY-drag.y)*.004))});
  function up(){drag=null;cv.classList.remove('drag')}cv.addEventListener('pointerup',up);cv.addEventListener('pointercancel',up);
  if(!HERO)window.EZGlobe=api;else{api.mode(2);cam.position.z=3.4}
  var btn=HERO?null:document.getElementById('globeHome');if(btn)btn.onclick=function(){back=true};
  var lbl=HERO?null:document.getElementById('globeLbl'),vis=false;new IntersectionObserver(function(e){vis=e[0].isIntersecting}).observe(cv);
  var t0=performance.now(),wp=new THREE.Vector3();
  (function loop(now){requestAnimationFrame(loop);if(!vis)return;var t=(now-t0)/1000;
    if(back){ry*=.92;rx+=(.12-rx)*.08;if(Math.abs(ry)<.002)back=false}
    else if(HERO&&!reduce){ry+=.0012}else if(!drag&&!reduce){ry+=Math.sin(t*.35)*.0016}
    pivot.rotation.y=ry;pivot.rotation.x=rx;
    rings.forEach(function(rg,k){var s=((t*.6+k/3)%1);rg.scale.setScalar(1+s*5);rg.material.opacity=(1-s)*.8});
    var a=t*.4;sat.position.set(Math.cos(a)*1.32,Math.sin(a)*1.32*Math.cos(Math.PI/2.4)*-1,Math.sin(a)*1.32*Math.sin(Math.PI/2.4)).applyEuler(new THREE.Euler(0,.3,0));
    r.render(sc,cam);
    if(lbl){mk.getWorldPosition(wp);var facing=wp.z>.15;var p=wp.clone().project(cam);var w=cv.clientWidth,h=cv.clientHeight;
      lbl.style.transform='translate('+((p.x*.5+.5)*w)+'px,'+((-p.y*.5+.5)*h)+'px)';lbl.style.opacity=facing?1:0;
      LAWPIN.forEach(function(L){L.cap.getWorldPosition(wp);var f=wp.z>.1,q=wp.clone().project(cam);L.el.style.transform='translate('+((q.x*.5+.5)*w)+'px,'+((-q.y*.5+.5)*h)+'px)';L.el.style.opacity=f?1:0})}
    if(clouds)clouds.rotation.y+=.0004;
  })(t0);
}
mkGlobe(document.getElementById('globe'),false);
window.EZHeroGlobe=function(){if(window._hg)return;window._hg=1;mkGlobe(document.getElementById('gl2'),true)};
(function(){var k='ez_hero_v';function set(v){document.body.classList.toggle('hero2',v==2);document.querySelectorAll('[data-hv]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-hv')==v)});if(v==2)window.EZHeroGlobe();try{localStorage.setItem(k,v)}catch(e){}}
document.querySelectorAll('[data-hv]').forEach(function(b){b.onclick=function(){set(b.getAttribute('data-hv'))}});var s='1';try{s=localStorage.getItem(k)||'1'}catch(e){}set(s)})();
