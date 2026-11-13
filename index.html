/* =========================================================
   shipE - Game JavaScript
   The startup simulation + shared navigation
   ========================================================= */

const YEAR_SECONDS = 120;          // time per year (players can also end a year early)
const MAX_ACTIONS_PER_YEAR = 3;    // action cards per year (personal spending is separate)
const TOTAL_YEARS = 10;

/* ---------------------------------------------------------
   ECONOMY TUNING
   Company value = (base + revenue x revenue multiple + users x value per user)
                   x reputation x market share x R&D moat x investor sentiment
   Cash is NOT part of company value.
   --------------------------------------------------------- */

const IDEA_VALUE = 400000;         // what a team + idea is worth before any traction

const PROFILES = {
    tech:    { revMultiple: 8, userValue: 1,   margin: 0.60, organic: 0.06 },   // margin = gross margin
    nontech: { revMultiple: 3, userValue: 1.5, margin: 0.50, organic: 0.08 }
};

const SENTIMENT_FADE = 0.25;       // share of investor hype that wears off each year
const CARD_FATIGUE = 0.6;          // each repeat of the same card in one year is 40% weaker
const REFERENCE_REVENUE = 10000000; // from Year 2, costs are pegged to revenue: a $10M-revenue company pays the listed prices
/* Rival strength. edge = execution bonus on growth; news = range of its yearly sentiment swing.
   Tuned with sim/run.js: thoughtful play wins ~75-90% on Normal and ~50-70% on Hard. */
const DIFFICULTY = {
    normal: { label: "Normal", edge: 1.05, news: [0.94, 1.08] },
    hard:   { label: "Hard",   edge: 1.20, news: [0.95, 1.10] }
};

function rivalSettings() {
    return DIFFICULTY[state.difficulty] || DIFFICULTY.normal;
}

function setDifficulty(level) {
    state.difficulty = DIFFICULTY[level] ? level : "normal";
    document.querySelectorAll("[data-difficulty]").forEach(btn => {
        btn.classList.toggle("selected", btn.getAttribute("data-difficulty") === state.difficulty);
    });
}

function makeCompany() {
    return {
        cash: 100000,
        revenue: 0,
        users: 0,
        marketShare: 10,
        reputation: 50,
        sentiment: 1,          // investor mood: events and funding rounds move this
        rdLevel: 0,            // accumulated R&D: raises growth and the valuation multiple
        companyValue: 0,
        costScale: 0.025,
        cardUses: {},          // uses of each card this year (diminishing returns)
        highSalaryCount: 0,
        lastMoves: []
    };
}

const state = {
    currentYear: 1,
    difficulty: "normal",    // "normal" | "hard" (kept between games)

    industry: null,          // "tech" | "nontech"
    startupType: null,       // { name, type, condition }

    // Player company (fields kept on state so events can read them directly)
    ...makeCompany(),

    computerValue: 0,
    valueAtYearStart: 0,
    rival: makeCompany(),
    costScale: 1,

    cofounder: true,
    cofounderName: "Your Cofounder",
    cofounderEquity: 50,
    cofounderStatus: "Active",
    outsideEquity: 0,        // investors + employee equity

    ipo: false,
    bankrupt: false,
    debtYears: 0,            // consecutive year-ends with negative cash
    burnMultiplier: 1,
    extraBurn: 0,

    personalTaken: 0,        // total company cash spent on yourself
    personalSpentThisYear: false,

    actionsThisYear: 0,
    lastYearActions: 0,
    yearStarted: false,
    timer: null,
    timeRemaining: YEAR_SECONDS,
    spinTimeout: null,
    toastTimeout: null,

    history: []
};


/* =========================================================
   BASIC HELPERS & NAVIGATION
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

const bgMusic = $("bgMusic");
let musicWanted = false;

function startMusic() {
    if (!bgMusic) return;

    musicWanted = true;
    bgMusic.volume = 0.6;

    const attempt = bgMusic.play();
    if (attempt && attempt.catch) {
        attempt.catch(err => {
            console.warn("[shipE] Music couldn't start:", err.name, "-", err.message);
        });
    }
}

/* If the browser blocked the first attempt, retry on the next click. */
function retryMusicIfNeeded() {
    if (musicWanted && bgMusic && bgMusic.paused && !bgMusic.muted && !bgMusic.error) {
        startMusic();
    }
}

function toggleMute() {
    if (!bgMusic) return;
    bgMusic.muted = !bgMusic.muted;

    const btn = $("btnMute");
    if (!btn) return;

    if (bgMusic.muted) {
        btn.innerHTML = "🔇 <span>Unmute</span>";
        btn.title = "Unmute music";
    } else {
        btn.innerHTML = "🔊 <span>Mute</span>";
        btn.title = "Mute music";
    }
}

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    const target = document.getElementById(screenId);
    if (target) {
        target.classList.add('active');
    }

    // The music button floats top-right; hide it on the simulator, which has its own top bar.
    const mute = $("btnMute");
    if (mute) mute.classList.toggle("in-topbar", screenId === "screen-funding-simulator");
}

function setText(id, text) {
    const element = $(id);
    if (element) {
        element.textContent = text;
    }
}

function formatMoney(value) {
    const sign = value < 0 ? "-" : "";
    const v = Math.abs(value);

    if (v >= 1000000000) return sign + "$" + (v / 1000000000).toFixed(1) + "B";
    if (v >= 1000000) return sign + "$" + (v / 1000000).toFixed(1) + "M";
    if (v >= 1000) return sign + "$" + (v / 1000).toFixed(0) + "K";
    return sign + "$" + Math.round(v);
}

function formatUsers(users) {
    if (users >= 1000000000) return (users / 1000000000).toFixed(1) + "B";
    if (users >= 1000000) return (users / 1000000).toFixed(1) + "M";
    if (users >= 1000) return (users / 1000).toFixed(0) + "K";
    return String(Math.round(users));
}

function formatPercent(value) {
    return Number(value.toFixed(1)) + "%";
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomFloat(min, max) {
    return min + Math.random() * (max - min);
}

function chance(p) {
    return Math.random() < p;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupGlobalEventListeners();
    showScreen("screen-welcome");
});

function openGame() {
    initializeGame();
    showScreen("screen-intro");
}

/* Stops every timer. Called whenever the player leaves the simulator. */
function leaveGame() {
    clearInterval(state.timer);
    state.timer = null;
    state.yearStarted = false;

    clearTimeout(state.spinTimeout);
    state.spinTimeout = null;
}


/* =========================================================
   SETUP
   ========================================================= */

const TECH_INDUSTRIES = [
    { name: "Rocket Company", type: "tech", condition: "You are building a space technology company." },
    { name: "Fintech", type: "tech", condition: "You are building a financial technology company." },
    { name: "Developer Tools", type: "tech", condition: "You are building software tools for developers." },
    { name: "Cybersecurity", type: "tech", condition: "You are building a cybersecurity company." },
    { name: "Optical Computing", type: "tech", condition: "You are developing optical computing chips." },
    { name: "Telehealth", type: "tech", condition: "You are building a digital healthcare company." }
];

const NONTECH_INDUSTRIES = [
    { name: "Construction", type: "nontech", condition: "You are building a construction company." },
    { name: "Consulting", type: "nontech", condition: "You are building a consulting company." },
    { name: "Advertising", type: "nontech", condition: "You are building an advertising company." },
    { name: "Biodegradable Plastic", type: "nontech", condition: "You are developing biodegradable plastic products." }
];

const COFOUNDER_NAMES = ["Alex", "Jordan", "Sam", "Riley", "Casey", "Morgan", "Taylor", "Jamie"];

const WHEEL_COLORS = ["#7B5CFF", "#E5B84A", "#2EC4B6", "#FF6B6B", "#4CC9F0", "#F78C6B"];

function initializeGame() {
    leaveGame();

    state.currentYear = 1;
    state.industry = null;
    state.startupType = null;

    Object.assign(state, makeCompany());
    state.rival = makeCompany();
    state.costScale = 1;

    state.cofounder = true;
    state.cofounderName = COFOUNDER_NAMES[random(0, COFOUNDER_NAMES.length - 1)];
    state.cofounderEquity = 50;
    state.cofounderStatus = "Active";
    state.outsideEquity = 0;

    state.ipo = false;
    state.bankrupt = false;
    state.debtYears = 0;
    state.burnMultiplier = 1;
    state.extraBurn = 0;

    state.personalTaken = 0;
    state.personalSpentThisYear = false;

    state.actionsThisYear = 0;
    state.lastYearActions = 0;
    state.timeRemaining = YEAR_SECONDS;
    state.history = [];

    recomputeValues();
    state.valueAtYearStart = state.companyValue;
}

function startFundingSimulator() {
    showScreen("screen-funding-type");
}

function chooseIndustry(type) {
    state.industry = type;

    const btnSpin = $("btnSpinIndustry");
    if (btnSpin) btnSpin.style.display = "";

    const resultBox = $("industrySpinnerResult");
    if (resultBox) resultBox.classList.add("hidden");

    const btnContinue = $("btnContinueAfterSpin");
    if (btnContinue) btnContinue.classList.add("hidden");

    showScreen("screen-funding-spinner");

    buildSpinnerWheel(type === "tech" ? TECH_INDUSTRIES : NONTECH_INDUSTRIES);
}

/* Draws the wheel segments + labels and resets its rotation. */
function buildSpinnerWheel(options) {
    const wheel = $("industrySpinnerWheel");
    if (!wheel) return;

    // Reset rotation without animating backwards.
    wheel.style.transition = "none";
    wheel.style.transform = "rotate(0deg)";
    void wheel.offsetWidth;

    if (getComputedStyle(wheel).position === "static") {
        wheel.style.position = "relative";
    }

    wheel.querySelectorAll(".wheel-label").forEach(el => el.remove());

    const count = options.length;
    const segment = 360 / count;

    const stops = options
        .map((_, i) => `${WHEEL_COLORS[i % WHEEL_COLORS.length]} ${i * segment}deg ${(i + 1) * segment}deg`)
        .join(", ");
    wheel.style.background = `conic-gradient(${stops})`;

    const size = wheel.offsetWidth || 280;
    const radius = size * 0.3;

    options.forEach((option, i) => {
        const angle = (i + 0.5) * segment;
        const label = document.createElement("span");
        label.className = "wheel-label";
        label.textContent = option.name;
        label.style.cssText = `
            position: absolute;
            left: 50%;
            top: 50%;
            white-space: nowrap;
            font-size: 0.62rem;
            font-weight: 800;
            color: #fff;
            text-shadow: 0 1px 3px rgba(0,0,0,0.7);
            pointer-events: none;
            transform: translate(-50%, -50%) rotate(${angle - 90}deg) translateX(${radius}px);
        `;
        wheel.appendChild(label);
    });
}

function spinIndustry() {
    const btnSpin = $("btnSpinIndustry");
    if (btnSpin) btnSpin.style.display = "none";

    const choices = state.industry === "tech" ? TECH_INDUSTRIES : NONTECH_INDUSTRIES;
    const index = random(0, choices.length - 1);
    const result = choices[index];
    state.startupType = result;

    // Land the chosen segment under the pointer (top of the wheel).
    const segment = 360 / choices.length;
    const jitter = (Math.random() - 0.5) * segment * 0.6;
    const finalRotation = 360 * 5 - ((index + 0.5) * segment + jitter);

    const wheel = $("industrySpinnerWheel");
    if (wheel) {
        wheel.style.transition = "transform 3s cubic-bezier(0.17, 0.67, 0.12, 1)";
        wheel.style.transform = `rotate(${finalRotation}deg)`;
    }

    clearTimeout(state.spinTimeout);
    state.spinTimeout = setTimeout(() => {
        setText("industryResultTitle", result.name);
        setText("industryResultDescription", result.condition);

        const resultBox = $("industrySpinnerResult");
        if (resultBox) resultBox.classList.remove("hidden");

        const btnContinue = $("btnContinueAfterSpin");
        if (btnContinue) btnContinue.classList.remove("hidden");
    }, 3200);
}

function showFoundationScreen() {
    showScreen("screen-funding-foundation");

    const result = state.startupType;
    setText(
        "foundationDialogText",
        `Congratulations! Your startup, focused on ${result ? result.name : "your business"}, has been accepted into Startup School with $100,000 in pre-seed funding.`
    );

    const founderDesc = state.industry === "tech"
        ? `${state.cofounderName} — non-technical cofounder (50% equity)`
        : `${state.cofounderName} — technical cofounder (50% equity)`;

    setText("foundationTeamDescription", founderDesc);
}

function startYearOne() {
    showScreen("screen-funding-simulator");

    state.currentYear = 1;
    state.actionsThisYear = 0;
    state.lastYearActions = 0;
    state.personalSpentThisYear = false;
    state.cardUses = {};
    state.rival.cardUses = {};

    applyYearStartConditions();
    recomputeValues();
    state.valueAtYearStart = state.companyValue;

    ensureEndYearButton();
    renderYearActions();
    updateDisplays();
    startYearTimer();
}


/* =========================================================
   YEAR TIMER & PROGRESS
   ========================================================= */

function startYearTimer() {
    clearInterval(state.timer);

    state.yearStarted = true;
    state.timeRemaining = YEAR_SECONDS;

    updateTimerDisplay();

    state.timer = setInterval(() => {
        state.timeRemaining--;
        updateTimerDisplay();

        if (state.timeRemaining <= 0) {
            advanceYear();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;

    setText("fundingTimerText", minutes + ":" + String(seconds).padStart(2, "0"));

    const fill = $("fundingTimerFill");
    if (fill) {
        fill.style.width = (state.timeRemaining / YEAR_SECONDS * 100) + "%";
    }
}

/* Adds an "End Year Early" button under the timer (the HTML doesn't have one). */
function ensureEndYearButton() {
    if ($("btnEndYear")) return;

    const timerBox = document.querySelector(".funding-year-timer");
    if (!timerBox) return;

    const btn = document.createElement("button");
    btn.id = "btnEndYear";
    btn.className = "btn btn-secondary";
    btn.textContent = "End Year Early →";
    btn.style.marginTop = "10px";
    timerBox.appendChild(btn);
}

function advanceYear() {
    // Guard against the timer and the End Year button both firing.
    if (!state.yearStarted) return;

    clearInterval(state.timer);
    state.timer = null;
    state.yearStarted = false;

    if (triggerYearEvent()) {
        return;
    }

    endCurrentYear();
}

function endCurrentYear() {
    clearInterval(state.timer);
    state.timer = null;
    state.yearStarted = false;

    rivalTakeTurn();
    applyEndOfYearEffects(state, true);
    applyEndOfYearEffects(state.rival, false);
    state.lastYearActions = state.actionsThisYear;
    clampState();

    if (state.bankrupt || state.currentYear >= TOTAL_YEARS) {
        finishGame();
        return;
    }

    state.currentYear++;
    state.actionsThisYear = 0;
    state.personalSpentThisYear = false;
    state.cardUses = {};
    state.rival.cardUses = {};

    showScreen("screen-funding-simulator");
    applyYearStartConditions();
    clampState();
    state.valueAtYearStart = state.companyValue;

    renderYearActions();
    updateDisplays();
    startYearTimer();
}


/* =========================================================
   ECONOMY HELPERS
   ========================================================= */

function profile() {
    return PROFILES[state.industry === "nontech" ? "nontech" : "tech"];
}

/* Company value from fundamentals. Cash is not included. */
function valueOf(co) {
    const p = profile();
    const base = IDEA_VALUE + co.revenue * p.revMultiple + co.users * p.userValue;
    const repFactor = 0.75 + co.reputation / 200;          // rep 0 → 0.75x, 50 → 1x, 100 → 1.25x
    const shareFactor = 1 + co.marketShare / 200;          // 10% share → 1.05x, 40% → 1.2x
    const moat = 1 + 0.05 * Math.sqrt(co.rdLevel);         // R&D raises the multiple, with diminishing returns
    return Math.max(0, base * repFactor * shareFactor * moat * co.sentiment);
}

function recomputeValues() {
    state.companyValue = valueOf(state);
    state.rival.companyValue = valueOf(state.rival);
    state.computerValue = state.rival.companyValue;
}

function clampCompany(co) {
    co.reputation = clamp(co.reputation, 0, 100);
    co.marketShare = clamp(co.marketShare, 0, 100);
    co.users = Math.max(0, co.users);
    co.revenue = Math.max(0, co.revenue);
    co.sentiment = clamp(co.sentiment, 0.05, 50);
}

function clampState() {
    clampCompany(state);
    clampCompany(state.rival);

    // You and the rival can't own more than 90% of the market between you.
    const total = state.marketShare + state.rival.marketShare;
    if (total > 90) {
        const k = 90 / total;
        state.marketShare *= k;
        state.rival.marketShare *= k;
    }

    recomputeValues();
}

function addRep(amount, co = state) {
    co.reputation = clamp(co.reputation + amount, 0, 100);
}

/* Market share is contested: half of what one company gains comes out of the other's share. */
function addShare(amount, co = state) {
    const other = co === state ? state.rival : state;
    co.marketShare = clamp(co.marketShare + amount, 0, 100);
    if (amount > 0) {
        other.marketShare = clamp(other.marketShare - amount * 0.5, 1, 100);
    }
}

/* Events and personal choices move investor sentiment, which scales the valuation multiple. */
function mulValue(multiplier, co = state) {
    co.sentiment *= multiplier;
    recomputeValues();
}

function growthBoost(co) {
    return (1 + 0.14 * Math.sqrt(co.rdLevel)) * (co === state ? 1 : rivalSettings().edge);
}

function growUsers(pctMin, pctMax, floorMin, floorMax, co = state, strength = 1) {
    const pct = randomFloat(pctMin, pctMax) / 100 * growthBoost(co);
    co.users += Math.max(random(floorMin, floorMax), co.users * pct) * strength;
}

function growRevenue(pctMin, pctMax, floorMin, floorMax, co = state, strength = 1) {
    const pct = randomFloat(pctMin, pctMax) / 100 * growthBoost(co);
    co.revenue += Math.max(random(floorMin, floorMax), co.revenue * pct) * strength;
}

/* Scales a dollar amount written for a ~$10M-revenue company to the player's current size. */
function money(amount) {
    return Math.round(amount * state.costScale / 1000) * 1000;
}

/* Bigger companies run bigger budgets. Costs follow each company's own revenue
   (what pays the bills), not its valuation. */
function costScaleFor(co) {
    return state.currentYear <= 1
        ? 0.025
        : clamp(Math.pow((co.revenue + 200000) / REFERENCE_REVENUE, 0.8), 0.03, 40);
}

function updateCostScale() {
    state.costScale = costScaleFor(state);
    state.rival.costScale = costScaleFor(state.rival);
}

/* Selling stock to investors / employees dilutes everyone already holding shares. */
function dilute(percent) {
    const keep = 1 - percent / 100;
    state.cofounderEquity *= keep;
    state.outsideEquity = state.outsideEquity * keep + percent;
}

function playerEquity() {
    return clamp(100 - state.cofounderEquity - state.outsideEquity, 0, 100);
}

/* 0.6 – 1.1: how impressed investors are with you. Drives funding rounds. */
function performanceScore() {
    const repPart = clamp(state.reputation - 50, -50, 50) / 250;
    const momentum = state.lastYearActions >= 2 ? 0.1 : (state.lastYearActions === 1 ? 0 : -0.1);
    const lead = state.companyValue >= state.rival.companyValue ? 0.05 : -0.05;
    return clamp(0.8 + repPart + momentum + lead, 0.6, 1.1);
}

function getAnnualBurn(co = state) {
    const base = state.currentYear <= 1 ? 30000 : Math.round(1500000 * (co.costScale || 1) / 1000) * 1000;
    if (co !== state) return base;
    return base * state.burnMultiplier + state.extraBurn;
}

/* A priced funding round. Investors pay a premium over today's value (the markup),
   then buy `percentSold` of the company. The math matches what the toast says:
   raise = pre-money x percent / (100 - percent). */
function fundingRound(co, markup, percentSold) {
    co.sentiment *= markup;
    recomputeValues();

    const preMoney = co.companyValue;
    const raise = Math.round(preMoney * percentSold / (100 - percentSold));
    co.cash += raise;

    if (co === state) dilute(percentSold);

    return { preMoney, raise, postMoney: preMoney + raise, percentSold };
}


/* =========================================================
   YEAR START & END CONDITIONS
   ========================================================= */

const MARKET_TAILWINDS = { 5: 1.10, 6: 1.08, 7: 1.12 };

function applyYearStartConditions() {
    recomputeValues();

    switch (state.currentYear) {
        case 1:
            state.cash = Math.max(state.cash, 100000);
            break;

        case 2: {
            // Series A — the better your Year 1, the higher the price and the less you give up.
            const perf = performanceScore();
            const markup = 1.4 + (perf - 0.6) * 2.2;                  // 1.4x – 2.5x
            const percent = Math.round(25 - (perf - 0.6) * 20);       // 25% – 15%
            const round = fundingRound(state, markup, percent);

            fundingRound(state.rival, randomFloat(1.7, 2.3), 20);

            showToast(`Series A closed: you raised ${formatMoney(round.raise)} for ${round.percentSold}% of the company. Pre-money valuation ${formatMoney(round.preMoney)}, post-money ${formatMoney(round.postMoney)}.`, 7000);
            break;
        }

        case 3:
            if (state.industry === "tech") {
                // Hypergrowth is earned: it multiplies the traction you already have.
                const perf = performanceScore();
                const surge = 1.6 + (perf - 0.6) * 2;                 // 1.6x – 2.6x
                state.users *= surge;
                state.revenue *= surge;
                addShare(4 * perf);

                const rivalSurge = randomFloat(1.8, 2.4);
                state.rival.users *= rivalSurge;
                state.rival.revenue *= rivalSurge;
                recomputeValues();

                const round = fundingRound(state, 1.15, 12);
                fundingRound(state.rival, 1.15, 12);

                showToast(`Hypergrowth! Users and revenue grew ${surge.toFixed(1)}x. Your Series B raised ${formatMoney(round.raise)} for 12%.`, 7000);
            }
            break;

        case 4:
            addRep(5);
            if (state.industry === "nontech") {
                // Non-tech companies raise a growth round later, once revenue is proven.
                const perf = performanceScore();
                const round = fundingRound(state, 1 + (perf - 0.6) * 0.8, 15);
                fundingRound(state.rival, randomFloat(1.15, 1.35), 15);
                showToast(`Growth round closed: you raised ${formatMoney(round.raise)} for 15% at a ${formatMoney(round.preMoney)} pre-money valuation.`, 7000);
            }
            break;

        case 5:
        case 6:
        case 7: {
            const tailwind = MARKET_TAILWINDS[state.currentYear];
            state.sentiment *= tailwind;
            state.rival.sentiment *= tailwind;
            showToast(`Market tailwind: valuations across the market rose ${Math.round((tailwind - 1) * 100)}%.`, 4000);
            break;
        }
    }

    recomputeValues();
    updateCostScale();
}

/* Year-end for one company: organic growth, profit, burn, and the debt check. */
function applyEndOfYearEffects(co, isPlayer) {
    if (isPlayer && state.bankrupt) return;
    const p = profile();

    // Hype fades: a quarter of any investor premium (or discount) wears off each year
    // unless real results replace it.
    co.sentiment = 1 + (co.sentiment - 1) * (1 - SENTIMENT_FADE);

    // Existing customers bring organic growth; share and reputation help.
    const organic = p.organic + co.marketShare / 400 + (co.reputation - 50) / 500;
    co.revenue *= 1 + Math.max(-0.1, organic);
    co.users *= 1 + Math.max(-0.1, organic * 0.8);

    // Gross profit on revenue minus the cost of running the company (burn).
    co.cash += co.revenue * p.margin;
    co.cash -= getAnnualBurn(co);

    if (isPlayer && state.ipo) {
        co.sentiment *= 1 + random(-3, 3) / 100;
    }

    if (!isPlayer) {
        // The rival gets its own news each year, good and bad, like your events do.
        const news = rivalSettings().news;
        co.sentiment *= randomFloat(news[0], news[1]);
        addRep(random(-2, 5), co);
        addShare(randomFloat(0, 2.5), co);
        if (state.currentYear === 3 && state.industry === "tech") addShare(8, co);   // its own press moment
        if (state.currentYear === 8) { co.sentiment *= 0.9; co.revenue *= 0.9; }   // recession
        if (state.currentYear === 9) co.sentiment *= randomFloat(0.95, 1.0);         // audit season
        if (state.currentYear === 10) { co.revenue *= randomFloat(0.78, 0.95); co.users *= 0.85; }   // final-year shock
        if (co.cash < 0) { co.sentiment *= 0.9; co.cash = 0; }                       // rival never goes bankrupt
        return;
    }

    if (co.cash < 0) {
        state.debtYears++;
        co.sentiment *= 0.85;
        addRep(-5);

        if (state.debtYears >= 2) {
            state.bankrupt = true;
        } else {
            showToast("Your cash is negative! Fix it by next year or creditors will step in.", 5000);
        }
    } else {
        state.debtYears = 0;
    }
}


/* =========================================================
   THE RIVAL
   Plays the same cards with the same costs and rules, picks
   different cards each year, and reacts to what you do.
   ========================================================= */

function rivalTakeTurn() {
    const r = state.rival;
    const year = state.currentYear;
    const actions = getActionsForYear(r);

    const weights = {
        product: 3.5,
        marketing: state.industry === "nontech" ? 3 : 2,
        expansion: 2.5,
        rd: year <= 5 ? 3.5 : 1,            // research pays off later, so the rival front-loads it
        salary: state.highSalaryCount > 0 || year === 3 ? 1 : 0.3
    };
    if (state.marketShare > r.marketShare) weights.marketing += 2;      // fight back for share
    if (state.companyValue > r.companyValue) weights.product += 1.5;    // chase the leader
    if (year >= 7) weights.expansion += 1.5;

    // Like a real startup, the rival raises a bridge round when it runs low on cash.
    if (r.cash < getAnnualBurn(r) && year > 1) fundingRound(r, 1, 10);

    const reserve = getAnnualBurn(r) * 0.5;
    const picks = [];
    for (let i = 0; i < MAX_ACTIONS_PER_YEAR; i++) {
        const options = actions.filter(a => a.id !== "self" && !picks.includes(a.id) && r.cash - a.cost >= reserve);
        if (!options.length) break;

        const total = options.reduce((s, a) => s + weights[a.id], 0);
        let roll = Math.random() * total;
        const choice = options.find(a => (roll -= weights[a.id]) <= 0) || options[0];

        picks.push(choice.id);
        r.cash -= choice.cost;
        applyCardEffects(r, choice.id);
    }

    r.lastMoves = picks;
    clampState();
}


/* =========================================================
   ACTION CARDS & EXECUTION
   ========================================================= */

const CARD_BASE_COSTS = { product: 25000, marketing: 20000, expansion: 35000, rd: 30000, salary: 20000 };

function getActionsForYear(co = state) {
    // Year 1 prices are fixed. From Year 2, prices grow with the size of the company.
    const scale = co.costScale || 1;
    const cost = id => state.currentYear <= 1
        ? CARD_BASE_COSTS[id]
        : Math.round(CARD_BASE_COSTS[id] * 40 * scale / 1000) * 1000;

    return [
        {
            id: "product",
            icon: "🛠️",
            title: "Develop Product",
            description: "Build a new feature or improve the company's core product.",
            cost: cost("product")
        },
        {
            id: "marketing",
            icon: "📣",
            title: "Invest in Marketing",
            description: "Increase brand awareness and win customers (and share) from rivals.",
            cost: cost("marketing")
        },
        {
            id: "expansion",
            icon: "🏢",
            title: "Expand Operations",
            description: "Grow into new territories or open new offices.",
            cost: cost("expansion")
        },
        {
            id: "rd",
            icon: "🔬",
            title: "Invest in R&D",
            description: "Research that makes all your future growth stronger. Pays off over years.",
            cost: cost("rd")
        },
        {
            id: "salary",
            icon: "💵",
            title: "High Salaries",
            description: "Pay your team above-market. Loyal employees are harder to poach.",
            cost: cost("salary")
        },
        {
            id: "self",
            icon: "💎",
            title: "Personal Spending",
            description: "Spend company cash on personal expenses.",
            cost: 0
        }
    ];
}

/* What each card does. Shared by you and the rival.
   Repeating a card in the same year gives diminishing returns. */
function applyCardEffects(co, id) {
    const uses = co.cardUses[id] || 0;
    const s = Math.pow(CARD_FATIGUE, uses);
    co.cardUses[id] = uses + 1;

    switch (id) {
        case "product":
            growUsers(8, 14, 10000, 50000, co, s);
            growRevenue(8, 14, 10000, 100000, co, s);
            addRep(3 * s, co);
            co.sentiment *= 1 + 0.01 * s;
            break;
        case "marketing":
            growUsers(12, 20, 25000, 150000, co, s);
            growRevenue(state.industry === "nontech" ? 8 : 4, state.industry === "nontech" ? 14 : 8, 10000, 60000, co, s);   // new customers pay
            addShare(randomFloat(1, 4) * s, co);
            break;
        case "expansion":
            addShare(randomFloat(1, 3) * s, co);
            growRevenue(10, 18, 25000, 200000, co, s);
            break;
        case "rd":
            co.rdLevel += s;
            addRep(3 * s, co);
            growUsers(2, 4, 5000, 30000, co, s);
            break;
        case "salary":
            addRep(-3, co);
            co.sentiment *= 0.99;
            co.highSalaryCount++;
            break;
    }
    return s;
}

function setCardDisabled(element, disabled, reason) {
    element.disabled = disabled;
    if (disabled) {
        element.style.opacity = "0.45";
        element.style.cursor = "not-allowed";
        if (reason) element.title = reason;
    }
}

function renderYearActions() {
    const container = $("fundingDecisionCards");
    if (!container) return;

    container.innerHTML = "";
    const actions = getActionsForYear();
    const actionsLeft = MAX_ACTIONS_PER_YEAR - state.actionsThisYear;

    actions.forEach(action => {
        if (action.id === "self") {
            const card = document.createElement("div");
            card.className = "funding-decision-card personal-spending-card";
            card.innerHTML = `
                <div class="funding-card-icon">💎</div>
                <h3>Spend Investor Money on Yourself</h3>
                <p>Take money from the company for personal spending.</p>
                <div class="personal-spending-options">
                    <button class="personal-spend-btn" data-spend="10">10%</button>
                    <button class="personal-spend-btn" data-spend="50">50%</button>
                    <button class="personal-spend-btn danger-choice" data-spend="100">100%</button>
                </div>
            `;

            const blocked = state.cash <= 0 || state.personalSpentThisYear;
            const reason = state.personalSpentThisYear
                ? "You already did this once this year."
                : "The company has no cash to take.";

            card.querySelectorAll(".personal-spend-btn").forEach(btn => {
                if (blocked) setCardDisabled(btn, true, reason);

                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const percent = parseInt(btn.getAttribute("data-spend"), 10);
                    executePersonalSpending(percent);
                });
            });

            container.appendChild(card);
        } else {
            const uses = state.cardUses[action.id] || 0;
            const fatigueNote = uses > 0
                ? `<p class="card-fatigue">Used ${uses}× this year: ${Math.round(Math.pow(CARD_FATIGUE, uses) * 100)}% effect</p>`
                : "";

            const btn = document.createElement("button");
            btn.className = "funding-decision-card";
            btn.innerHTML = `
                <div class="funding-card-icon">${action.icon}</div>
                <h3>${action.title}</h3>
                <p>${action.description}</p>
                ${fatigueNote}
                <div class="funding-card-footer">
                    <span>Cost</span>
                    <strong>${formatMoney(action.cost)}</strong>
                </div>
            `;

            if (actionsLeft <= 0) {
                setCardDisabled(btn, true, "No actions left this year.");
            } else if (state.cash < action.cost) {
                setCardDisabled(btn, true, "Not enough cash.");
            }

            btn.addEventListener("click", () => executeAction(action));
            container.appendChild(btn);
        }
    });

    updateDecisionHeader();
}

function updateDecisionHeader() {
    const subtitle = document.querySelector("#fundingDecisionHeader p");
    if (!subtitle) return;

    const left = MAX_ACTIONS_PER_YEAR - state.actionsThisYear;
    subtitle.textContent = `Actions left this year: ${left} of ${MAX_ACTIONS_PER_YEAR}. Repeating a card in the same year gives diminishing returns.`;
}

const ACTION_TOASTS = {
    product: "Product development paid off. Users and revenue grew.",
    marketing: "Marketing brought in new customers and took share from the rival.",
    expansion: "Your company expanded its operations. Revenue and share grew.",
    rd: "R&D added to your long-term advantage. All future growth gets stronger.",
    salary: "High salaries paid out. Your team is loyal, but investors noticed."
};

function executeAction(action) {
    if (state.bankrupt || !state.yearStarted) return;

    if (state.actionsThisYear >= MAX_ACTIONS_PER_YEAR) {
        showToast("No actions left this year. End the year when you're ready.");
        return;
    }

    if (state.cash < action.cost) {
        showToast("You can't afford that right now.");
        return;
    }

    state.actionsThisYear++;
    state.cash -= action.cost;

    const before = state.companyValue;
    const strength = applyCardEffects(state, action.id);
    clampState();

    const delta = state.companyValue - before;
    const weak = strength < 1 ? ` (repeat: ${Math.round(strength * 100)}% effect)` : "";
    showToast(`${ACTION_TOASTS[action.id]} Value ${delta >= 0 ? "+" : ""}${formatMoney(delta)}${weak}.`);

    renderYearActions();
    updateDisplays();
}

function executePersonalSpending(percentage) {
    if (state.bankrupt || !state.yearStarted) return;

    if (state.cash <= 0) {
        showToast("There's no cash left to take.");
        return;
    }

    if (state.personalSpentThisYear) {
        showToast("You already took money this year.");
        return;
    }

    const spending = state.cash * (percentage / 100);
    state.cash -= spending;
    state.personalTaken += spending;
    state.personalSpentThisYear = true;

    addRep(-percentage / 5);
    state.sentiment *= 1 - (percentage / 500);

    showToast(`You spent ${formatMoney(spending)} of the company's cash on yourself.`);
    clampState();
    renderYearActions();
    updateDisplays();
}

/* =========================================================
   EVENTS SYSTEM
   Every year has an event. Each event is { title, text, choices[] }
   and each choice is { label, hint, apply() -> outcome text }.
   ========================================================= */

function triggerYearEvent() {
    const event = buildYearEvent(state.currentYear);
    if (!event) return false;

    showEventScreen(
        event.title,
        event.text,
        event.choices.map(choice => ({
            label: choice.label,
            hint: choice.hint,
            action: () => resolveEventChoice(event, choice)
        }))
    );

    return true;
}

function resolveEventChoice(event, choice) {
    const outcome = choice.apply();

    state.history.push({
        year: state.currentYear,
        event: event.title,
        choice: choice.label
    });

    clampState();

    if (outcome) {
        showEventScreen("OUTCOME", outcome, [
            { label: "Continue →", action: endCurrentYear }
        ]);
    } else {
        endCurrentYear();
    }
}

function showEventScreen(title, text, choices) {
    showScreen("screen-funding-event");

    setText("majorEventEyebrow", "YEAR " + state.currentYear);
    setText("majorEventTitle", title);
    setText("majorEventSpeaker", "NARRATOR");
    setText("majorEventText", text);

    const container = $("majorEventChoices");
    if (!container) return;

    container.innerHTML = "";

    choices.forEach(choice => {
        const btn = document.createElement("button");
        btn.className = "btn btn-primary";
        btn.textContent = choice.label;

        if (choice.hint) {
            const hint = document.createElement("small");
            hint.textContent = choice.hint;
            hint.style.cssText = "display:block; margin-top:4px; font-size:0.75rem; font-weight:600; opacity:0.85;";
            btn.appendChild(hint);
        }

        btn.addEventListener("click", () => {
            // Prevent double-clicks from applying a choice twice.
            container.querySelectorAll("button").forEach(b => { b.disabled = true; });
            choice.action();
        });

        container.appendChild(btn);
    });
}

function buildYearEvent(year) {
    switch (year) {
        case 1: return eventDemoDay();
        case 2: return eventCofounder();
        case 3: return eventYear3();
        case 4: return eventTalentWar();
        case 5: return eventIndustry();
        case 6: return eventStrategicOffer();
        case 7: return eventIPO();
        case 8: return eventRecession();
        case 9: return eventAudit();
        case 10: return eventFinalYear();
    }
    return null;
}

/* ---------- Year 1: Demo Day ---------- */

function eventDemoDay() {
    const name = state.startupType ? state.startupType.name : "startup";

    return {
        title: "DEMO DAY",
        text: `Startup School Demo Day is here. Investors, journalists and rival founders fill the room. How do you pitch your ${name} company?`,
        choices: [
            {
                label: "Pitch the big vision",
                hint: "Risky: could wow the room or backfire",
                apply: () => {
                    if (chance(0.55)) {
                        mulValue(1.25);
                        addRep(5);
                        addShare(2);
                        state.users += random(5000, 25000);
                        return "The room loved it. Investors are already asking for follow-up meetings.";
                    }
                    mulValue(0.93);
                    addRep(-3);
                    return "You overpromised and a sharp investor called you out. Word travels fast.";
                }
            },
            {
                label: "Show real traction",
                hint: "Steady and credible",
                apply: () => {
                    mulValue(1.08);
                    addRep(2);
                    return "A calm, numbers-first pitch earned quiet respect.";
                }
            },
            {
                label: "Skip it and keep building",
                hint: "Heads-down time",
                apply: () => {
                    state.revenue += random(5000, 20000);
                    state.users += random(2000, 8000);
                    return "You skipped the networking and shipped instead. Early customers appreciated it.";
                }
            }
        ]
    };
}

/* ---------- Year 2: The Lamborghini (redesigned cofounder buyout) ---------- */

function cofounderBuyoutPrice() {
    // Bad-leaver deal: they forfeit unvested shares, so you pay a small slice of their stake's value.
    const stakeValue = state.companyValue * (state.cofounderEquity / 100);
    return Math.round(Math.max(0, Math.min(state.cash * 0.15, stakeValue * 0.03)));
}

function eventCofounder() {
    if (!state.cofounder) return null;

    const price = cofounderBuyoutPrice();

    return {
        title: "SURPRISE!",
        text: `${state.cofounderName} used the company debit card to buy a Lamborghini ($250,000). How do you handle it?`,
        choices: [
            {
                label: "Keep Cofounder",
                hint: "Swallow the $250K loss. Equity stays as is.",
                apply: () => {
                    state.cash -= 250000;
                    addRep(-2);
                    state.cofounderStatus = "Active";
                    return `You absorbed the $250K loss. ${state.cofounderName} promises it will never happen again.`;
                }
            },
            {
                label: "Renegotiate Terms",
                hint: "Car goes back, $50K legal fees, their equity drops 30%.",
                apply: () => {
                    state.cash += 150000 - 50000;
                    state.cofounderEquity *= 0.7;
                    addRep(1);
                    state.cofounderStatus = "On Probation";
                    return `The Lamborghini goes back (you recoup $150K) and ${state.cofounderName}'s equity is cut to ${formatPercent(state.cofounderEquity)}. They stay, on a short leash.`;
                }
            },
            {
                label: "Buy Them Out",
                hint: `Pay about ${formatMoney(price)}. You take their shares.`,
                apply: () => {
                    const finalPrice = cofounderBuyoutPrice();
                    state.cash -= finalPrice;
                    state.cash += 150000;
                    state.cofounder = false;
                    state.cofounderEquity = 0;
                    state.cofounderStatus = "Bought Out";
                    addRep(3);
                    mulValue(0.97);
                    return `${state.cofounderName} forfeits unvested shares and leaves. You pay ${formatMoney(finalPrice)}, sell the car for $150K, and now own their stake. The transition costs you a little momentum.`;
                }
            }
        ]
    };
}

/* ---------- Year 3: Good news ---------- */

function eventYear3() {
    if (state.industry === "tech") {
        return {
            title: "GOOD NEWS!",
            text: "Tech Magazine just called you a \"new disruptive startup\" on its cover. Free attention is pouring in.",
            choices: [
                {
                    label: "Launch a hype campaign",
                    hint: `Spend ${formatMoney(money(2000000))} to ride the wave`,
                    apply: () => {
                        state.cash -= money(2000000);
                        addShare(18);
                        mulValue(1.2);
                        growUsers(5, 10, money(100000), money(500000));
                        return "Your campaign went viral. Sign-ups are through the roof.";
                    }
                },
                {
                    label: "Stay focused on product",
                    hint: "Take the free boost, spend nothing",
                    apply: () => {
                        addShare(14.5);
                        mulValue(1.15);
                        return "The cover story did the marketing for free.";
                    }
                }
            ]
        };
    }

    return {
        title: "GOOD NEWS!",
        text: "A government small-business program has picked your company for funding. Which package do you take?",
        choices: [
            {
                label: `Grant + ${formatMoney(money(6000000))} loan`,
                hint: `${formatMoney(money(10000000))} now, ${formatMoney(money(500000))}/year in repayments`,
                apply: () => {
                    state.cash += money(10000000);
                    state.extraBurn += money(500000);
                    mulValue(1.1);
                    return `You pocketed ${formatMoney(money(10000000))}. The loan payments will weigh on your budget for years.`;
                }
            },
            {
                label: "Grant only",
                hint: `${formatMoney(money(4000000))}, no debt`,
                apply: () => {
                    state.cash += money(4000000);
                    mulValue(1.1);
                    addRep(2);
                    return "No strings, no debt. Investors like the discipline.";
                }
            }
        ]
    };
}

/* ---------- Year 4: Talent war ---------- */

function eventTalentWar() {
    if (state.highSalaryCount > 0) {
        return {
            title: "LOYAL TEAM",
            text: "A giant rival tried to poach your lead engineer, but your above-market pay made the offer unattractive. The whole team heard about it.",
            choices: [
                {
                    label: "Continue →",
                    apply: () => {
                        addRep(2);
                        mulValue(1.02);
                        return "Your team's loyalty is paying off. Morale is sky-high.";
                    }
                }
            ]
        };
    }

    return {
        title: "TALENT WAR",
        text: "A giant rival is trying to poach your lead engineer with a huge offer. If she goes, others may follow.",
        choices: [
            {
                label: "Make a counter-offer",
                hint: `Costs ${formatMoney(money(1500000))}`,
                apply: () => {
                    state.cash -= money(1500000);
                    mulValue(1.02);
                    addRep(1);
                    return "She stays, and she brings a few friends with her.";
                }
            },
            {
                label: "Offer equity",
                hint: "Give up 3% of the company",
                apply: () => {
                    dilute(3);
                    addRep(3);
                    mulValue(1.03);
                    return "A slice of the company keeps the team motivated, at the price of some of your ownership.";
                }
            },
            {
                label: "Let her go",
                hint: "Save money, risk the fallout",
                apply: () => {
                    mulValue(0.95);
                    state.users *= 0.95;
                    addRep(-2);
                    return "Her departure slowed development, and two more engineers followed.";
                }
            }
        ]
    };
}

/* ---------- Year 5: Industry curveball ---------- */

function eventIndustry() {
    const name = state.startupType ? state.startupType.name : "";

    switch (name) {
        case "Rocket Company":
            return {
                title: "LAUNCH DAY",
                text: "Your first orbital test rocket sits on the pad. Your engineers are split: launch now, or run another round of checks?",
                choices: [
                    {
                        label: "Launch now",
                        hint: "High risk, high reward",
                        apply: () => {
                            if (chance(0.5)) {
                                mulValue(1.35); addRep(8); addShare(3);
                                return "Clean orbit! The headlines write themselves.";
                            }
                            mulValue(0.8); state.cash -= money(3000000); addRep(-6);
                            return "The rocket broke apart 40 seconds after liftoff. Cleanup and insurance cost you dearly.";
                        }
                    },
                    {
                        label: "Run more tests",
                        hint: `Costs ${formatMoney(money(1500000))}, safer`,
                        apply: () => {
                            state.cash -= money(1500000);
                            if (chance(0.85)) {
                                mulValue(1.12); addRep(3);
                                return "The extra checks caught a fuel valve issue. The next launch is flawless.";
                            }
                            return "The tests found nothing major, but the delay cost you a launch window.";
                        }
                    }
                ]
            };

        case "Fintech":
            return {
                title: "REGULATORS CALLING",
                text: "A federal regulator is asking tough questions about your compliance program.",
                choices: [
                    {
                        label: "Hire a compliance team",
                        hint: `Costs ${formatMoney(money(2000000))}`,
                        apply: () => {
                            state.cash -= money(2000000); addRep(4); mulValue(1.03);
                            return "You're now on the regulators' good side, and customers trust you more.";
                        }
                    },
                    {
                        label: "Argue you're exempt",
                        hint: "40% chance it works",
                        apply: () => {
                            if (chance(0.4)) {
                                mulValue(1.1);
                                return "The regulator agrees you're exempt. You just saved millions.";
                            }
                            state.cash -= money(4000000); addRep(-6); mulValue(0.92);
                            return `The regulator disagreed, and fined you ${formatMoney(money(4000000))}.`;
                        }
                    },
                    {
                        label: "Ignore it",
                        hint: "Cheap now, risky later",
                        apply: () => {
                            addRep(-3);
                            if (chance(0.4)) {
                                mulValue(0.85);
                                return "Ignoring the regulator backfired: an enforcement action rattled investors.";
                            }
                            mulValue(0.97);
                            return "Nothing happened this year, but the regulator hasn't forgotten.";
                        }
                    }
                ]
            };

        case "Developer Tools":
            return {
                title: "OPEN SOURCE QUESTION",
                text: "Developers keep asking you to open-source your core library.",
                choices: [
                    {
                        label: "Open-source it",
                        hint: "Huge community, less paid revenue",
                        apply: () => {
                            state.users *= 1.25; addRep(6); addShare(3); state.revenue *= 0.9;
                            return "The community exploded, though some paying customers switched to the free version.";
                        }
                    },
                    {
                        label: "Keep it proprietary",
                        hint: "Protect revenue",
                        apply: () => {
                            state.revenue *= 1.08; addRep(-1);
                            return "Revenue held steady, but developers grumbled on social media.";
                        }
                    },
                    {
                        label: "Open-core model",
                        hint: `Costs ${formatMoney(money(1000000))} for a community team`,
                        apply: () => {
                            state.cash -= money(1000000); state.users *= 1.1; state.revenue *= 1.03; addRep(3);
                            return "Free basics, paid extras. A balanced strategy that kept everybody happy.";
                        }
                    }
                ]
            };

        case "Cybersecurity":
            return {
                title: "ZERO-DAY",
                text: "A critical vulnerability is found in widely used software. Your tools can detect it.",
                choices: [
                    {
                        label: "Release a free scanner",
                        hint: `Costs ${formatMoney(money(1000000))}, big goodwill`,
                        apply: () => {
                            state.cash -= money(1000000); addRep(7); state.users *= 1.15;
                            return "Your free scanner protected thousands of companies. You became the trusted name.";
                        }
                    },
                    {
                        label: "Sell an emergency package",
                        hint: "Quick cash, bad optics",
                        apply: () => {
                            state.cash += money(2000000); state.revenue *= 1.15; addRep(-2);
                            return "Sales spiked, but critics accused you of profiteering.";
                        }
                    }
                ]
            };

        case "Optical Computing":
            return {
                title: "CHIP BREAKTHROUGH",
                text: "Your lab hit a promising result: light-based chips that run 100x faster in tests.",
                choices: [
                    {
                        label: "Rush to manufacture",
                        hint: "50% chance to pay off",
                        apply: () => {
                            if (chance(0.5)) {
                                mulValue(1.4); addRep(5);
                                return "Production worked. Every chipmaker wants a meeting.";
                            }
                            mulValue(0.85); state.cash -= money(3000000); addRep(-5);
                            return "The first batch had serious defects. Recalls are expensive.";
                        }
                    },
                    {
                        label: "Publish and patent",
                        hint: `Costs ${formatMoney(money(500000))}`,
                        apply: () => {
                            state.cash -= money(500000); mulValue(1.1); addRep(4);
                            return "Your patents give you a strong moat and academic credibility.";
                        }
                    },
                    {
                        label: "License it to a chipmaker",
                        hint: `Get ${formatMoney(money(6000000))} now`,
                        apply: () => {
                            state.cash += money(6000000);
                            return `A big chipmaker paid ${formatMoney(money(6000000))} up front for the license.`;
                        }
                    }
                ]
            };

        case "Telehealth":
            return {
                title: "PRIVACY LAW",
                text: "New patient-data privacy rules take effect. Compliance is mandatory, but how far do you go?",
                choices: [
                    {
                        label: "Overhaul security",
                        hint: `Costs ${formatMoney(money(2000000))}`,
                        apply: () => {
                            state.cash -= money(2000000); addRep(5); mulValue(1.04);
                            return "Your security upgrade makes you the safest option in the market.";
                        }
                    },
                    {
                        label: "Minimal compliance",
                        hint: "Cheap, 25% chance of a breach",
                        apply: () => {
                            state.cash -= money(300000);
                            if (chance(0.75)) {
                                mulValue(1.01);
                                return "You squeaked by this year without any problems.";
                            }
                            mulValue(0.82); addRep(-10);
                            return "A data breach exposed patient records. Trust took a major hit.";
                        }
                    },
                    {
                        label: "Partner with a hospital system",
                        hint: "Shared compliance, new patients",
                        apply: () => {
                            addShare(4); state.users *= 1.15; state.revenue *= 1.05; addRep(2);
                            return "The hospital handles compliance, and sends you thousands of patients.";
                        }
                    }
                ]
            };

        case "Construction":
            return {
                title: "STEEL PRICES SPIKE",
                text: "Steel prices jumped 30% mid-project, and your contracts are fixed-price.",
                choices: [
                    {
                        label: "Absorb the cost",
                        hint: `Costs ${formatMoney(money(2500000))}`,
                        apply: () => {
                            state.cash -= money(2500000); addRep(2);
                            return "You ate the loss and kept every client happy.";
                        }
                    },
                    {
                        label: "Renegotiate contracts",
                        hint: "60% chance clients agree",
                        apply: () => {
                            if (chance(0.6)) {
                                return "Clients understood and agreed to adjust prices.";
                            }
                            state.revenue *= 0.85; addShare(-2);
                            return "Some clients walked away from the deal.";
                        }
                    },
                    {
                        label: "Switch suppliers",
                        hint: `Costs ${formatMoney(money(1000000))}, causes delays`,
                        apply: () => {
                            state.cash -= money(1000000); mulValue(1.02); addRep(-1);
                            return "A cheaper supplier saved the margin, though deliveries ran late.";
                        }
                    }
                ]
            };

        case "Consulting":
            return {
                title: "WHALE CLIENT",
                text: "A Fortune 500 company wants you exclusively. It's a huge contract, but you couldn't work for their competitors.",
                choices: [
                    {
                        label: "Sign the exclusive deal",
                        hint: "Big revenue, less diversification",
                        apply: () => {
                            state.revenue *= 1.3; mulValue(1.12); addShare(-1);
                            return "Revenue jumped, but you're now very dependent on one client.";
                        }
                    },
                    {
                        label: "Decline",
                        hint: "Stay independent",
                        apply: () => {
                            addRep(2); mulValue(1.02);
                            return "Other clients respected your independence.";
                        }
                    },
                    {
                        label: "Counter with non-exclusive",
                        hint: "Lower rate, more freedom",
                        apply: () => {
                            state.revenue *= 1.12; mulValue(1.06);
                            return "They agreed to a smaller, non-exclusive contract. A fair compromise.";
                        }
                    }
                ]
            };

        case "Advertising":
            return {
                title: "PLATFORM POLICY CHANGE",
                text: "The biggest ad platform just banned tracking and cut off your targeting data.",
                choices: [
                    {
                        label: "Pivot to first-party data",
                        hint: `Costs ${formatMoney(money(2000000))}`,
                        apply: () => {
                            state.cash -= money(2000000); mulValue(1.08); addRep(3);
                            return "Owning your audience data turned a crisis into an advantage.";
                        }
                    },
                    {
                        label: "Switch to contextual ads",
                        hint: `Costs ${formatMoney(money(500000))}`,
                        apply: () => {
                            state.cash -= money(500000); mulValue(1.02);
                            return "Contextual targeting works well enough. Business continues.";
                        }
                    },
                    {
                        label: "Fight the platform",
                        hint: "30% chance to win",
                        apply: () => {
                            if (chance(0.3)) {
                                mulValue(1.2);
                                return "The platform backed down after advertisers revolted. You led the charge.";
                            }
                            mulValue(0.88); addRep(-2);
                            return "The platform didn't budge, and you wasted a quarter on the fight.";
                        }
                    }
                ]
            };

        case "Biodegradable Plastic":
            return {
                title: "PLASTIC BAN",
                text: "A large state banned single-use plastics. Demand is surging, and so are competitors.",
                choices: [
                    {
                        label: "Scale production fast",
                        hint: `Costs ${formatMoney(money(4000000))}`,
                        apply: () => {
                            state.cash -= money(4000000); state.revenue *= 1.25; mulValue(1.12); addShare(4);
                            return "Your factories can't keep up with demand. A good problem to have.";
                        }
                    },
                    {
                        label: "Lock in supply contracts",
                        hint: `Costs ${formatMoney(money(1500000))}`,
                        apply: () => {
                            state.cash -= money(1500000); state.revenue *= 1.1; mulValue(1.05); addRep(2);
                            return "Long-term contracts gave you steady, reliable growth.";
                        }
                    },
                    {
                        label: "Lobby for stricter standards",
                        hint: "50% chance it pays off",
                        apply: () => {
                            if (chance(0.5)) {
                                mulValue(1.18); addRep(3);
                                return "Stricter rules pushed out your lower-quality competitors.";
                            }
                            state.cash -= money(1000000); addRep(-2);
                            return `The lobbying went nowhere and cost you ${formatMoney(money(1000000))}.`;
                        }
                    }
                ]
            };
    }

    // Fallback if no industry was chosen.
    return {
        title: "MARKET SHIFT",
        text: "Your industry is changing fast. How do you respond?",
        choices: [
            {
                label: "Adapt quickly",
                hint: `Costs ${formatMoney(money(1000000))}`,
                apply: () => {
                    state.cash -= money(1000000); mulValue(1.06);
                    return "You stayed ahead of the change.";
                }
            },
            {
                label: "Stay the course",
                apply: () => {
                    mulValue(1.01);
                    return "Business as usual.";
                }
            }
        ]
    };
}

/* ---------- Year 6: Strategic offer ---------- */

function eventStrategicOffer() {
    const offer = state.companyValue * 1.3;

    return {
        title: "ACQUISITION OFFER",
        text: `A large competitor offers to acquire your company for ${formatMoney(offer)}. How do you respond?`,
        choices: [
            {
                label: "Decline",
                hint: "Stay independent",
                apply: () => {
                    addRep(2);
                    mulValue(1.04);
                    return "Turning down the offer signaled confidence. Investors were impressed.";
                }
            },
            {
                label: "Take a strategic investment",
                hint: "They buy 6% and give you cash",
                apply: () => {
                    const cashIn = state.companyValue * 6 / 94;   // 6% of the post-investment company
                    state.cash += cashIn;
                    dilute(6);
                    addRep(1);
                    return `The competitor bought 6% for ${formatMoney(cashIn)}. You keep control and gain a powerful partner.`;
                }
            },
            {
                label: "Leak the offer to the press",
                hint: "50% chance it boosts your value",
                apply: () => {
                    if (chance(0.5)) {
                        mulValue(1.15);
                        addRep(3);
                        return "The press went wild. Other suitors are calling.";
                    }
                    mulValue(0.96);
                    addRep(-4);
                    return "Reporters thought it looked like a publicity stunt, and the competitor is furious.";
                }
            }
        ]
    };
}

/* ---------- Year 7: IPO window ---------- */

function eventIPO() {
    const raise = state.companyValue * 12 / 88;   // selling 12% of the post-IPO company

    return {
        title: "IPO WINDOW",
        text: `Markets are hot. Bankers say you could go public and raise about ${formatMoney(raise)}. Going public brings cash and prestige, but also scrutiny and volatility.`,
        choices: [
            {
                label: "Go public",
                hint: "Raise cash, sell 12%, face scrutiny",
                apply: () => {
                    const cashIn = state.companyValue * 12 / 88;
                    state.cash += cashIn;
                    dilute(12);
                    state.ipo = true;
                    addRep(3);
                    mulValue(1.05);
                    return `You rang the opening bell and raised ${formatMoney(cashIn)}. From now on, Wall Street watches every move.`;
                }
            },
            {
                label: "Stay private",
                hint: "Keep control and flexibility",
                apply: () => {
                    state.ipo = false;
                    addRep(1);
                    mulValue(1.02);
                    return "You stayed private. No quarterly pressure, no public scrutiny.";
                }
            }
        ]
    };
}

/* ---------- Year 8: Recession ---------- */

function eventRecession() {
    const pub = state.ipo ? 0.95 : 1;

    return {
        title: "RECESSION",
        text: "The economy entered a recession. Capital is tight and customers are cutting back." +
            (state.ipo ? " As a public company, your share price takes an extra hit." : ""),
        choices: [
            {
                label: "Cut costs hard",
                hint: "Lower burn for the rest of the game, reputation takes a hit",
                apply: () => {
                    mulValue(0.92 * pub);
                    state.revenue *= 0.88;
                    state.burnMultiplier = 0.6;
                    addRep(-4);
                    return "Layoffs hurt morale, but your burn rate is much lower now.";
                }
            },
            {
                label: "Invest through the downturn",
                hint: "Spend 15% of cash, gain market share",
                apply: () => {
                    const cost = Math.max(0, state.cash * 0.15);
                    state.cash -= cost;
                    mulValue(0.9 * pub);
                    addShare(3);
                    state.users *= 1.05;
                    addRep(2);
                    return `You spent ${formatMoney(cost)} while competitors retreated. You'll come out stronger.`;
                }
            },
            {
                label: "Hold steady",
                hint: "Ride it out",
                apply: () => {
                    mulValue(0.93 * pub);
                    state.revenue *= 0.85;
                    state.marketShare *= 0.95;
                    return "You waited out the storm, and took the full hit.";
                }
            }
        ]
    };
}

/* ---------- Year 9: Audit ---------- */

function eventAudit() {
    const hasPersonal = state.personalTaken > 0;
    const fine = Math.round(money(random(500000, 5000000)) * (state.ipo ? 1.5 : 1));

    const settlePersonal = () => {
        if (!hasPersonal) return "";
        const penalty = Math.round(state.personalTaken * 1.5);
        state.cash -= penalty;
        addRep(-8);
        mulValue(0.92);
        return ` Auditors also clawed back ${formatMoney(penalty)} for the personal spending.`;
    };

    const text = "The IRS selected your company for an audit." +
        (hasPersonal
            ? ` Auditors are asking pointed questions about ${formatMoney(state.personalTaken)} that left the company for personal spending.`
            : " Your books are clean, but the process still costs time and money.") +
        (state.ipo ? " As a public company, the SEC is watching too." : "");

    return {
        title: "IRS AUDIT",
        text,
        choices: [
            {
                label: "Cooperate fully",
                hint: `Pay about ${formatMoney(fine)}`,
                apply: () => {
                    state.cash -= fine;
                    addRep(-2);
                    mulValue(0.97);
                    return `You paid ${formatMoney(fine)} and passed the audit.` + settlePersonal();
                }
            },
            {
                label: "Hire elite tax lawyers",
                hint: `Costs ${formatMoney(money(1500000))}, 60% chance to cut the fine by 70%`,
                apply: () => {
                    state.cash -= money(1500000);
                    if (chance(0.6)) {
                        const reduced = Math.round(fine * 0.3);
                        state.cash -= reduced;
                        mulValue(0.99);
                        return `Your lawyers cut the fine to ${formatMoney(reduced)}.` + settlePersonal();
                    }
                    state.cash -= fine;
                    addRep(-2);
                    mulValue(0.96);
                    return `The lawyers couldn't help, and you still owe ${formatMoney(fine)}.` + settlePersonal();
                }
            },
            {
                label: "Contest it",
                hint: "35% chance of no fine, otherwise 1.5x",
                apply: () => {
                    if (chance(0.35)) {
                        return "You won the dispute. No fine!" + settlePersonal();
                    }
                    const bigFine = Math.round(fine * 1.5);
                    state.cash -= bigFine;
                    addRep(-5);
                    mulValue(0.94);
                    return `You lost the dispute and paid ${formatMoney(bigFine)}.` + settlePersonal();
                }
            }
        ]
    };
}

/* ---------- Year 10: Final year ---------- */

function eventFinalYear() {
    const text = state.industry === "tech"
        ? "Customers are leaving. Your technology company reaches its final stretch."
        : "Profitability plummeted in this final year.";

    return {
        title: "FINAL YEAR CHALLENGE",
        text: text + " How do you finish?",
        choices: [
            {
                label: "Brace for impact",
                hint: "The full hit, no extra spending",
                apply: () => {
                    // Lower revenue and users already lower the valuation, so there's no extra multiplier.
                    state.users *= 0.8;
                    state.revenue *= 0.8;
                    state.marketShare *= 0.85;
                    return "You held the line and took the full blow.";
                }
            },
            {
                label: "Double down on growth",
                hint: "Spend 10% of cash. 50/50 gamble",
                apply: () => {
                    state.cash -= Math.max(0, state.cash * 0.1);
                    if (chance(0.5)) {
                        state.users *= 0.95;
                        state.revenue *= 0.97;
                        return "The gamble worked: your final push kept customers on board.";
                    }
                    state.users *= 0.7;
                    state.revenue *= 0.7;
                    mulValue(0.9);
                    return "The gamble failed. You spent big and customers left anyway.";
                }
            },
            {
                label: "Pivot to a new market",
                hint: "Spend 8% of cash, reputation dips",
                apply: () => {
                    state.cash -= Math.max(0, state.cash * 0.08);
                    state.users *= 0.9;
                    state.revenue *= 0.88;
                    state.marketShare *= 0.9;
                    addRep(-3);
                    return "A last-minute pivot opened a new market, and softened the blow.";
                }
            }
        ]
    };
}


/* =========================================================
   DISPLAY UPDATES
   ========================================================= */

const YEAR_LESSONS = [
    { title: "Pre-seed funding", text: "Pre-seed funding is capital provided at the earliest stage of a startup. It is generally used to develop the idea, build an initial product, assemble a team, and test whether customers actually want it." },
    { title: "Series A", text: "A Series A is the first major venture round. Investors give larger sums at a set valuation in exchange for equity, which dilutes the ownership of founders." },
    { title: "Growth and market share", text: "Growing companies spend to capture market share. Press, grants, and early traction change how investors value you." },
    { title: "Keeping your team", text: "Employees are often a startup's biggest cost and biggest asset. Pay, equity, and culture all affect whether people stay." },
    { title: "Industry risk", text: "Every industry has its own regulations, supply chains, and technology risks that can reshape a business quickly." },
    { title: "Strategic investors", text: "A strategic investor is a company that invests for business reasons, not only for financial returns. Acquisition offers also show how the market values you." },
    { title: "Going public (IPO)", text: "An IPO sells shares to the public. It raises cash and prestige, but adds disclosure rules and constant pressure from the market." },
    { title: "Recessions", text: "Recessions reduce spending and tighten capital. Companies with cash reserves and lower burn rates survive best." },
    { title: "Audits and compliance", text: "Company records must be accurate. Mixing company money with personal spending can lead to penalties." },
    { title: "The final stretch", text: "Valuation can swing sharply with customers, growth, and market mood. Lasting companies are built over many years." }
];

/* Headline card at the top of each year (it used to stay on Year 1 forever). */
function yearHeadline() {
    const y = state.currentYear;
    const runway = state.cash > 0 ? state.cash / Math.max(1, getAnnualBurn()) : 0;
    const status = `You have ${formatMoney(state.cash)} in the bank and burn about ${formatMoney(getAnnualBurn())} a year.`;

    const headlines = {
        1: ["Build the Company", "Your startup has $100,000 in pre-seed funding. Spend it on traction: Series A investors will price your company on what you build this year."],
        2: ["Series A Year", `You just raised your Series A and now own ${formatPercent(playerEquity())} of the company. ${status}`],
        3: [state.industry === "tech" ? "Hypergrowth" : "Proving the Model", status],
        4: ["Scaling Up", status],
        5: ["Market Tailwind", `Valuations across the market are rising. ${status}`],
        6: ["Big Players Are Watching", status],
        7: ["Hot Markets", `The IPO window may open this year. ${status}`],
        8: ["Storm Clouds", `Economists are warning about a downturn. ${status}`],
        9: ["Under the Microscope", status],
        10: ["The Final Year", `Whoever is worth more at the end of this year wins. ${status}`]
    };
    const [title, text] = headlines[y] || headlines[1];
    return { title, text: runway < 1 && y > 1 ? text + " Your runway is under a year: be careful." : text };
}

function updateYearExplanation() {
    const head = yearHeadline();
    setText("fundingEventEyebrow", "YEAR " + state.currentYear);
    setText("fundingEventTitle", head.title);
    setText("fundingEventText", head.text);

    const box = $("fundingBottomExplanation");
    if (!box) return;

    const lesson = YEAR_LESSONS[clamp(state.currentYear, 1, TOTAL_YEARS) - 1];
    const title = box.querySelector("h3");
    const body = box.querySelector("p");
    if (title) title.textContent = lesson.title;
    if (body) body.textContent = lesson.text;
}

const CARD_NAMES = { product: "Product", marketing: "Marketing", expansion: "Expansion", rd: "R&D", salary: "High Salaries" };

function updateRivalMoves() {
    const moves = state.rival.lastMoves || [];
    setText(
        "rivalLastMoves",
        state.currentYear === 1 || !moves.length
            ? "The rival's moves will show here after each year."
            : "Last year the rival played: " + moves.map(m => CARD_NAMES[m]).join(", ") + "."
    );
}

function setPie(id, fraction, color) {
    const pie = $(id);
    if (!pie) return;

    const degrees = clamp(fraction, 0, 1) * 360;
    pie.style.background =
        `conic-gradient(${color} 0deg ${degrees}deg, rgba(255,255,255,0.14) ${degrees}deg 360deg)`;
}

function updateDisplays() {
    setText("fundingYearNumber", state.currentYear);
    setText("fundingIndustryTop", state.startupType ? state.startupType.name : "Startup");

    setText("companyIndustry", state.startupType ? state.startupType.name : "Startup");
    setText("companyTypeLabel", state.industry === "tech" ? "Tech Startup" : "Non-Tech Startup");
    setText("playerCompanyValue", formatMoney(state.companyValue));
    setText("playerCash", formatMoney(state.cash));
    setText("playerRevenue", formatMoney(state.revenue));
    setText("playerUsers", formatUsers(state.users));
    setText("playerMarketShare", state.marketShare.toFixed(1) + "%");
    setText("playerReputation", Math.round(state.reputation));

    const monthlyBurn = getAnnualBurn() / 12;
    let runway;
    if (state.cash <= 0) {
        runway = "0 mos";
    } else {
        const months = Math.max(1, Math.round(state.cash / monthlyBurn));
        runway = months > 120 ? "10+ yrs" : months + " mos";
    }
    setText("playerRunway", runway);

    // Cofounder panel
    setText("cofounderName", state.cofounderName);
    setText(
        "cofounderRole",
        !state.cofounder
            ? "Former cofounder"
            : (state.industry === "tech" ? "Non-technical cofounder" : "Technical cofounder")
    );
    setText("cofounderOwnership", formatPercent(state.cofounderEquity));

    const statusValue = document.querySelector("#cofounderStatus strong");
    if (statusValue) statusValue.textContent = state.cofounderStatus;

    // Company value
    setText("valuePieLabel", formatMoney(state.companyValue));

    const change = state.valueAtYearStart > 0
        ? (state.companyValue / state.valueAtYearStart - 1) * 100
        : 0;
    const changeEl = $("playerValueChange");
    if (changeEl) {
        changeEl.textContent = (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
        changeEl.style.color = change >= 0 ? "#6EE7A8" : "#FF7A7A";
    }

    // Rival
    setText("computerCompanyValue", formatMoney(state.computerValue));
    setText("computerPieLabel", formatMoney(state.computerValue));
    setText("rivalShare", state.rival.marketShare.toFixed(1) + "%");
    setText("rivalRevenue", formatMoney(state.rival.revenue));
    updateRivalMoves();

    const isAhead = state.companyValue >= state.computerValue;
    setText("playerRank", isAhead ? "#1" : "#2");
    setText("valueGap", formatMoney(Math.abs(state.companyValue - state.computerValue)));

    // Pies show each company's share of the combined market value.
    const total = state.companyValue + state.computerValue;
    setPie("playerValuePie", total > 0 ? state.companyValue / total : 0.5, "#E5B84A");
    setPie("computerValuePie", total > 0 ? state.computerValue / total : 0.5, "#8E7CFF");

    updateProgressBar();
    updateMetricBars();
    updateYearExplanation();
    updateDecisionHeader();
}

function updateMetricBars() {
    // Cash is shown on a log scale so it stays readable from $100K to $1B.
    const cashFill = $("cashMetricFill");
    if (cashFill) {
        const percent = state.cash <= 1000
            ? 2
            : clamp(((Math.log10(state.cash) - 3) / 7) * 100, 2, 100);
        cashFill.style.width = percent + "%";
    }

    const shareFill = $("marketShareFill");
    if (shareFill) {
        shareFill.style.width = clamp(state.marketShare, 2, 100) + "%";
    }

    const repFill = $("reputationFill");
    if (repFill) {
        repFill.style.width = clamp(state.reputation, 2, 100) + "%";
    }
}

function updateProgressBar() {
    const fill = $("fundingYearProgressFill");
    if (fill) {
        fill.style.width = (state.currentYear / TOTAL_YEARS * 100) + "%";
    }

    const container = $("fundingYearProgress");
    if (!container) return;

    const boxes = container.querySelectorAll(".funding-year-boxes span");
    boxes.forEach((box) => {
        const y = parseInt(box.getAttribute("data-year"), 10);
        box.classList.remove("completed", "active");
        if (y < state.currentYear) {
            box.classList.add("completed");
        } else if (y === state.currentYear) {
            box.classList.add("active");
        }
    });
}


/* =========================================================
   FINAL SCREEN & RESTART
   ========================================================= */

function finishGame() {
    leaveGame();
    showScreen("screen-funding-finish");

    const bankrupt = state.bankrupt;
    const playerVal = bankrupt ? 0 : Math.max(0, state.companyValue);
    const computerVal = Math.max(0, state.computerValue);

    setText("finalPlayerValue", formatMoney(playerVal));
    setText("finalComputerValue", formatMoney(computerVal));

    let title = "IT'S A TIE!";
    let desc = "Both companies achieved equal market performance.";

    if (bankrupt) {
        title = "BANKRUPT";
        desc = "Your company ran out of cash two years in a row and creditors took over. Watch your burn rate, and don't treat investor money like your own.";
    } else if (playerVal > computerVal) {
        title = "YOU WIN!";
        desc = `Your startup beat the rival by ${formatMoney(playerVal - computerVal)} after 10 years.`;
    } else if (computerVal > playerVal) {
        title = "COMPUTER WINS!";
        desc = `The rival finished ${formatMoney(computerVal - playerVal)} ahead. Try mixing your cards: repeating one card in a year gives diminishing returns.`;
    }

    setText("finalResultTitle", title);
    setText("finalResultText", desc);

    renderFinalStats(playerVal);
}

function renderFinalStats(finalValue) {
    const grid = $("finalStatGrid");
    if (!grid) return;

    const ownership = playerEquity();
    const stats = [
        ["Cash", formatMoney(state.cash), state.cash < 0 ? "In debt" : "On hand"],
        ["Revenue", formatMoney(state.revenue), "Rival: " + formatMoney(state.rival.revenue)],
        ["Users", formatUsers(state.users), "Customers"],
        ["Market Share", state.marketShare.toFixed(1) + "%", "Rival: " + state.rival.marketShare.toFixed(1) + "%"],
        ["Reputation", String(Math.round(state.reputation)), "Out of 100"],
        ["Your Ownership", formatPercent(ownership), "Stake worth " + formatMoney(finalValue * ownership / 100)],
        ["Cofounder", state.cofounderStatus, state.cofounderName],
        ["Company", state.ipo ? "Public" : "Private", state.startupType ? state.startupType.name : "Startup"]
    ];

    grid.innerHTML = "";
    stats.forEach(([label, value, note]) => {
        const card = document.createElement("div");
        card.className = "foundation-stat";

        const labelEl = document.createElement("span");
        labelEl.textContent = label;

        const valueEl = document.createElement("strong");
        valueEl.textContent = value;

        const noteEl = document.createElement("small");
        noteEl.textContent = note;

        card.appendChild(labelEl);
        card.appendChild(valueEl);
        card.appendChild(noteEl);
        grid.appendChild(card);
    });
}

function restartGame() {
    initializeGame();
    showScreen("screen-intro");
}


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function showToast(message, duration = 3000) {
    let toast = $("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            max-width: 360px;
            background: #24163F;
            color: #FFF7DE;
            padding: 12px 20px;
            border-radius: 12px;
            border: 2px solid #E5B84A;
            box-shadow: 0 10px 20px rgba(0,0,0,0.4);
            z-index: 1000;
            font-family: var(--font-body);
            font-size: 0.9rem;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    // Cancel the previous toast's timer so it can't hide this one early.
    clearTimeout(state.toastTimeout);
    state.toastTimeout = setTimeout(() => {
        toast.style.opacity = "0";
    }, duration);
}


/* =========================================================
   GLOBAL CLICK LISTENERS
   ========================================================= */

function setupGlobalEventListeners() {
    document.addEventListener("click", (event) => {
        const target = event.target;

        retryMusicIfNeeded();

        if (target.closest("#btnPlayNow")) {
            startMusic();
            openGame();
        }

        if (target.closest("#btnMute")) {
            toggleMute();
        }

        if (target.closest("#btnFundingHome, #btnFundingFinishHome")) {
            leaveGame();
            showScreen("screen-welcome");
        }

        const diffBtn = target.closest("[data-difficulty]");
        if (diffBtn) setDifficulty(diffBtn.getAttribute("data-difficulty"));

        if (target.closest("#btnStartFunding")) startFundingSimulator();
        if (target.closest("#btnFundingTech")) chooseIndustry("tech");
        if (target.closest("#btnFundingNonTech")) chooseIndustry("nontech");

        if (target.closest("#btnSpinIndustry")) spinIndustry();
        if (target.closest("#btnContinueAfterSpin")) showFoundationScreen();
        if (target.closest("#btnEnterYear1")) startYearOne();

        if (target.closest("#btnEndYear")) advanceYear();

        if (target.closest("#btnFundingPlayAgain")) restartGame();
    });
}
