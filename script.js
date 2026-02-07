"use strict";

function showSlide(id){
  document.querySelectorAll(".slide").forEach(s=>s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const rand=(a,b)=>Math.random()*(b-a)+a;

// SLIDE 1
const s1Lines=[
  "Oh god…",
  "I’ve seen this on Instagram already.",
  "Doesnt this boy know i hate fads."
];

async function runSlides(){
  showSlide("slide-1");
  const b1=document.getElementById("s1-bubble");
  for(const l of s1Lines){
    b1.textContent=l;
    await sleep(2200);
  }

  showSlide("slide-2");
  const b2=document.getElementById("s2-bubble");
  const btn=document.getElementById("btn-faine");
  b2.textContent="Fad or not, you are doing this…";
  await sleep(1600);
  btn.classList.remove("hidden");

  btn.onclick=()=>{
    showSlide("slide-3");
    initFinal();
    startDialogue();
  };
}

function initFinal(){
  const arena=document.getElementById("buttonArena");
  const yesWrap=document.getElementById("yesWrap");
  const no=document.getElementById("btn-no");
  const ahem=document.getElementById("ahem");

  let hideTimer=null;

  arena.onmousemove=e=>{
    const r=arena.getBoundingClientRect();
    moveYes(yesWrap,e.clientX-r.left,e.clientY-r.top,arena);
    ahem.classList.remove("hidden");
    clearTimeout(hideTimer);
    hideTimer=setTimeout(()=>ahem.classList.add("hidden"),140);
    dodgeNo(no,e.clientX-r.left,e.clientY-r.top,arena);
  };

  no.onmouseenter=()=>randomPos(no,arena);
  document.getElementById("btn-yes").onclick=runSuccess;
}

function moveYes(el,x,y,c){
  const w=el.offsetWidth,h=el.offsetHeight;
  el.style.left=clamp(x,w/2,c.clientWidth-w/2)+"px";
  el.style.top=clamp(y,h/2,c.clientHeight-h/2)+"px";
}

function dodgeNo(el,x,y,c){
  const r=el.getBoundingClientRect();
  const dx=x-(r.left-c.getBoundingClientRect().left+r.width/2);
  const dy=y-(r.top-c.getBoundingClientRect().top+r.height/2);
  if(Math.hypot(dx,dy)<120) randomPos(el,c);
}
function randomPos(el,c){
  el.style.left=rand(40,c.clientWidth-40)+"px";
  el.style.top=rand(40,c.clientHeight-40)+"px";
}

// dialogue rotation (no loop)
const lines=[
  "awwwwww looks like im not taking no for an answer",
  "wow, still going after no huh",
  "are you not seeing the yes, is it a visibility issue or an intent issue?",
  "yes click kar naaaaaa",
  "katai besharam",
  "its cool, i can do this all day.",
  "you know what, im just gonna give you the silent treatment until you click yes",
  "deafening silence",
  "you kidding me?",
  "jai hanuman gyaan gun saagar...",
  "sunn youre probably running late, kar de abh",
  "back to deafening silence for you...",
  "Pretty please kar de, P?"
];

function startDialogue(){
  const el=document.getElementById("dialogueLine");
  let i=0;
  setInterval(()=>{
    if(i<lines.length-1){
      i++;
      el.textContent=lines[i];
    }
  },7000);
}

// SUCCESS
async function runSuccess(){
  showSlide("slide-success");
  const t=document.getElementById("successText");
  t.innerHTML="";
  const parts=[
    "Thanks for making my life soooo much brighter you beautiful, witty, gorgeous, ",
    "<span class='hawtWrap'>hawt</span>",
    ", amazing, angel-voiced sunflower you. 😘"
  ];
  for(const p of parts){
    if(p.startsWith("<")){
      t.insertAdjacentHTML("beforeend",p);
    }else{
      for(const ch of p){
        t.append(ch);
        await sleep(28);
      }
    }
  }
}

runSlides();
