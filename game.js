(() => {
"use strict";

/* =========================================================
   QUESTION DATA — Level 1: Entrepreneurship
   ========================================================= */
const QUESTIONS = {
  fork: {
    text: "What is revenue?",
    options: [
      { text: "The total income a business earns from selling goods or services", correct: true },
      { text: "The money a business owes to lenders", correct: false },
      { text: "The number of employees a business has", correct: false },
      { text: "The profit left after all expenses are paid", correct: false },
    ],
  },
  bird: {
    text: "Give one example of why businesses fail.",
    options: [
      { text: "Poor cash-flow management", correct: true },
      { text: "Too many happy customers", correct: false },
      { text: "Having too much profit", correct: false },
      { text: "Too much government support", correct: false },
    ],
  },
  punch: {
    text: "Which sector of the economy includes farming, fishing, and mining?",
    options: [
      { text: "Primary sector", correct: true },
      { text: "Secondary sector", correct: false },
      { text: "Tertiary sector", correct: false },
      { text: "Quaternary sector", correct: false },
    ],
  },
  kick: {
    text: "Maslow's Hierarchy of Needs is a well-known motivational theory. Name one other motivational theory.",
    options: [
      { text: "Herzberg's Two-Factor Theory", correct: true },
      { text: "Newton's Laws of Motion", correct: false },
      { text: "The Big Bang Theory", correct: false },
      { text: "The Pythagorean Theorem", correct: false },
    ],
  },
};

const GARDEN_PAIRS = [
  { id: 1, q: "What is total cost?", a: "The sum of all fixed and variable costs to produce goods" },
  { id: 2, q: "What is a business?", a: "An organization that provides goods or services to earn a profit" },
  { id: 3, q: "Name the factors of production.", a: "Land, labor, capital, and entrepreneurship" },
  { id: 4, q: "What is opportunity cost?", a: "The value of the next best alternative given up when making a choice" },
];

/* =========================================================
   STATE
   ========================================================= */
const state = {
  health: 100,
  shields: 0,
  boss: { health: 100 },
  powerups: { punch: false, kick: false },
};

let dodgeRAF = null;
let bossRAF = null;

/* =========================================================
   UTIL
   ========================================================= */
function $(id) { return document.getElementById(id); }
function shuffle(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach((s) => s.classList.remove("active"));
  $(id).classList.add("active");

  const gameplayScreens = [
    "screen-fork", "screen-candy-garden", "screen-candy-quicksand",
    "screen-forest-dodge", "screen-forest-questions", "screen-forest-boss",
  ];
  $("hud").classList.toggle("hidden", !gameplayScreens.includes(id));
  $("bossBars").classList.toggle("hidden", id !== "screen-forest-boss");

  if (id !== "screen-forest-dodge" && dodgeRAF) { cancelAnimationFrame(dodgeRAF); dodgeRAF = null; }
  if (id !== "screen-forest-boss" && bossRAF) { cancelAnimationFrame(bossRAF); bossRAF = null; }
}

function resetState() {
  state.health = 100;
  state.shields = 0;
  state.boss.health = 100;
  state.powerups.punch = false;
  state.powerups.kick = false;
  $("shieldBadges").innerHTML = "";
  updateHealthUI();
  updateBossUI();
}

/* =========================================================
   HEALTH / SHIELD UI
   ========================================================= */
function updateHealthUI() {
  const fill = $("playerHealthFill");
  fill.style.width = state.health + "%";
  if (state.health >= 60) fill.style.background = "var(--ok-green)";
  else if (state.health >= 30) fill.style.background = "var(--warn-yellow)";
  else fill.style.background = "var(--danger-red)";
}

function updateBossUI() {
  const fill = $("bossHealthFill");
  fill.style.width = Math.max(0, state.boss.health) + "%";
}

function reduceHealth(amount) {
  state.health = Math.max(0, state.health - amount);
  updateHealthUI();
  const avatar = $("hudAvatar");
  avatar.style.filter = "brightness(0.5) sepia(1) hue-rotate(-40deg) saturate(4)";
  setTimeout(() => (avatar.style.filter = ""), 250);
  if (state.health <= 0) triggerGameOver();
}

function addShield() {
  state.shields++;
  const badge = document.createElement("div");
  badge.className = "shield-badge";
  badge.textContent = "+";
  $("shieldBadges").appendChild(badge);
}

function triggerGameOver(reason) {
  if (dodgeRAF) { cancelAnimationFrame(dodgeRAF); dodgeRAF = null; }
  if (bossRAF) { cancelAnimationFrame(bossRAF); bossRAF = null; }
  $("gameoverReason").textContent = reason || "Your health ran out before you reached the finish.";
  showScreen("screen-gameover");
}

/* =========================================================
   GENERIC MCQ RENDERER
   ========================================================= */
function renderMCQ(container, question, onResult) {
  container.innerHTML = "";
  const opts = shuffle(question.options);
  opts.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "q-option";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => {
      container.querySelectorAll(".q-option").forEach((b) => (b.disabled = true));
      if (opt.correct) {
        btn.classList.add("correct");
      } else {
        btn.classList.add("wrong");
        const correctBtn = [...container.querySelectorAll(".q-option")].find((b, i) => opts[i].correct);
        if (correctBtn) correctBtn.classList.add("correct");
      }
      setTimeout(() => onResult(opt.correct), 550);
    });
    container.appendChild(btn);
  });
}

/* =========================================================
   FORK SCREEN
   ========================================================= */
function initFork() {
  const runner = $("forkRunner");
  runner.className = "fork-runner";
  $("forkQuestionCard").style.opacity = "1";
  $("forkQText").textContent = QUESTIONS.fork.text;
  renderMCQ($("forkQOptions"), QUESTIONS.fork, (correct) => {
    $("forkQuestionCard").style.opacity = "0";
    runner.classList.add(correct ? "go-candy" : "go-forest");
    setTimeout(() => {
      if (correct) { initGarden(); showScreen("screen-candy-garden"); }
      else { showScreen("screen-forest-dodge"); initDodge(); }
    }, 1150);
  });
}

/* =========================================================
   CANDYLAND — GARDEN MATCHING GAME
   ========================================================= */
let gardenSelected = null;
let gardenMatchedCount = 0;

function initGarden() {
  gardenSelected = null;
  gardenMatchedCount = 0;
  $("btnGardenContinue").classList.add("hidden");

  const qCol = $("matchQuestions");
  const aCol = $("matchAnswers");
  const svg = $("matchSvg");
  qCol.innerHTML = "";
  aCol.innerHTML = "";
  svg.innerHTML = "";

  GARDEN_PAIRS.forEach((pair) => {
    const qNode = document.createElement("div");
    qNode.className = "match-node q-node";
    qNode.textContent = pair.q;
    qNode.dataset.pairId = pair.id;
    qNode.tabIndex = 0;
    qCol.appendChild(qNode);
  });

  shuffle(GARDEN_PAIRS).forEach((pair) => {
    const aNode = document.createElement("div");
    aNode.className = "match-node a-node";
    aNode.textContent = pair.a;
    aNode.dataset.pairId = pair.id;
    aNode.tabIndex = 0;
    aCol.appendChild(aNode);
  });

  qCol.querySelectorAll(".q-node").forEach((node) => node.addEventListener("click", () => selectQuestionNode(node)));
  aCol.querySelectorAll(".a-node").forEach((node) => node.addEventListener("click", () => tryMatch(node)));
}

function selectQuestionNode(node) {
  if (node.classList.contains("matched")) return;
  document.querySelectorAll(".q-node").forEach((n) => n.classList.remove("active"));
  node.classList.add("active");
  gardenSelected = node;
}

function tryMatch(aNode) {
  if (aNode.classList.contains("matched") || !gardenSelected) return;
  const correct = gardenSelected.dataset.pairId === aNode.dataset.pairId;
  if (correct) {
    drawWavyLine(gardenSelected, aNode);
    gardenSelected.classList.remove("active");
    gardenSelected.classList.add("matched");
    aNode.classList.add("matched");
    gardenSelected = null;
    gardenMatchedCount++;
    addShield();
    if (gardenMatchedCount >= GARDEN_PAIRS.length) {
      $("btnGardenContinue").classList.remove("hidden");
    }
  } else {
    [gardenSelected, aNode].forEach((n) => {
      n.classList.add("shake");
      setTimeout(() => n.classList.remove("shake"), 400);
    });
    reduceHealth(15);
  }
}

function drawWavyLine(qNode, aNode) {
  const wrap = $("matchWrap");
  const svg = $("matchSvg");
  const wrapRect = wrap.getBoundingClientRect();
  const qRect = qNode.getBoundingClientRect();
  const aRect = aNode.getBoundingClientRect();

  const x1 = qRect.right - wrapRect.left;
  const y1 = qRect.top + qRect.height / 2 - wrapRect.top;
  const x2 = aRect.left - wrapRect.left;
  const y2 = aRect.top + aRect.height / 2 - wrapRect.top;

  const segments = 8;
  const dx = (x2 - x1) / segments;
  const dy = (y2 - y1) / segments;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;
  const amp = 9;

  let d = `M ${x1} ${y1}`;
  for (let i = 1; i <= segments; i++) {
    const px = x1 + dx * i;
    const py = y1 + dy * i;
    const wave = Math.sin(i * 1.15) * amp;
    d += ` L ${(px + nx * wave).toFixed(1)} ${(py + ny * wave).toFixed(1)}`;
  }

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("fill", "none");
  path.setAttribute("stroke", "#4CE0B3");
  path.setAttribute("stroke-width", "4");
  path.setAttribute("stroke-linecap", "round");
  path.style.opacity = "0";
  path.style.transition = "opacity .3s ease";
  svg.appendChild(path);
  requestAnimationFrame(() => (path.style.opacity = "1"));
}

$("btnGardenContinue").addEventListener("click", () => {
  showScreen("screen-candy-quicksand");
  initQuicksand();
});

/* =========================================================
   CANDYLAND — QUICKSAND
   ========================================================= */
function initQuicksand() {
  $("birdQText").textContent = QUESTIONS.bird.text;
  askBird();
}

function askBird() {
  renderMCQ($("birdQOptions"), QUESTIONS.bird, (correct) => {
    if (correct) {
      $("quicksandSprite").style.transition = "transform 1s ease, opacity 1s ease";
      $("quicksandSprite").style.transform = "translate(-50%, -60px)";
      $("quicksandSprite").style.opacity = "0";
      setTimeout(() => {
        $("winStatsCandy").innerHTML =
          `<div class="win-stat">❤️ Health left: ${state.health}%</div><div class="win-stat">🛡️ Shields earned: ${state.shields}</div>`;
        showScreen("screen-win-candy");
      }, 900);
    } else {
      reduceHealth(20);
      $("questionBird").classList.add("shake");
      setTimeout(() => $("questionBird").classList.remove("shake"), 400);
      if (state.health > 0) setTimeout(askBird, 500);
    }
  });
}

/* =========================================================
   FOREST — DODGE MINIGAME
   ========================================================= */
const DODGE_DURATION = 16000;
function initDodge() {
  const canvas = $("dodgeCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  const lanes = [H * 0.22, H * 0.52, H * 0.82];
  let lane = 1;
  let playerX = 110;
  let obstacles = [];
  let lastSpawn = 0;
  let spawnInterval = 1100;
  let startTime = null;
  let invulnUntil = 0;
  let running = true;

  $("dodgeProgressFill").style.width = "0%";

  function setLane(n) { lane = Math.max(0, Math.min(2, n)); }
  function onKey(e) {
    if (e.key === "ArrowUp") setLane(lane - 1);
    if (e.key === "ArrowDown") setLane(lane + 1);
  }
  document.addEventListener("keydown", onKey);
  const upBtn = $("btnLaneUp"), downBtn = $("btnLaneDown");
  const upHandler = () => setLane(lane - 1);
  const downHandler = () => setLane(lane + 1);
  upBtn.addEventListener("click", upHandler);
  downBtn.addEventListener("click", downHandler);

  function drawBranch(o) {
    ctx.save();
    ctx.translate(o.x, lanes[o.lane]);
    ctx.fillStyle = "#6B4A2C";
    ctx.fillRect(-45, -9, 90, 18);
    ctx.fillStyle = "#E14B4B";
    for (let i = -30; i <= 30; i += 15) {
      ctx.beginPath();
      ctx.moveTo(i, -9);
      ctx.lineTo(i + 6, -20);
      ctx.lineTo(i + 12, -9);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(i, 9);
      ctx.lineTo(i + 6, 20);
      ctx.lineTo(i + 12, 9);
      ctx.fill();
    }
    ctx.restore();
  }

  function drawPlayer(flash) {
    ctx.save();
    ctx.translate(playerX, lanes[lane]);
    ctx.globalAlpha = flash ? 0.4 : 1;
    ctx.fillStyle = "#F2A65A";
    ctx.beginPath();
    ctx.arc(0, 0, 22, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#24163F";
    ctx.beginPath(); ctx.arc(-7, -3, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(7, -3, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#4CE0B3";
    ctx.fillRect(-16, 14, 32, 8);
    ctx.restore();
  }

  function loop(ts) {
    if (!startTime) startTime = ts;
    const elapsed = ts - startTime;
    const progress = Math.min(1, elapsed / DODGE_DURATION);
    $("dodgeProgressFill").style.width = progress * 100 + "%";

    ctx.clearRect(0, 0, W, H);
    // lane guides
    ctx.strokeStyle = "rgba(255,255,255,.08)";
    lanes.forEach((y) => { ctx.beginPath(); ctx.moveTo(0, y + 26); ctx.lineTo(W, y + 26); ctx.stroke(); });

    if (elapsed - lastSpawn > spawnInterval) {
      lastSpawn = elapsed;
      obstacles.push({ x: W + 40, lane: Math.floor(Math.random() * 3), hit: false });
      spawnInterval = Math.max(650, spawnInterval - 15);
    }

    const speed = 4.2 + elapsed / 4000;
    obstacles.forEach((o) => { o.x -= speed; drawBranch(o); });
    obstacles = obstacles.filter((o) => o.x > -60);

    const flashing = ts < invulnUntil;
    obstacles.forEach((o) => {
      if (!o.hit && !flashing && o.lane === lane && Math.abs(o.x - playerX) < 34) {
        o.hit = true;
        reduceHealth(12);
        invulnUntil = ts + 700;
      }
    });

    drawPlayer(flashing);

    if (progress >= 1 && running) {
      running = false;
      cleanup();
      showScreen("screen-forest-questions");
      initForestQuestions();
      return;
    }
    if (state.health <= 0) { cleanup(); return; }
    dodgeRAF = requestAnimationFrame(loop);
  }

  function cleanup() {
    document.removeEventListener("keydown", onKey);
    upBtn.removeEventListener("click", upHandler);
    downBtn.removeEventListener("click", downHandler);
  }

  dodgeRAF = requestAnimationFrame(loop);
}

/* =========================================================
   FOREST — POWER-UP QUESTIONS
   ========================================================= */
function initForestQuestions() {
  askForestQuestion("punch");
}

function askForestQuestion(type) {
  const isKick = type === "kick";
  $("forestQTitle").textContent = isKick ? "One more — unlock your Super Kick" : "Answer to unlock your Super Punch";
  $("forestQText").textContent = QUESTIONS[type].text;
  renderMCQ($("forestQOptions"), QUESTIONS[type], (correct) => {
    if (correct) {
      state.powerups[type] = true;
      $(type === "punch" ? "chipPunch" : "chipKick").classList.add("unlocked");
    } else {
      reduceHealth(15);
    }
    if (state.health <= 0) return;
    if (type === "punch") {
      setTimeout(() => askForestQuestion("kick"), 500);
    } else {
      setTimeout(() => { showScreen("screen-forest-boss"); initBoss(); }, 700);
    }
  });
}

/* =========================================================
   FOREST — BOSS FIGHT
   ========================================================= */
const CYCLE_MS = 3000;
const WIND_MS = 800;

function initBoss() {
  state.boss.health = 100;
  updateBossUI();
  const canvas = $("bossCanvas");
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  let start = null;
  let windHandled = true;
  let lastPhase = "idle";
  let attackCooldownUntil = 0;
  let hitFlashUntil = 0;
  let blockFlashUntil = 0;
  let bossHurtUntil = 0;
  let finished = false;

  function currentPhase(cycleTime) { return cycleTime >= CYCLE_MS - WIND_MS ? "wind" : "idle"; }

  function attemptAction(kind) {
    if (finished) return;
    const now = performance.now();
    const cycleTime = (now - start) % CYCLE_MS;
    const phase = currentPhase(cycleTime);
    if (phase === "wind") {
      if (!windHandled) {
        windHandled = true;
        blockFlashUntil = now + 300;
      }
    } else {
      if (now >= attackCooldownUntil) {
        attackCooldownUntil = now + 380;
        const dmg = state.powerups[kind] ? 8 : 4;
        state.boss.health = Math.max(0, state.boss.health - dmg);
        updateBossUI();
        bossHurtUntil = now + 200;
      }
    }
  }

  function onKey(e) {
    if (e.key === "z" || e.key === "Z") attemptAction("punch");
    if (e.key === "x" || e.key === "X") attemptAction("kick");
  }
  document.addEventListener("keydown", onKey);
  const punchBtn = $("btnPunch"), kickBtn = $("btnKick");
  const punchHandler = () => attemptAction("punch");
  const kickHandler = () => attemptAction("kick");
  punchBtn.addEventListener("click", punchHandler);
  kickBtn.addEventListener("click", kickHandler);

  function drawSkeleton(cycleTime, now) {
    const phase = currentPhase(cycleTime);
    const bx = W - 220, by = H / 2 - 20;
    ctx.save();
    ctx.translate(bx, by);
    const shake = phase === "wind" ? Math.sin(now / 30) * 4 : 0;
    ctx.translate(shake, 0);
    const hurt = now < bossHurtUntil;
    ctx.fillStyle = hurt ? "#FF9E9E" : "#E9E6DA";
    // skull
    ctx.fillRect(-24, -110, 48, 44);
    ctx.fillStyle = "#150E24";
    ctx.fillRect(-14, -96, 10, 12);
    ctx.fillRect(6, -96, 10, 12);
    ctx.fillStyle = hurt ? "#FF9E9E" : "#E9E6DA";
    ctx.fillRect(-10, -70, 20, 6);
    // ribcage
    ctx.fillRect(-30, -60, 60, 70);
    ctx.fillStyle = "#150E24";
    for (let i = -50; i <= 55; i += 14) { ctx.fillRect(-26, i, 52, 5); }
    ctx.fillStyle = hurt ? "#FF9E9E" : "#E9E6DA";
    // arms
    const armAngle = phase === "wind" ? -0.9 : -0.3;
    ctx.save(); ctx.translate(-30, -50); ctx.rotate(armAngle); ctx.fillRect(-8, 0, 16, 70); ctx.restore();
    ctx.save(); ctx.translate(30, -50); ctx.rotate(-armAngle); ctx.fillRect(-8, 0, 16, 70); ctx.restore();
    // legs
    ctx.fillRect(-24, 10, 16, 70);
    ctx.fillRect(8, 10, 16, 70);
    ctx.restore();

    if (phase === "wind") {
      const windProgress = (cycleTime - (CYCLE_MS - WIND_MS)) / WIND_MS;
      ctx.save();
      ctx.strokeStyle = `rgba(180, 220, 255, ${0.7 - windProgress * 0.5})`;
      ctx.lineWidth = 3;
      for (let i = 0; i < 5; i++) {
        const r = 30 + windProgress * 260 + i * 22;
        ctx.beginPath();
        ctx.ellipse(bx - 60, by - 20, r * 0.5, r * 0.18, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }

  function drawPlayer(now) {
    const px = 170, py = H / 2 - 10;
    const hit = now < hitFlashUntil;
    const block = now < blockFlashUntil;
    ctx.save();
    ctx.translate(px, py);
    if (block) {
      ctx.strokeStyle = "#6FC7FF";
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.arc(0, -10, 46, 0, Math.PI * 2); ctx.stroke();
    }
    ctx.globalAlpha = hit ? 0.5 : 1;
    ctx.fillStyle = "#F2A65A";
    ctx.beginPath(); ctx.arc(0, -40, 24, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#24163F";
    ctx.beginPath(); ctx.arc(-8, -44, 3, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath(); ctx.arc(8, -44, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#FF6FA0";
    ctx.fillRect(-20, -16, 40, 55);
    ctx.fillStyle = "#4CE0B3";
    ctx.fillRect(-20, -16, 40, 12);
    ctx.restore();
  }

  function loop(ts) {
    if (!start) start = ts;
    const now = ts;
    const cycleTime = (now - start) % CYCLE_MS;
    const phase = currentPhase(cycleTime);

    if (phase === "wind" && lastPhase === "idle") windHandled = false;
    if (phase === "idle" && lastPhase === "wind" && !windHandled) {
      reduceHealth(15);
      hitFlashUntil = now + 300;
      windHandled = true;
    }
    lastPhase = phase;

    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "rgba(255,255,255,.03)";
    ctx.fillRect(0, H - 60, W, 60);

    drawSkeleton(cycleTime, now);
    drawPlayer(now);

    if (state.boss.health <= 0 && !finished) {
      finished = true;
      cleanup();
      setTimeout(() => {
        $("winStatsForest").innerHTML =
          `<div class="win-stat">❤️ Health left: ${state.health}%</div>` +
          `<div class="win-stat">👊 Super Punch: ${state.powerups.punch ? "Unlocked" : "Weak"}</div>` +
          `<div class="win-stat">🦵 Super Kick: ${state.powerups.kick ? "Unlocked" : "Weak"}</div>`;
        showScreen("screen-win-forest");
      }, 400);
      return;
    }
    if (state.health <= 0) { finished = true; cleanup(); return; }

    bossRAF = requestAnimationFrame(loop);
  }

  function cleanup() {
    document.removeEventListener("keydown", onKey);
    punchBtn.removeEventListener("click", punchHandler);
    kickBtn.removeEventListener("click", kickHandler);
  }

  bossRAF = requestAnimationFrame(loop);
}

/* =========================================================
   NAVIGATION WIRING
   ========================================================= */
$("btnPlayNow").addEventListener("click", () => showScreen("screen-menu"));

$("btnLevel1").addEventListener("click", () => {
  resetState();
  showScreen("screen-level-intro");
});

$("btnStartLevel1").addEventListener("click", () => {
  showScreen("screen-fork");
  initFork();
});

$("btnCandyMenu").addEventListener("click", () => showScreen("screen-menu"));
$("btnForestMenu").addEventListener("click", () => showScreen("screen-menu"));
$("btnGameoverMenu").addEventListener("click", () => showScreen("screen-menu"));

$("btnRetry").addEventListener("click", () => {
  resetState();
  showScreen("screen-level-intro");
});

/* init */
resetState();
showScreen("screen-welcome");
})();
