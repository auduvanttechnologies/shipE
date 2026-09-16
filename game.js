/* =========================================================
   shipE - Game JavaScript
   Levels 1, 2 and 3
   ========================================================= */

const state = {
    currentLevel: 1,
    currentYear: 1,

    industry: null,
    startupType: null,

    companyValue: 100000,
    computerValue: 100000,

    users: 0,
    revenue: 0,
    cash: 100000,

    reputation: 50,
    marketShare: 10,

    cofounder: true,
    cofounderEquity: 50,

    ipo: false,
    bankrupt: false,

    actionsThisYear: 0,
    yearStarted: false,
    timer: null,
    timeRemaining: 120,

    history: []
};


/* =========================================================
   BASIC HELPERS & NAVIGATION
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

const bgMusic = $("bgMusic");

function startMusic() {
    bgMusic.play().catch(() => {});
}

function stopMusic() {
    bgMusic.pause();
    bgMusic.currentTime = 0;
}

function toggleMute() {
    bgMusic.muted = !bgMusic.muted;

    const btn = $("btnMute");

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
}

function setText(id, text) {
    const element = $(id);
    if (element) {
        element.textContent = text;
    }
}

function formatMoney(value) {
    if (value >= 1000000000) {
        return "$" + (value / 1000000000).toFixed(1) + "B";
    }

    if (value >= 1000000) {
        return "$" + (value / 1000000).toFixed(1) + "M";
    }

    if (value >= 1000) {
        return "$" + (value / 1000).toFixed(0) + "K";
    }

    return "$" + Math.round(value);
}

function formatUsers(users) {
    if (users >= 1000000000) {
        return (users / 1000000000).toFixed(1) + "B";
    }

    if (users >= 1000000) {
        return (users / 1000000).toFixed(1) + "M";
    }

    if (users >= 1000) {
        return (users / 1000).toFixed(0) + "K";
    }

    return Math.round(users);
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


/* =========================================================
   INITIALIZATION & LEVEL SELECTION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    setupGlobalEventListeners();
    showScreen("screen-welcome");
});

function selectLevel(level) {
    state.currentLevel = level;

    if (level === 3) {
        initializeLevel3();
        showScreen("screen-level3-intro");
    } else {
        setText("introLevelNumber", level);
        setText("introLevelNumberLarge", level);
        setText("levelIntroTitle", level === 1 ? "Entrepreneurship" : "Running a Business");
        setText(
            "levelIntroCopy",
            level === 1
                ? "Revenue, cost, and the choices that make or break a business. Reach the finish line!"
                : "Operations, management, costs, and finance — the systems behind the business."
        );
        showScreen("screen-level-intro");
    }
}


/* =========================================================
   LEVEL 3 — FUNDING SIMULATOR
   ========================================================= */

function initializeLevel3() {
    state.currentYear = 1;
    state.companyValue = 100000;
    state.computerValue = 100000;
    state.users = 0;
    state.revenue = 0;
    state.cash = 100000;
    state.reputation = 50;
    state.marketShare = 10;
    state.cofounder = true;
    state.cofounderEquity = 50;
    state.ipo = false;
    state.bankrupt = false;
    state.actionsThisYear = 0;
    clearInterval(state.timer);
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

    const wheel = $("industrySpinnerWheel");
    if (wheel) wheel.style.transform = "rotate(0deg)";

    showScreen("screen-funding-spinner");
}

function spinIndustry() {
    const btnSpin = $("btnSpinIndustry");
    if (btnSpin) btnSpin.style.display = "none";

    const techIndustries = [
        { name: "Rocket Company", type: "tech", condition: "You are building a space technology company." },
        { name: "Fintech", type: "tech", condition: "You are building a financial technology company." },
        { name: "Developer Tools", type: "tech", condition: "You are building software tools for developers." },
        { name: "Cybersecurity", type: "tech", condition: "You are building a cybersecurity company." },
        { name: "Optical Computing", type: "tech", condition: "You are developing optical computing chips." },
        { name: "Telehealth", type: "tech", condition: "You are building a digital healthcare company." }
    ];

    const nonTechIndustries = [
        { name: "Construction", type: "nontech", condition: "You are building a construction company." },
        { name: "Consulting", type: "nontech", condition: "You are building a consulting company." },
        { name: "Advertising", type: "nontech", condition: "You are building an advertising company." },
        { name: "Biodegradable Plastic", type: "nontech", condition: "You are developing biodegradable plastic products." }
    ];

    const choices = state.industry === "tech" ? techIndustries : nonTechIndustries;
    const result = choices[Math.floor(Math.random() * choices.length)];
    state.startupType = result;

    const wheel = $("industrySpinnerWheel");
    if (wheel) {
        const randomRotation = 1440 + Math.floor(Math.random() * 360);
        wheel.style.transform = `rotate(${randomRotation}deg)`;
    }

    setTimeout(() => {
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
        ? "Non-technical cofounder (50% equity)"
        : "Technical cofounder (50% equity)";

    setText("foundationTeamDescription", founderDesc);
}

function startYearOne() {
    showScreen("screen-funding-simulator");

    state.currentYear = 1;
    state.actionsThisYear = 0;

    applyYearStartConditions();
    updateLevel3Displays();
    renderYearActions();
    startYearTimer();
}


/* =========================================================
   YEAR TIMER & PROGRESS
   ========================================================= */

function startYearTimer() {
    clearInterval(state.timer);

    state.yearStarted = true;
    state.timeRemaining = 120;

    updateTimerDisplay();

    state.timer = setInterval(() => {
        state.timeRemaining--;
        updateTimerDisplay();

        if (state.timeRemaining <= 0) {
            clearInterval(state.timer);
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
        fill.style.width = (state.timeRemaining / 120 * 100) + "%";
    }
}

function advanceYear() {
    clearInterval(state.timer);

    if (checkYearEvents()) {
        return;
    }

    endCurrentYear();
}

function endCurrentYear() {
    applyEndOfYearEffects();

    if (state.currentYear >= 10) {
        finishLevel3();
        return;
    }

    state.currentYear++;
    state.actionsThisYear = 0;

    showScreen("screen-funding-simulator");
    applyYearStartConditions();
    renderYearActions();
    updateLevel3Displays();
    startYearTimer();
}


/* =========================================================
   YEAR START & END CONDITIONS
   ========================================================= */

function applyYearStartConditions() {
    switch (state.currentYear) {
        case 1:
            state.cash = Math.max(state.cash, 100000);
            break;
        case 2:
            state.cash += 50000000;
            state.companyValue = Math.max(state.companyValue, 100000000);
            state.users = Math.max(state.users, 10000000);
            break;
        case 3:
            if (state.industry === "tech") {
                state.companyValue = Math.max(state.companyValue, 1000000000);
                state.users = Math.max(state.users, 100000000);
                state.revenue = Math.max(state.revenue, 200000000);
                state.marketShare = Math.max(state.marketShare, 35);
            } else {
                state.cash += 10000000;
            }
            break;
        case 4:
            state.reputation += 5;
            break;
        case 5:
            state.companyValue *= 1.10;
            break;
        case 6:
            state.companyValue *= 1.08;
            break;
        case 7:
            state.companyValue *= 1.12;
            break;
        case 8:
            state.companyValue *= 0.85;
            state.cash *= 0.85;
            state.marketShare *= 0.92;
            break;
        case 9:
            state.reputation -= 10;
            state.companyValue *= 0.90;
            break;
        case 10:
            state.users *= 0.75;
            state.companyValue *= 0.70;
            break;
    }

    state.companyValue = Math.max(0, state.companyValue);
}

function applyEndOfYearEffects() {
    if (state.bankrupt) return;

    const reputationMultiplier = 1 + ((state.reputation - 50) / 1000);
    state.companyValue *= reputationMultiplier;
    state.companyValue *= 1 + (state.marketShare / 10000);

    if (state.cash < 0) {
        state.companyValue *= 0.85;
        state.reputation -= 5;
    }

    state.companyValue = Math.max(0, state.companyValue);
}


/* =========================================================
   ACTION CARDS & EXECUTION
   ========================================================= */

function getActionsForYear() {
    const costMultiplier = state.currentYear <= 2 ? 1 : 10;

    return [
        {
            id: "product",
            icon: "🛠️",
            title: "Develop Product",
            description: "Build a new feature or improve the company's core product.",
            cost: 25000 * costMultiplier
        },
        {
            id: "marketing",
            icon: "📣",
            title: "Invest in Marketing",
            description: "Increase brand awareness and acquire new customers.",
            cost: 20000 * costMultiplier
        },
        {
            id: "expansion",
            icon: "🏢",
            title: "Expand Operations",
            description: "Grow into new territories or open new offices.",
            cost: 35000 * costMultiplier
        },
        {
            id: "rd",
            icon: "🔬",
            title: "Invest in R&D",
            description: "Fund research that creates long-term competitive advantages.",
            cost: 30000 * costMultiplier
        },
        {
            id: "salary",
            icon: "💵",
            title: "High Salaries",
            description: "Pay yourself and your team above-market compensation.",
            cost: 20000 * costMultiplier
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

function renderYearActions() {
    const container = $("fundingDecisionCards");
    if (!container) return;

    container.innerHTML = "";
    const actions = getActionsForYear();

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
            card.querySelectorAll(".personal-spend-btn").forEach(btn => {
                btn.addEventListener("click", (e) => {
                    e.stopPropagation();
                    const percent = parseInt(btn.getAttribute("data-spend"), 10);
                    executePersonalSpending(percent);
                });
            });
            container.appendChild(card);
        } else {
            const btn = document.createElement("button");
            btn.className = "funding-decision-card";
            btn.innerHTML = `
                <div class="funding-card-icon">${action.icon}</div>
                <h3>${action.title}</h3>
                <p>${action.description}</p>
                <div class="funding-card-footer">
                    <span>Cost</span>
                    <strong>${formatMoney(action.cost)}</strong>
                </div>
            `;
            btn.addEventListener("click", () => executeAction(action));
            container.appendChild(btn);
        }
    });
}

function executeAction(action) {
    if (state.bankrupt) return;

    state.actionsThisYear++;

    switch (action.id) {
        case "product":
            state.cash -= action.cost;
            state.users += state.currentYear * random(10000, 50000);
            state.revenue += random(10000, 100000);
            state.companyValue *= 1.08;
            state.reputation += 3;
            showToast("Product development paid off. Your company is growing.");
            break;
        case "marketing":
            state.cash -= action.cost;
            state.users += random(25000, 150000);
            state.marketShare += random(1, 5);
            state.companyValue *= 1.06;
            showToast("Marketing brought in new customers.");
            break;
        case "expansion":
            state.cash -= action.cost;
            state.marketShare += random(1, 4);
            state.revenue += random(25000, 200000);
            state.companyValue *= 1.05;
            showToast("Your company expanded its operations.");
            break;
        case "rd":
            state.cash -= action.cost;
            state.companyValue *= 1.12;
            state.reputation += 5;
            state.users += random(5000, 50000);
            showToast("R&D created a long-term advantage.");
            break;
        case "salary":
            state.cash -= action.cost;
            state.reputation -= 3;
            state.companyValue *= 0.97;
            showToast("High salaries paid out. Investors noticed.");
            break;
    }

    updateLevel3Displays();
}

function executePersonalSpending(percentage) {
    const spending = state.cash * (percentage / 100);
    state.cash -= spending;
    state.reputation -= percentage / 5;
    state.companyValue *= 1 - (percentage / 500);

    showToast(`You spent ${percentage}% of the company's cash on yourself.`);
    updateLevel3Displays();
}


/* =========================================================
   EVENTS SYSTEM
   ========================================================= */

function checkYearEvents() {
    if (state.currentYear === 2) {
        triggerCofounderEvent();
        return true;
    }

    if (state.currentYear === 3) {
        triggerYear3GoodEvent();
        return true;
    }

    if (state.currentYear === 8) {
        triggerRecessionEvent();
        return true;
    }

    if (state.currentYear === 9) {
        triggerAuditEvent();
        return true;
    }

    if (state.currentYear === 10) {
        triggerYear10Event();
        return true;
    }

    return false;
}

function showEventScreen(title, text, choices) {
    showScreen("screen-funding-event");

    setText("majorEventEyebrow", "YEAR " + state.currentYear);
    setText("majorEventTitle", title);
    setText("majorEventSpeaker", "NARRATOR");
    setText("majorEventText", text);

    const container = $("majorEventChoices");
    if (container) {
        container.innerHTML = "";
        choices.forEach(choice => {
            const btn = document.createElement("button");
            btn.className = "btn btn-primary";
            btn.textContent = choice.label;
            btn.addEventListener("click", choice.action);
            container.appendChild(btn);
        });
    }
}

function triggerCofounderEvent() {
    if (!state.cofounder) {
        endCurrentYear();
        return;
    }

    showEventScreen(
        "SURPRISE!",
        "Your cofounder used the company debit card to buy a Lamborghini ($250,000). Decide whether to keep working together or buy out their share.",
        [
            { label: "Keep Cofounder", action: keepCofounder },
            { label: "Buy Out Shares", action: removeCofounder }
        ]
    );
}

function keepCofounder() {
    state.cash -= 250000;
    state.reputation -= 2;

    showToast("You kept your cofounder. Absorbed $250K loss.");
    endCurrentYear();
}

function removeCofounder() {
    const buyoutPrice = state.companyValue * (state.cofounderEquity / 100);
    state.cash -= buyoutPrice;
    state.cofounder = false;
    state.cofounderEquity = 0;
    state.reputation += 3;
    state.companyValue *= 1.05;

    showToast(`Bought out cofounder for ${formatMoney(buyoutPrice)}.`);
    endCurrentYear();
}

function triggerYear3GoodEvent() {
    const text = state.industry === "tech"
        ? "You were featured in Tech Magazine! 'New disruptive startup.' Free marketing boosts your market share."
        : "You won a government grant and small-business loan worth $10 Million!";

    if (state.industry === "tech") {
        state.marketShare = clamp(state.marketShare + 14.5, 0, 100);
        state.companyValue *= 1.15;
    } else {
        state.cash += 10000000;
        state.companyValue *= 1.10;
    }

    showEventScreen("GOOD NEWS!", text, [
        { label: "Continue →", action: endCurrentYear }
    ]);
}

function triggerRecessionEvent() {
    state.companyValue *= 0.85;
    state.revenue *= 0.85;
    state.marketShare *= 0.95;

    showEventScreen(
        "RECESSION",
        "The economy entered a recession. Capital is tight and valuation dropped.",
        [{ label: "Survive Downturn →", action: endCurrentYear }]
    );
}

function triggerAuditEvent() {
    state.cash -= random(25000, 250000);
    state.reputation -= 5;
    state.companyValue *= 0.95;

    showEventScreen(
        "IRS AUDIT",
        "The IRS selected your company for an audit, incurring unexpected financial fees.",
        [{ label: "Complete Audit →", action: endCurrentYear }]
    );
}

function triggerYear10Event() {
    state.users *= 0.75;
    state.revenue *= 0.75;
    state.marketShare *= 0.75;
    state.companyValue *= 0.70;

    const text = state.industry === "tech"
        ? "Customers are leaving. Your technology company reaches its final stretch."
        : "Profitability plummeted in this final year.";

    showEventScreen("FINAL YEAR CHALLENGE", text, [
        { label: "See Final Results →", action: finishLevel3 }
    ]);
}


/* =========================================================
   DISPLAY UPDATES
   ========================================================= */

function updateLevel3Displays() {
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

    const runwayMonths = state.cash <= 0 ? "0 mos" : Math.max(1, Math.round(state.cash / 20000)) + " mos";
    setText("playerRunway", runwayMonths);

    setText("cofounderOwnership", state.cofounderEquity + "%");
    setText("cofounderStatus", state.cofounder ? "Active" : "Bought Out");

    setText("valuePieLabel", formatMoney(state.companyValue));

    updateComputerAI();
    setText("computerCompanyValue", formatMoney(state.computerValue));
    setText("computerPieLabel", formatMoney(state.computerValue));

    const isAhead = state.companyValue >= state.computerValue;
    setText("playerRank", isAhead ? "#1" : "#2");
    setText("valueGap", formatMoney(Math.abs(state.companyValue - state.computerValue)));

    updateProgressBar();
    updateMetricBars();
}

function updateMetricBars() {
    const cashFill = $("cashMetricFill");
    if (cashFill) {
        cashFill.style.width = clamp((state.cash / 500000) * 100, 2, 100) + "%";
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
        fill.style.width = (state.currentYear / 10 * 100) + "%";
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

function updateComputerAI() {
    const growthRate = random(3, 10) / 100;
    state.computerValue *= 1 + growthRate;

    if ([3, 5, 7].includes(state.currentYear)) state.computerValue *= 1.08;
    if (state.currentYear === 8) state.computerValue *= 0.88;
    if (state.currentYear === 9) state.computerValue *= 0.93;
    if (state.currentYear === 10) state.computerValue *= 0.75;
}


/* =========================================================
   FINAL SCREEN & RESTART
   ========================================================= */

function finishLevel3() {
    clearInterval(state.timer);
    stopMusic();
    showScreen("screen-funding-finish");

    const playerVal = Math.max(0, state.companyValue);
    const computerVal = Math.max(0, state.computerValue);

    setText("finalPlayerValue", formatMoney(playerVal));
    setText("finalComputerValue", formatMoney(computerVal));

    let title = "IT'S A TIE!";
    let desc = "Both companies achieved equal market performance.";

    if (playerVal > computerVal) {
        title = "YOU WIN!";
        desc = "Your startup outperformed the rival computer business across 10 years!";
    } else if (computerVal > playerVal) {
        title = "COMPUTER WINS!";
        desc = "The computer rival built a larger valuation. Try again with a new strategy!";
    }

    setText("finalResultTitle", title);
    setText("finalResultText", desc);
}

function restartLevel3() {
    initializeLevel3();
    showScreen("screen-level3-intro");
}


/* =========================================================
   TOAST NOTIFICATION
   ========================================================= */

function showToast(message) {
    let toast = $("toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
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

    setTimeout(() => {
        toast.style.opacity = "0";
    }, 3000);
}


/* =========================================================
   GLOBAL CLICK LISTENERS
   ========================================================= */

function setupGlobalEventListeners() {
    document.addEventListener("click", (event) => {
        const target = event.target;

        if (target.closest("#btnPlayNow")) {
           startMusic();
           showScreen("screen-menu");
        }
       
        if (target.closest("#btnMute")) {
          toggleMute();
        }

        if (target.closest("#btnMenuHome, #btnHome, #btnFundingHome")) {
            showScreen("screen-welcome");
        }

        if (target.closest("#btnMenuRefresh, #btnMenu, #btnFundingMenu")) {
            showScreen("screen-menu");
        }

        if (target.closest("#btnLevel1")) selectLevel(1);
        if (target.closest("#btnLevel2")) selectLevel(2);
        if (target.closest("#btnLevel3")) selectLevel(3);

        if (target.closest("#btnStartFunding")) startFundingSimulator();
        if (target.closest("#btnFundingTech")) chooseIndustry("tech");
        if (target.closest("#btnFundingNonTech")) chooseIndustry("nontech");

        if (target.closest("#btnSpinIndustry")) spinIndustry();
        if (target.closest("#btnContinueAfterSpin")) showFoundationScreen();
        if (target.closest("#btnEnterYear1")) startYearOne();

        if (target.closest("#btnFundingFinishMenu")) showScreen("screen-menu");
        if (target.closest("#btnFundingPlayAgain")) restartLevel3();
    });
}
