const $=id=>document.getElementById(id),C=$('c'),X=C.getContext('2d'),W=800,H=360,FY=300;
let T=0,mode='menu',paused=false,lvl=0,stepI=0,prog=0,run=0,onEnter=null,msgT='',msgU=0,AC=null,L,en,pl;
const keys={},have=new Set(),fxs=[];
const NM={jab:['Jab','J'],block:['Block','K'],dodge:['Dodge','L'],cross:['Cross','U'],low:['Low kick','I'],upper:['Uppercut','Y'],heavy:['Heavy kick','H'],counter:['Counterattack','O']};
const MV={jab:{r:78,d:6,h:90,e:280,p:'jab'},cross:{r:86,d:11,h:150,e:430,p:'cross'},low:{r:92,d:8,h:140,e:400,p:'low',g:1},upper:{r:66,d:15,h:170,e:520,p:'upper',g:1},heavy:{r:100,d:19,h:300,e:760,p:'heavy',g:1},counter:{r:90,d:17,h:110,e:400,p:'counter',g:1}};
const KEY={j:'jab',u:'cross',i:'low',y:'upper',h:'heavy',o:'counter'};
const TS={n:'Dummy',hp:1e9,still:1,gap:1e9,dmg:0,r:74},TG={...TS,guard:1},TA={n:'Trainer',hp:1e9,spd:45,tele:950,rec:800,gap:700,dmg:0,r:74};
const LV=[
{name:'The Initiate',foe:{n:'Kenji',hp:60,spd:55,tele:750,rec:1500,gap:1100,dmg:7,r:74},fi:'Kenji is slow. Watch the ring around him, block his strikes, and answer with jabs.',steps:[
{id:'jab',t:'Learn the jab',d:'Your fastest strike. Short reach, light damage, almost no recovery.',goal:'Land 3 jabs on the dummy',hint:'Step in with D, then press J',ev:'jab',need:3,dm:'s'},
{id:'block',t:'Learn the block',d:'Hold K as the trainer strikes. A clean block cuts almost all damage.',goal:'Block 2 attacks',hint:'Hold K before the ring closes',ev:'block',need:2,dm:'a'}]},
{name:'The Disciple',foe:{n:'Haruto',hp:80,spd:85,tele:560,rec:950,gap:700,dmg:9,r:78,guard:1},fi:'Haruto strikes faster and covers up between attacks. Low kicks beat his guard. Dodge when the ring closes.',steps:[
{id:'cross',t:'Learn the cross',d:'A rear-hand straight punch. Slower than the jab, nearly twice the damage.',goal:'Land 3 crosses',hint:'Get in range, then press U',ev:'cross',need:3,dm:'s'},
{id:'low',t:'Learn the low kick',d:'Sweeps under a high guard. This dummy covers up, so jabs and crosses barely hurt it.',goal:'Land 3 low kicks on the guarded dummy',hint:'Press I within reach',ev:'low',need:3,dm:'g'},
{id:'dodge',t:'Learn the dodge',d:'Slip an attack by pressing L just before it lands. Too early or too late and you are hit.',goal:'Dodge 2 attacks',hint:'Press L as the ring closes',ev:'dodge',need:2,dm:'a'}]},
{name:'The Master',foe:{n:'Shadow Master',hp:140,spd:105,tele:400,rec:600,gap:450,dmg:13,r:84,guard:1,chain:.4,s:1.15},fi:'The Shadow Master punishes careless attacks and sometimes strikes twice. Uppercuts and heavy kicks interrupt his wind-up. Use everything you have learned.',steps:[
{id:'upper',t:'Learn the uppercut',d:'Short range, high damage. A solid hit interrupts an enemy mid wind-up.',goal:'Land 3 uppercuts',hint:'Uppercut reach is short. Get close, then press Y',ev:'upper',need:3,dm:'s'},
{id:'heavy',t:'Learn the heavy kick',d:'Slow and strong with long reach. If it misses, you are wide open.',goal:'Land 2 heavy kicks',hint:'Press H within reach',ev:'heavy',need:2,dm:'s'},
{id:'counter',t:'Learn the counterattack',d:'Block an attack, then press O within one second for a fast, strong reply.',goal:'Land 2 counterattacks',hint:'Hold K, block the strike, then tap O',ev:'counter',need:2,dm:'a'}]}];

/* backdrop */
const BG=document.createElement('canvas');BG.width=W;BG.height=H;
(function(){const g=BG.getContext('2d');const gr=g.createLinearGradient(0,0,0,FY);gr.addColorStop(0,'#eadfbd');gr.addColorStop(1,'#d3c293');g.fillStyle=gr;g.fillRect(0,0,W,FY);
g.globalAlpha=.4;g.strokeStyle='#4a3a28';g.lineWidth=4;for(let x=0;x<=W;x+=100){g.beginPath();g.moveTo(x,0);g.lineTo(x,FY);g.stroke()}
g.lineWidth=2;for(let y=70;y<FY;y+=80){g.beginPath();g.moveTo(0,y);g.lineTo(W,y);g.stroke()}g.globalAlpha=1;
g.fillStyle='#4a3a28';g.fillRect(0,0,W,12);
[150,650].forEach(x=>{const r=g.createRadialGradient(x,50,4,x,50,75);r.addColorStop(0,'rgba(242,180,65,.85)');r.addColorStop(1,'rgba(242,180,65,0)');g.fillStyle=r;g.fillRect(x-75,0,150,130);g.fillStyle='#c8363f';g.beginPath();g.ellipse(x,50,16,22,0,0,7);g.fill();g.fillStyle='#4a3a28';g.fillRect(x-8,26,16,4)});
g.fillStyle='#a58b55';g.fillRect(0,FY,W,H-FY);g.strokeStyle='#7c673a';g.lineWidth=2;for(let x=0;x<=W;x+=160){g.beginPath();g.moveTo(x,FY);g.lineTo(x-30,H);g.stroke()}
g.beginPath();g.moveTo(0,FY+32);g.lineTo(W,FY+32);g.stroke();g.fillStyle='#4a3a28';g.fillRect(0,FY-3,W,4)})();

/* figures */
const IDLE={lean:.05,cr:0,fh:[24,16],bh:[8,24],ff:[18,52],bf:[-14,52]};
const POSE={jab:{lean:.1,cr:0,fh:[62,-2],bh:[8,22],ff:[18,52],bf:[-14,52]},cross:{lean:.28,cr:0,fh:[24,14],bh:[64,2],ff:[22,52],bf:[-20,52]},low:{lean:-.1,cr:10,fh:[24,16],bh:[8,24],ff:[66,40],bf:[-12,52]},upper:{lean:-.05,cr:8,fh:[34,-44],bh:[8,24],ff:[18,52],bf:[-16,52]},heavy:{lean:-.2,cr:0,fh:[10,10],bh:[-6,20],ff:[72,-6],bf:[-12,52]},counter:{lean:.3,cr:0,fh:[66,0],bh:[26,10],ff:[24,52],bf:[-20,52]},block:{lean:0,cr:4,fh:[30,-30],bh:[20,-18],ff:[16,52],bf:[-14,52]},dodge:{lean:-.45,cr:16,fh:[10,24],bh:[0,30],ff:[10,50],bf:[-20,50]},hit:{lean:-.35,cr:0,fh:[0,34],bh:[-6,34],ff:[10,52],bf:[-18,52]},wind:{lean:-.2,cr:2,fh:[-4,10],bh:[-8,16],ff:[14,52],bf:[-18,52]}};
const ez=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t)};
function mix(a,b,t){const m=(p,q)=>p+(q-p)*t,v=(p,q)=>[m(p[0],q[0]),m(p[1],q[1])];return{lean:m(a.lean,b.lean),cr:m(a.cr,b.cr),fh:v(a.fh,b.fh),bh:v(a.bh,b.bh),ff:v(a.ff,b.ff),bf:v(a.bf,b.bf)}}
const idle=()=>({...IDLE,cr:Math.sin(T/260)*2});
function fig(x,f,p,o){const s=o.s||1,hy=-52+p.cr,sx=Math.sin(p.lean)*44,sy=hy-Math.cos(p.lean)*44,hx=sx+Math.sin(p.lean)*15,hdy=sy-Math.cos(p.lean)*15-6;
X.save();X.translate(x,FY);X.scale(f*s,s);if(o.fall)X.rotate(-o.fall*1.45);X.lineCap=X.lineJoin='round';X.strokeStyle=X.fillStyle=o.c;
const limb=(ax,ay,bx,by,w,b)=>{X.lineWidth=w;X.beginPath();X.moveTo(ax,ay);X.lineTo((ax+bx)/2+b[0],(ay+by)/2+b[1]);X.lineTo(bx,by);X.stroke()};
const bf=[p.bf[0],p.bf[1]-52],ff=[p.ff[0],p.ff[1]-52];
limb(0,hy,bf[0],bf[1],9,[-4,2]);limb(0,hy,ff[0],ff[1],10,[8,0]);
X.lineWidth=13;X.beginPath();X.moveTo(0,hy);X.lineTo(sx,sy);X.stroke();
limb(sx,sy,sx+p.bh[0],sy+p.bh[1],8,[0,9]);limb(sx,sy,sx+p.fh[0],sy+p.fh[1],9,[0,9]);
X.beginPath();X.arc(hx,hdy,12,0,7);X.fill();
if(o.band){X.strokeStyle=o.band;X.lineWidth=4;X.beginPath();X.moveTo(hx-12,hdy-3);X.lineTo(hx+12,hdy-3);X.moveTo(hx-12,hdy-3);X.lineTo(hx-24,hdy+4);X.stroke()}
X.restore()}

/* audio */
function tone(f1,f2,d,ty,v,dl){if(!AC)return;const t=AC.currentTime+(dl||0),o=AC.createOscillator(),g=AC.createGain();o.type=ty;o.frequency.setValueAtTime(f1,t);o.frequency.exponentialRampToValueAtTime(f2,t+d);g.gain.setValueAtTime(v,t);g.gain.exponentialRampToValueAtTime(.001,t+d);o.connect(g);g.connect(AC.destination);o.start(t);o.stop(t+d)}
function sfx(k){({hit:()=>tone(160,50,.14,'square',.08),block:()=>tone(520,380,.07,'triangle',.1),whoosh:()=>tone(320,140,.08,'sawtooth',.03),dodge:()=>tone(700,380,.1,'sine',.07),win:()=>[392,494,587,784].forEach((f,i)=>tone(f,f,.18,'triangle',.08,i*.1))})[k]()}

/* state */
const mkEn=(c,x)=>({cfg:c,x,hp:c.hp,max:c.hp,st:'go',t:0,nx:T+c.gap,tt:0,hitAt:0,hitUntil:0,kind:'cross',dead:false,dt:0});
function resetPl(){pl={x:160,hp:100,atk:null,blk:false,dodgeUntil:0,hitUntil:0,cu:0,dead:false,dt:0}}
const msg=(t,ms)=>{msgT=t;msgU=T+(ms||1700)};
const busy=()=>(pl.atk&&T<pl.atk.end)||T<pl.hitUntil||T<pl.dodgeUntil+250;
const guardUp=()=>en.cfg.guard&&!['tele','stag'].includes(en.st)&&!(en.st==='rec'&&T-en.hitAt<260);
const fx=(x,y,k)=>fxs.push({x,y,t:T,k});
const S=()=>L.steps[stepI];

function emit(ev){if(mode!=='train')return;const s=S();if(ev!==s.ev)return;prog++;sfx('win');msg(prog<s.need?'Good. '+prog+' of '+s.need:'Move learned');if(prog>=s.need)stepDone()}
function stepDone(){mode='tdone';const tok=run;setTimeout(()=>{if(tok!==run)return;stepI++;stepI<L.steps.length?introStep():fightIntro()},1400)}

function tryAtk(m){if(!have.has(m)||busy()||pl.dead)return;if(m==='counter'){if(T>pl.cu){msg('Counterattack only works right after a block');return}pl.cu=0}
const d=MV[m];pl.atk={m,t0:T,hit:T+d.h,end:T+d.e,done:false};pl.blk=false;sfx('whoosh')}
function dodge(){if(!have.has('dodge')||busy()||pl.dead)return;pl.atk=null;pl.dodgeUntil=T+280;sfx('dodge')}
function resolveAtk(a){const m=MV[a.m];if(en.dead)return;const dist=en.x-pl.x;
if(dist>m.r){msg(dist>m.r+40?'Out of range. Step closer with D':'Just out of reach. Move in a little');return}
let dm=m.d;if(guardUp()&&!m.g){dm*=.35;msg('Guard is up. Try a low kick, uppercut or heavy kick')}
en.hp=Math.max(0,en.hp-dm);en.hitUntil=T+220;en.x=Math.min(W-40,en.x+10);fx(en.x-14,FY-85,'h');sfx('hit');
if(m.d>=15&&en.st==='tele'){en.st='stag';en.t=T+600;msg('Interrupted!')}
emit(a.m==='counter'?'counter':a.m);if(en.hp<=0)kill()}
function kill(){en.dead=true;en.dt=T;mode='ending';sfx('win');const tok=run;setTimeout(()=>{if(tok!==run)return;mode='done';const ms=L.steps.map(s=>'<li>'+NM[s.id][0]+'</li>').join('');
if(lvl<2)ov(`<h2>Level complete</h2><p>You beat ${L.foe.n}. Moves learned:</p><ul>${ms}</ul><div class="row"><button class="btn" onclick="nextLevel()">Continue (Enter)</button></div>`),onEnter=nextLevel;
else ov(`<h2>Victory</h2><p>The Shadow Master falls. You mastered all eight moves.</p><ul>${[...have].map(h=>'<li>'+NM[h][0]+'</li>').join('')}</ul><div class="row"><button class="btn" onclick="showMenu()">Play again (Enter)</button></div>`),onEnter=showMenu},1100)}
function lose(){pl.hp=0;pl.dead=true;pl.dt=T;mode='ending';sfx('hit');const tok=run;setTimeout(()=>{if(tok!==run)return;mode='lost';ov(`<h2>Defeated</h2><p>${L.foe.n} got the better of you. Your moves are intact. Try again.</p><div class="row"><button class="btn" onclick="beginFight()">Retry fight (Enter)</button></div>`);onEnter=beginFight},1000)}

function startTele(ms){en.st='tele';en.tt=T;en.hitAt=T+ms;en.kind=Math.random()<.5?'cross':'heavy'}
function enHit(){const c=en.cfg,d=en.x-pl.x;if(d>c.r+8)return;
if(T<=pl.dodgeUntil){emit('dodge');msg('Dodged!');sfx('dodge');return}
if(pl.blk){pl.hp-=c.dmg*.15;pl.cu=T+1100;fx(pl.x+30,FY-85,'b');sfx('block');emit('block');msg(have.has('counter')?'Blocked! Press O to counter':'Blocked!')}
else{pl.hp-=c.dmg;pl.hitUntil=T+320;pl.atk=null;pl.x=Math.max(40,pl.x-16);fx(pl.x+10,FY-90,'h');sfx('hit');if(!c.dmg)msg('You were hit. Time it as the ring closes')}
if(pl.hp<=0)lose()}
function updEn(dt){if(en.dead)return;const c=en.cfg;
if(en.st==='stag'){if(T>=en.t){en.st='go';en.nx=T+c.gap}return}
if(en.st==='tele'){if(T>=en.hitAt){enHit();en.st='rec';en.t=T+c.rec}return}
if(en.st==='rec'){if(T>=en.t){if(c.chain&&!en.ch&&Math.random()<c.chain){en.ch=1;startTele(c.tele*.7)}else{en.ch=0;en.st='go';en.nx=T+c.gap}}return}
if(c.still)return;if(en.x-pl.x>c.r-12)en.x=Math.max(pl.x+46,en.x-c.spd*dt);else if(T>=en.nx)startTele(c.tele)}
function updPl(dt){if(pl.dead)return;const a=pl.atk,act=a&&T<a.end;
if(a&&!a.done&&T>=a.hit){a.done=1;resolveAtk(a)}
pl.blk=!!keys.k&&have.has('block')&&!act&&T>=pl.hitUntil&&T>=pl.dodgeUntil;
if(!act&&T>=pl.hitUntil){pl.x+=((keys.d?1:0)-(keys.a?1:0))*(pl.blk?80:170)*dt}
pl.x=Math.max(40,Math.min(pl.x,en.x-46))}

/* flow */
function ov(h,top){const o=$('ov');o.className='ov'+(top?' top':'');o.innerHTML='<div class="card">'+h+'</div>';o.style.display='flex';const b=o.querySelector('.btn');if(b)b.focus({preventScroll:true})}
const hide=()=>{$('ov').style.display='none';onEnter=null};
function showMenu(){mode='menu';run++;paused=false;have.clear();lvl=0;L=LV[0];resetPl();en=mkEn(TS,560);ov(`<h1>Shadow Dojo</h1><p class="tag">Learn. Fight. Master.</p><p>Eight moves, three levels. Every move is shown, tried, and proven in a drill before you fight with it.</p><div class="row"><button class="btn" onclick="startGame()">Start game (Enter)</button><button class="btn2" onclick="showControls()">Controls</button><button class="btn2" onclick="showAbout()">About</button></div>`);onEnter=startGame}
function showControls(){ov(`<h2>Controls</h2><table><tr><td>A / D</td><td>Move left / right</td></tr><tr><td>J</td><td>Jab</td></tr><tr><td>U</td><td>Cross</td></tr><tr><td>I</td><td>Low kick</td></tr><tr><td>Y</td><td>Uppercut</td></tr><tr><td>H</td><td>Heavy kick</td></tr><tr><td>K</td><td>Block (hold)</td></tr><tr><td>L</td><td>Dodge</td></tr><tr><td>O</td><td>Counterattack, right after a block</td></tr><tr><td>Esc</td><td>Pause or resume</td></tr></table><p class="tag">Moves unlock one at a time during training.</p><div class="row"><button class="btn" onclick="showMenu()">Back</button></div>`);onEnter=showMenu}
function showAbout(){ov(`<h2>About</h2><p>Shadow Dojo teaches fighting moves by making you perform them. A hit only counts toward a drill when it lands, so mashing keys out of range teaches nothing.</p><p>Level 1 teaches jab and block, level 2 cross, low kick and dodge, level 3 uppercut, heavy kick and counterattack. Two opponents, then the Shadow Master.</p><div class="row"><button class="btn" onclick="showMenu()">Back</button></div>`);onEnter=showMenu}
function startGame(){lvl=0;beginLevel()}
function nextLevel(){lvl++;beginLevel()}
function restartLevel(){if(mode==='menu')return;paused=false;beginLevel()}
function beginLevel(){run++;L=LV[lvl];stepI=0;have.clear();for(let i=0;i<lvl;i++)LV[i].steps.forEach(s=>have.add(s.id));resetPl();introStep()}
function introStep(){const s=S();prog=0;en=mkEn(s.dm==='a'?TA:s.dm==='g'?TG:TS,560);resetPl();mode='intro';
ov(`<div class="tag">Level ${lvl+1}: training</div><h2>${s.t}</h2><p>${s.d}</p><p>Goal: ${s.goal}. Key: <b>${NM[s.id][1]}</b></p><div class="row" style="margin-top:6px"><button class="btn" onclick="beginStep()">Try it (Enter)</button></div>`,1);onEnter=beginStep}
function beginStep(){hide();have.add(S().id);prog=0;mode='train';msg(S().hint,3800)}
function fightIntro(){stepI=L.steps.length;en=mkEn(TS,560);resetPl();mode='intro';ov(`<h2>Fight: ${L.foe.n}</h2><p>${L.fi}</p><div class="row"><button class="btn" onclick="beginFight()">Begin (Enter)</button></div>`);onEnter=beginFight}
function beginFight(){run++;hide();en=mkEn(L.foe,600);resetPl();mode='fight';msg('Fight!')}
function togglePause(force){if(!paused&&mode!=='train'&&mode!=='fight')return;paused=force===true?true:!paused;
if(paused){ov(`<h2>Paused</h2><div class="row"><button class="btn" onclick="togglePause()">Resume (Enter)</button><button class="btn2" onclick="restartLevel()">Restart level</button></div>`);onEnter=()=>togglePause()}else hide()}

/* input */
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(!AC)try{AC=new AudioContext()}catch(_){}
if(k==='enter'){if(onEnter&&$('ov').style.display!=='none'){e.preventDefault();onEnter()}return}
if(k==='escape'){togglePause();return}
if(k===' '||k.startsWith('arrow'))e.preventDefault();
keys[k]=true;if(e.repeat||paused||(mode!=='train'&&mode!=='fight'))return;
if(k==='l')dodge();else if(KEY[k])tryAtk(KEY[k])});
addEventListener('keyup',e=>{keys[e.key.toLowerCase()]=false});
addEventListener('blur',()=>{keys.a=keys.d=keys.k=false;if(mode==='train'||mode==='fight')togglePause(true)});

/* poses */
function demoPose(){const s=S();if(!s)return idle();const ph=(T%1600)/1600,id=s.id;
if(id==='block')return ph<.6?POSE.block:idle();if(id==='dodge')return ph<.5?POSE.dodge:idle();if(id==='counter'&&ph<.35)return POSE.block;
const q=id==='counter'?(ph-.35)/.65:ph,e=q<.2?q/.2:q<.35?1-(q-.2)/.15:0;return mix(IDLE,POSE[MV[id].p],ez(e))}
function plPose(){if(mode==='intro')return demoPose();if(pl.dead||T<pl.hitUntil)return POSE.hit;const a=pl.atk;
if(a&&T<a.end){const p=(T-a.t0)/(a.end-a.t0),h=(a.hit-a.t0)/(a.end-a.t0);return mix(IDLE,POSE[MV[a.m].p],ez(p<h?p/h:1-(p-h)/(1-h)))}
if(T<pl.dodgeUntil)return POSE.dodge;if(pl.blk)return POSE.block;return idle()}
function enPose(){if(en.dead||T<en.hitUntil||en.st==='stag')return POSE.hit;
if(en.st==='tele')return mix(IDLE,POSE.wind,ez((T-en.tt)/(en.hitAt-en.tt)));
if(en.st==='rec'&&T-en.hitAt<260)return mix(POSE[en.kind],IDLE,ez((T-en.hitAt)/260));
if(guardUp())return POSE.block;return idle()}

/* draw */
function bar(x,w,fr,col,right,lab){X.fillStyle='#4a3a28';X.fillRect(x,24,w,12);X.fillStyle=col;const ww=w*Math.max(0,fr);X.fillRect(right?x+w-ww:x,24,ww,12);X.fillStyle='#2a2118';X.font='700 13px system-ui,sans-serif';X.textAlign=right?'right':'left';X.fillText(lab,right?x+w:x,19)}
function draw(){X.drawImage(BG,0,0);
if(en){const c=en.cfg,dm=c.hp>1e8;fig(en.x,-1,enPose(),{s:c.s||1,c:dm?'#3a3a44':'#0a0a0a',band:dm?0:'#c8363f',fall:en.dead?ez((T-en.dt)/500):0});
if(en.st==='tele'&&!en.dead){const pr=(T-en.tt)/(en.hitAt-en.tt);X.strokeStyle='#c8363f';X.lineWidth=4;X.beginPath();X.arc(en.x-18,FY-84,8+52*(1-pr),0,7);X.stroke();X.fillStyle='#c8363f';X.font='800 26px Georgia,serif';X.textAlign='center';X.fillText('!',en.x-18,FY-150*(c.s||1))}}
if(pl)fig(pl.x,1,plPose(),{c:'#0a0a0a',band:'#2f7a63',fall:pl.dead?ez((T-pl.dt)/500):0});
for(let i=fxs.length-1;i>=0;i--){const f=fxs[i],a=(T-f.t)/260;if(a>1){fxs.splice(i,1);continue}X.lineWidth=3;if(f.k==='b'){X.strokeStyle='#2f7a63';X.beginPath();X.arc(f.x,f.y,8+a*26,-1.2,1.2);X.stroke()}else{X.strokeStyle=i%2?'#f2b441':'#fff';for(let j=0;j<7;j++){const an=j*.9,r1=8+a*14,r2=r1+10;X.beginPath();X.moveTo(f.x+Math.cos(an)*r1,f.y+Math.sin(an)*r1);X.lineTo(f.x+Math.cos(an)*r2,f.y+Math.sin(an)*r2);X.stroke()}}}
if(mode!=='menu'&&en){bar(20,300,pl.hp/100,'#2f7a63',0,'You');if(en.cfg.hp<1e8)bar(480,300,en.hp/en.max,'#c8363f',1,en.cfg.n);else{X.fillStyle='#2a2118';X.font='700 13px system-ui,sans-serif';X.textAlign='right';X.fillText('Training',780,19)}}
if(T<msgU&&msgT){X.font='700 16px system-ui,sans-serif';const w=X.measureText(msgT).width+28;X.fillStyle='rgba(42,33,24,.9)';X.fillRect(W/2-w/2,mode==='intro'?232:70,w,32);X.fillStyle='#f4ead0';X.textAlign='center';X.fillText(msgT,W/2,(mode==='intro'?232:70)+21)}}
let lastH='';
function hud(){let s;if(mode==='menu')s='Press Start to begin.';else{const st=S(),tr=st&&['train','tdone','intro'].includes(mode);
s=`<b>Level ${lvl+1}: ${L.name}</b> ${tr?'(training)':'(vs '+L.foe.n+')'}<br>`+(tr?`Goal: ${st.goal}. Progress ${prog} of ${st.need}`:`Defeat ${L.foe.n}. Block, dodge and mix your attacks.`)+'<br><span class="ks"><b>A D</b>move</span>'+[...have].map(h=>`<span class="ks"><b>${NM[h][1]}</b>${NM[h][0]}</span>`).join('')}
if(s!==lastH){$('hud').innerHTML=s;lastH=s}}
let last=performance.now();
function loop(n){const dt=Math.min(.05,(n-last)/1000);last=n;if(!paused){T+=dt*1000;if(mode==='train'||mode==='fight'){updPl(dt);updEn(dt)}}draw();hud();requestAnimationFrame(loop)}
showMenu();requestAnimationFrame(loop);
