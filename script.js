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

  // Wait for click to go to Slide 3
  btnFaine.addEventListener("click", () => {
    showSlide("slide-3");
    initFinalScreen(); // set up YES/NO logic
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

  // Place YES roughly center; NO somewhere else
  placeElementWithin(arena, btnNo, 0.70, 0.62);
  placeYesWithin(arena, yesWrap, 0.45, 0.48);

  // YES follows cursor ONLY when cursor moves
  let hideAhemTimer = null;

  arena.addEventListener("mousemove", (e) => {
    // YES follow (reactive to movement)
    const rect = arena.getBoundingClientRect();
    const targetX = e.clientX - rect.left;
    const targetY = e.clientY - rect.top;

    moveYesTowardPoint(arena, yesWrap, targetX, targetY);

    // Show ahem while moving; hide shortly after movement stops
    ahem.classList.remove("hidden");
    if (hideAhemTimer) clearTimeout(hideAhemTimer);
    hideAhemTimer = setTimeout(() => {
      ahem.classList.add("hidden");
      // YES is already resting because we only move on mousemove
    }, 140);

    // NO dodge when cursor approaches
    dodgeNoIfClose(arena, btnNo, targetX, targetY);
  });

  // Touch support: moving finger = touchmove triggers same logic
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

  // Also dodge if user manages to hover NO
  btnNo.addEventListener("mouseenter", () => {
    randomReposition(arena, btnNo);
  });

  btnNo.addEventListener("touchstart", (e) => {
    e.preventDefault();
    randomReposition(arena, btnNo);
  });

  // YES click -> success
  btnYes.addEventListener("click", () => {
    runSuccess();
  });
}

function placeElementWithin(container, el, fx, fy) {
  // fx/fy are 0..1 positions within container
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
  // IMPORTANT: this only runs on mousemove/touchmove.
  // So YES will NOT "move while cursor approaches" unless cursor itself moved.
  const c = container.getBoundingClientRect();
  const w = yesWrap.offsetWidth;
  const h = yesWrap.offsetHeight;

  // Keep YES within bounds
  const x = clamp(px, w * 0.5, c.width - w * 0.5);
  const y = clamp(py, h * 0.5, c.height - h * 0.5);

  // gentle easing toward cursor
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

  // compute NO center relative to container
  const noX = (noRect.left - cRect.left) + noRect.width / 2;
  const noY = (noRect.top  - cRect.top)  + noRect.height / 2;

  const dx = px - noX;
  const dy = py - noY;
  const dist = Math.hypot(dx, dy);

  // threshold: when cursor gets close, move it
  const threshold = 120;

  if (dist < threshold) {
    randomReposition(container, btnNo);
  }
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

// ---------- Success screen ----------
async function runSuccess() {
  showSlide("slide-success");

  const target = document.getElementById("successText");
  const sunflower = document.getElementById("sunflower");

  target.innerHTML = ""; // we will type into it
  sunflower.classList.add("hidden");

  // Message with fire behind "hawt"
  const parts = [
    "Thanks for making my life soooo much brighter you beautiful, gorgeous, ",
    { hawt: true, text: "hawt" },
    " sunflower you."
  ];

  await typeParts(target, parts, 28);

  await sleep(250);
  sunflower.classList.remove("hidden");
}

async function typeParts(targetEl, parts, delayMs) {
  // Types normal strings char-by-char.
  // Inserts the "hawt" span with fire effect when reached.
  for (const part of parts) {
    if (typeof part === "string") {
      await typeText(targetEl, part, delayMs);
    } else if (part && part.hawt) {
      // insert hawt with special span
      const span = document.createElement("span");
      span.className = "hawtWrap";
      targetEl.appendChild(span);
      await typeText(span, part.text, delayMs);
    }
  }
}

async function typeText(el, text, delayMs) {
  for (const ch of text) {
    el.textContent += ch;
    await sleep(delayMs);
  }
}

// ---------- Start ----------
runSlides().catch(console.error);