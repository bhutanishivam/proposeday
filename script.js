"use strict";

// ---------- Helpers ----------
function showSlide(id) {
  document.querySelectorAll(".slide").forEach(s => s.classList.remove("active"));
  document.getElementById(id).classList.add("active");
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

function rand(min, max) {
  return Math.random() * (max - min) + min;
}

// ---------- Slideshow timing ----------
const s1Lines = [
  "Oh god…",
  "I’ve seen this on Instagram already.",
  "Doesnt this boy know i hate fads."
];

async function runSlides() {
  // Slide 1
  showSlide("slide-1");
  const s1Bubble = document.getElementById("s1-bubble");
  s1Bubble.textContent = "";
  await sleep(700);

  for (const line of s1Lines) {
    s1Bubble.textContent = line;
    await sleep(2200);
  }
  await sleep(700);

  // Slide 2
  showSlide("slide-2");
  const s2Bubble = document.getElementById("s2-bubble");
  const btnFaine = document.getElementById("btn-faine");

  s2Bubble.textContent = "";
  btnFaine.classList.add("hidden");

  await sleep(700);
  s2Bubble.textContent = "Fad or not, you are doing this…";
  await sleep(1600);

  btnFaine.classList.remove("hidden");

  btnFaine.addEventListener("click", () => {
    showSlide("slide-3");
    initFinalScreen();
    startDialogueRotation();
    startTypingIndicator();
  }, { once: true });
}

// ---------- Final screen interactions ----------
let finalInited = false;

function initFinalScreen() {
  if (finalInited) return;
  finalInited = true;

  const arena = document.getElementById("buttonArena");
  const yesWrap = document.getElementById("yesWrap");
  const btnYes = document.getElementById("btn-yes");
  const btnNo  = document.getElementById("btn-no");
  const ahem   = document.getElementById("ahem");

  placeElementWithin(arena, btnNo, 0.70, 0.62);
  placeYesWithin(arena, yesWrap, 0.45, 0.48);

  let hideAhemTimer = null;

  arena.addEventListener("mousemove", (e) => {
    const rect = arena.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;

    moveYesTowardPoint(arena, yesWrap, targetX, targetY);

    ahem.classList.remove("hidden");
    if (hideAhemTimer) clearTimeout(hideAhemTimer);
    hideAhemTimer = setTimeout(() => ahem.classList.add("hidden"), 140);

    dodgeNoIfClose(arena, btnNo, targetX, targetY);
  });

  arena.addEventListener("touchmove", (e) => {
    const t = e.touches[0];
    if (!t) return;

    const rect = arena.getBoundingClientRect();
    const targetX = t.clientX - rect.left;
    const targetY = t.clientY - rect.top;

    moveYesTowardPoint(arena, yesWrap, targetX, targetY);

    ahem.classList.remove("hidden");
    if (hideAhemTimer) clearTimeout(hideAhemTimer);
    hideAhemTimer = setTimeout(() => ahem.classList.add("hidden"), 200);

    dodgeNoIfClose(arena, btnNo, targetX, targetY);
  }, { passive: true });

  btnNo.addEventListener("mouseenter", () => randomReposition(arena, btnNo));
  btnNo.addEventListener("touchstart", (e) => {
    e.preventDefault();
    randomReposition(arena, btnNo);
  });

  btnYes.addEventListener("click", () => runSuccess());
}

function placeElementWithin(container, el, fx, fy) {
  const c = container.getBoundingClientRect();
  const w = el.offsetWidth;
  const h = el.offsetHeight;

  const x = clamp(c.width * fx, w * 0.5, c.width - w * 0.5);
  const y = clamp(c.height * fy, h * 0.5, c.height - h * 0.5);

  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
}

function placeYesWithin(container, yesWrap, fx, fy) {
  const c = container.getBoundingClientRect();
  const w = yesWrap.offsetWidth;
  const h = yesWrap.offsetHeight;

  const x = clamp(c.width * fx, w * 0.5, c.width - w * 0.5);
  const y = clamp(c.height * fy, h * 0.5, c.height - h * 0.5);

  yesWrap.style.left = `${x}px`;
  yesWrap.style.top  = `${y}px`;
}

function moveYesTowardPoint(container, yesWrap, px, py) {
  const c = container.getBoundingClientRect();
  const w = yesWrap.offsetWidth;
  const h = yesWrap.offsetHeight;

  const x = clamp(px, w * 0.5, c.width - w * 0.5);
  const y = clamp(py, h * 0.5, c.height - h * 0.5);

  const curX = parseFloat(yesWrap.style.left || (c.width / 2));
  const curY = parseFloat(yesWrap.style.top  || (c.height / 2));
  const ease = 0.22;

  const nextX = curX + (x - curX) * ease;
  const nextY = curY + (y - curY) * ease;

  yesWrap.style.left = `${nextX}px`;
  yesWrap.style.top  = `${nextY}px`;
}

function dodgeNoIfClose(container, btnNo, px, py) {
  const noRect = btnNo.getBoundingClientRect();
  const cRect  = container.getBoundingClientRect();

  const noX = (noRect.left - cRect.left) + noRect.width / 2;
  const noY = (noRect.top  - cRect.top)  + noRect.height / 2;

  const dx = px - noX;
  const dy = py - noY;
  const dist = Math.hypot(dx, dy);

  if (dist < 120) randomReposition(container, btnNo);
}

function randomReposition(container, el) {
  const c = container.getBoundingClientRect();
  const w = el.offsetWidth;
  const h = el.offsetHeight;

  const pad = 12;
  const x = rand(pad + w * 0.5, c.width - pad - w * 0.5);
  const y = rand(pad + h * 0.5, c.height - pad - h * 0.5);

  el.style.left = `${x}px`;
  el.style.top  = `${y}px`;
}

// ---------- Slide 3 dialogue rotation (7s, no loop) ----------
const dialogueMessages = [
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

let dialogueTimer = null;
function startDialogueRotation() {
  const el = document.getElementById("dialogueLine");
  if (!el || dialogueTimer) return;

  let idx = 0;

  dialogueTimer = setInterval(() => {
    if (idx < dialogueMessages.length - 1) {
      idx++;
      el.textContent = dialogueMessages[idx];
    } else {
      clearInterval(dialogueTimer);
      dialogueTimer = null;
    }
  }, 7000);
}

// ---------- Typing indicator (LEFT → RIGHT dots) ----------
let typingTimer = null;
function startTypingIndicator() {
  const dotsEl = document.getElementById("typingDots");
  if (!dotsEl || typingTimer) return;

  let count = 0;

  typingTimer = setInterval(() => {
    count = (count % 3) + 1;   // 1 → 2 → 3 → 1
    dotsEl.textContent = ".".repeat(count);
  }, 420);
}

// ---------- Success screen ----------
async function runSuccess() {
  showSlide("slide-success");

  if (dialogueTimer) clearInterval(dialogueTimer);
  if (typingTimer) clearInterval(typingTimer);

  const target = document.getElementById("successText");
  const sunflower = document.getElementById("sunflower");

  target.innerHTML = "";
  sunflower.classList.add("hidden");

  const parts = [
    "Thanks for making my life soooo much brighter you beautiful, witty, gorgeous, ",
    { hawt: true, text: "hawt" },
    ", amazing, angel-voiced sunflower you. 😘"
  ];

  await typeParts(target, parts, 28);
  await sleep(250);
  sunflower.classList.remove("hidden");
}

async function typeParts(targetEl, parts, delayMs) {
  for (const part of parts) {
    if (typeof part === "string") {
      await typeTextNode(targetEl, part, delayMs);
    } else if (part && part.hawt) {
      const span = document.createElement("span");
      span.className = "hawtWrap";
      targetEl.appendChild(span);
      await typeTextNode(span, part.text, delayMs);
    }
  }
}

async function typeTextNode(containerEl, text, delayMs) {
  let node = containerEl.lastChild;
  if (!node || node.nodeType !== Node.TEXT_NODE) {
    node = document.createTextNode("");
    containerEl.appendChild(node);
  }
  for (const ch of text) {
    node.nodeValue += ch;
    await sleep(delayMs);
  }
}

// ---------- Start ----------
runSlides().catch(console.error);
