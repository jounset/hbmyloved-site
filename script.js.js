let screens=[...document.querySelectorAll(".screen")];
let current=0;

function next(){
  if(current>=screens.length-1)return;
  screens[current].classList.remove("active");
  screens[current].classList.add("old");
  current++;
  screens[current].classList.add("active");
}
function prev(){
  if(current<=0)return;
  screens[current].classList.remove("active");
  current--;
  screens[current].classList.remove("old");
  screens[current].classList.add("active");
}
document.querySelectorAll("[data-next]").forEach(btn=>btn.addEventListener("click",next));
document.querySelectorAll("[data-prev]").forEach(btn=>btn.addEventListener("click",prev));

document.querySelectorAll(".answer-btn").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const card=btn.closest(".card");
    const input=card.querySelector("input");
    if(input && !input.value.trim()) input.value="мой ответ";
    card.querySelector(".reaction").classList.add("show");
    const gallery=card.querySelector(".memory-gallery");
    if(gallery) gallery.classList.add("show");
  });
});

document.querySelectorAll(".finish-draw").forEach(btn=>{
  btn.addEventListener("click",()=>{
    const card=btn.closest(".card");
    card.querySelector(".reaction").classList.add("show");
    const gallery=card.querySelector(".memory-gallery");
    if(gallery) gallery.classList.add("show");
  });
});

const bgPhotos=document.querySelectorAll(".bg-photo");
let bgIndex=0;
setInterval(()=>{
  if(!bgPhotos.length)return;
  bgPhotos[bgIndex].classList.remove("active");
  bgIndex=(bgIndex+1)%bgPhotos.length;
  bgPhotos[bgIndex].classList.add("active");
},4200);

const scratch=document.getElementById("scratch");
const sctx=scratch.getContext("2d");
function setupScratch(){
  const r=scratch.getBoundingClientRect();
  scratch.width=r.width*devicePixelRatio;
  scratch.height=r.height*devicePixelRatio;
  sctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  const g=sctx.createLinearGradient(0,0,r.width,r.height);
  g.addColorStop(0,"#7c5cff");
  g.addColorStop(.4,"#25c7f7");
  g.addColorStop(.75,"#ffd84f");
  g.addColorStop(1,"#ff5fa2");
  sctx.globalCompositeOperation="source-over";
  sctx.fillStyle=g;
  sctx.fillRect(0,0,r.width,r.height);
  sctx.fillStyle="rgba(255,255,255,.92)";
  sctx.font="900 18px Manrope";
  sctx.textAlign="center";
  sctx.fillText("сотри меня",r.width/2,r.height/2-8);
  sctx.font="800 14px Manrope";
  sctx.fillText("и увидишь фото",r.width/2,r.height/2+20);
}
setTimeout(setupScratch,300);
let erasing=false;
function erase(e){
  if(!erasing)return;
  const r=scratch.getBoundingClientRect();
  const x=e.clientX-r.left,y=e.clientY-r.top;
  sctx.globalCompositeOperation="destination-out";
  const brush=sctx.createRadialGradient(x,y,2,x,y,38);
  brush.addColorStop(0,"rgba(0,0,0,1)");
  brush.addColorStop(.75,"rgba(0,0,0,.9)");
  brush.addColorStop(1,"rgba(0,0,0,0)");
  sctx.fillStyle=brush;
  sctx.beginPath();
  sctx.arc(x,y,38,0,Math.PI*2);
  sctx.fill();
}
scratch.addEventListener("pointerdown",e=>{erasing=true;scratch.setPointerCapture(e.pointerId);erase(e);});
scratch.addEventListener("pointermove",erase);
scratch.addEventListener("pointerup",()=>erasing=false);
scratch.addEventListener("pointercancel",()=>erasing=false);

const paint=document.getElementById("paint");
const pctx=paint.getContext("2d");
let paintColor="#7c5cff";
function setupPaint(){
  const r=paint.getBoundingClientRect();
  paint.width=r.width*devicePixelRatio;
  paint.height=r.height*devicePixelRatio;
  pctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);
  pctx.lineWidth=7;
  pctx.lineCap="round";
  pctx.lineJoin="round";
}
setTimeout(setupPaint,300);
let painting=false,last=null;
function pnt(e){const r=paint.getBoundingClientRect();return{x:e.clientX-r.left,y:e.clientY-r.top}}
paint.addEventListener("pointerdown",e=>{painting=true;last=pnt(e);paint.setPointerCapture(e.pointerId);});
paint.addEventListener("pointermove",e=>{
  if(!painting)return;
  const now=pnt(e);
  pctx.strokeStyle=paintColor;
  pctx.beginPath();
  pctx.moveTo(last.x,last.y);
  pctx.lineTo(now.x,now.y);
  pctx.stroke();
  last=now;
});
paint.addEventListener("pointerup",()=>painting=false);
paint.addEventListener("pointercancel",()=>painting=false);
document.querySelectorAll(".color").forEach(b=>b.onclick=()=>{
  paintColor=b.dataset.color;
  document.querySelectorAll(".color").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
});
function clearPaint(){
  const r=paint.getBoundingClientRect();
  pctx.clearRect(0,0,r.width,r.height);
}
