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
   GENERAL NAVIGATION
   ========================================================= */

function goHome() {
    window.location.href = "index.html";
}

function goToMenu() {
    window.location.href = "levels.html";
}

function selectLevel(level) {
    if (level === 1) {
        window.location.href = "game.html?level=1";
    } else if (level === 2) {
        window.location.href = "game.html?level=2";
    } else if (level === 3) {
        window.location.href = "game.html?level=3";
    }
}


/* =========================================================
   BASIC HELPERS
   ========================================================= */

function $(id) {
    return document.getElementById(id);
}

function show(id) {
    const element = $(id);
    if (element) {
        element.style.display = "";
    }
}

function hide(id) {
    const element = $(id);
    if (element) {
        element.style.display = "none";
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

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}


/* =========================================================
   LEVEL DETECTION
   ========================================================= */

function getLevelFromURL() {
    const params = new URLSearchParams(window.location.search);
    const level = parseInt(params.get("level"), 10);

    return Number.isNaN(level) ? 1 : level;
}


/* =========================================================
   INITIALIZATION
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    state.currentLevel = getLevelFromURL();

    if (state.currentLevel === 3) {
        initializeLevel3();
    } else if (state.currentLevel === 2) {
        initializeLevel2();
    } else {
        initializeLevel1();
    }

    setupNavigationButtons();
});


function setupNavigationButtons() {
    const homeButtons = document.querySelectorAll(
        "#homeButton, .home-button, [data-action='home']"
    );

    homeButtons.forEach(button => {
        button.addEventListener("click", goHome);
    });

    const menuButtons = document.querySelectorAll(
        "#menuButton, .menu-button, [data-action='menu']"
    );

    menuButtons.forEach(button => {
        button.addEventListener("click", goToMenu);
    });
}


/* =========================================================
   LEVEL 1
   ========================================================= */

function initializeLevel1() {
    state.currentLevel = 1;

    /*
       Keep Level 1 compatible with the existing game.
       If your original Level 1 initialization exists below
       in your HTML-specific version, these functions are
       intentionally conservative.
    */

    setText("levelTitle", "Level 1");

    const level3 = $("level3Simulator");
    if (level3) {
        level3.style.display = "none";
    }
}


/* =========================================================
   LEVEL 2
   ========================================================= */

function initializeLevel2() {
    state.currentLevel = 2;

    setText("levelTitle", "Running a Business");

    const level3 = $("level3Simulator");
    if (level3) {
        level3.style.display = "none";
    }

    /*
       Level 2 uses the same gameplay structure as Level 1.
       Its questions should be supplied by the Level 2
       question bank in the existing game implementation.
    */
}


/* =========================================================
   LEVEL 3
   FUNDING SIMULATOR
   ========================================================= */

function initializeLevel3() {
    state.currentLevel = 3;

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

    hideAllGameScreens();

    showLevel3Intro();

    updateLevel3Displays();
}


/* =========================================================
   LEVEL 3 SCREEN MANAGEMENT
   ========================================================= */

function hideAllGameScreens() {
    const screens = [
        "introScreen",
        "industryScreen",
        "spinnerScreen",
        "startupScreen",
        "yearScreen",
        "eventScreen",
        "finalScreen",
        "level3Intro",
        "level3Industry",
        "level3Spinner",
        "level3Startup",
        "level3Game",
        "level3Event",
        "level3Final"
    ];

    screens.forEach(id => hide(id));
}


function showLevel3Intro() {
    hideAllGameScreens();

    show("level3Intro");
    show("introScreen");

    setText(
        "dialogText",
        "Congratulations! You have been accepted into Startup School. " +
        "You are about to build a company from the ground up."
    );

    setText("levelTitle", "Funding Simulator");
    setText("levelSubtitle", "A 10-year startup journey");
}


function startFundingSimulator() {
    hideAllGameScreens();

    show("level3Industry");
    show("industryScreen");

    setText(
        "dialogText",
        "First, choose the type of business you want to build."
    );
}


function chooseIndustry(type) {
    state.industry = type;

    hideAllGameScreens();

    show("level3Spinner");
    show("spinnerScreen");

    setText(
        "dialogText",
        type === "tech"
            ? "You chose a technology startup. Let's see what kind of company you will build..."
            : "You chose a non-technology startup. Let's see what business awaits..."
    );

    setText(
        "spinnerLabel",
        type === "tech"
            ? "TECH STARTUP"
            : "NON-TECH STARTUP"
    );
}


function spinIndustry() {
    const techIndustries = [
        {
            name: "Rocket Company",
            type: "tech",
            condition: "You are building a space technology company."
        },
        {
            name: "Fintech",
            type: "tech",
            condition: "You are building a financial technology company."
        },
        {
            name: "Developer Tools",
            type: "tech",
            condition: "You are building software tools for developers."
        },
        {
            name: "Cybersecurity",
            type: "tech",
            condition: "You are building a cybersecurity company."
        },
        {
            name: "Optical Computing",
            type: "tech",
            condition: "You are developing a new type of optical computing chip."
        },
        {
            name: "Telehealth",
            type: "tech",
            condition: "You are building a digital healthcare company."
        }
    ];

    const nonTechIndustries = [
        {
            name: "Construction",
            type: "nontech",
            condition: "You are building a construction company."
        },
        {
            name: "Consulting",
            type: "nontech",
            condition: "You are building a consulting company."
        },
        {
            name: "Advertising",
            type: "nontech",
            condition: "You are building an advertising company."
        },
        {
            name: "Biodegradable Plastic",
            type: "nontech",
            condition: "You are developing biodegradable plastic products."
        }
    ];

    const choices =
        state.industry === "tech"
            ? techIndustries
            : nonTechIndustries;

    const result =
        choices[Math.floor(Math.random() * choices.length)];

    state.startupType = result;

    animateSpinner(result, choices);
}


function animateSpinner(result, choices) {
    const spinner = $("spinner");

    if (!spinner) {
        finishSpinner(result);
        return;
    }

    let count = 0;
    const totalSpins = 18;

    const interval = setInterval(() => {
        const randomChoice =
            choices[Math.floor(Math.random() * choices.length)];

        setText("spinnerResult", randomChoice.name);

        count++;

        if (count >= totalSpins) {
            clearInterval(interval);

            setTimeout(() => {
                setText("spinnerResult", result.name);
                finishSpinner(result);
            }, 500);
        }
    }, 100);
}


function finishSpinner(result) {
    setTimeout(() => {
        hideAllGameScreens();

        show("level3Startup");
        show("startupScreen");

        setText("startupName", result.name);
        setText("startupDescription", result.condition);

        setText(
            "dialogText",
            "Your company has been accepted into Startup School. " +
            "You and your cofounder are starting with $100,000 in pre-seed funding."
        );

        updateFounderDescription();
    }, 700);
}


function updateFounderDescription() {
    const description =
        state.industry === "tech"
            ? "You have a non-technical cofounder. You each own 50% of the company."
            : "You have a technical cofounder. You each own 50% of the company.";

    setText("founderDescription", description);
}


function startYearOne() {
    hideAllGameScreens();

    show("level3Game");
    show("yearScreen");

    state.currentYear = 1;
    state.actionsThisYear = 0;
    state.timeRemaining = 120;

    applyYearStartConditions();

    showYearDialog(
        "YEAR 1",
        "You receive $100,000 in pre-seed funding. " +
        "You and your cofounder are the entire team."
    );

    updateLevel3Displays();
    renderYearActions();
    startYearTimer();
}


/* =========================================================
   YEAR MANAGEMENT
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
            endCurrentYear();
        }
    }, 1000);
}


function updateTimerDisplay() {
    const minutes = Math.floor(state.timeRemaining / 60);
    const seconds = state.timeRemaining % 60;

    const text =
        minutes +
        ":" +
        String(seconds).padStart(2, "0");

    setText("yearTimer", text);
}


function endCurrentYear() {
    clearInterval(state.timer);

    state.yearStarted = false;

    applyEndOfYearEffects();

    if (state.currentYear >= 10) {
        finishLevel3();
        return;
    }

    state.currentYear++;

    state.actionsThisYear = 0;

    startNextYear();
}


function startNextYear() {
    showYearDialog(
        "YEAR " + state.currentYear,
        getYearIntroduction(state.currentYear)
    );

    applyYearStartConditions();

    renderYearActions();
    updateLevel3Displays();

    setTimeout(() => {
        startYearTimer();
    }, 1500);
}


function getYearIntroduction(year) {
    const introductions = {
        2:
            "Your company is gaining serious traction. " +
            "Investors are taking notice.",

        3:
            state.industry === "tech"
                ? "Your startup has exploded. You have become a unicorn."
                : "Your business is growing, but your R&D spending is consuming cash.",

        4:
            "You graduate from Startup School. Now the real challenge begins.",

        5:
            "Your company is entering its next stage of growth.",

        6:
            "Competitors are catching up. Your decisions matter more than ever.",

        7:
            "You are now an established company. Growth is becoming harder.",

        8:
            "A recession has hit the economy.",

        9:
            "The IRS has selected your company for an audit.",

        10:
            "Your company is losing customers. This is the final year."
    };

    return introductions[year] || "Another year begins.";
}


/* =========================================================
   YEAR START CONDITIONS
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


/* =========================================================
   YEAR END EFFECTS
   ========================================================= */

function applyEndOfYearEffects() {

    if (state.bankrupt) {
        return;
    }

    /*
       Good reputation and R&D create compounding growth.
    */

    const reputationMultiplier =
        1 + ((state.reputation - 50) / 1000);

    state.companyValue *= reputationMultiplier;

    /*
       Market share contributes to valuation.
    */

    state.companyValue *=
        1 + (state.marketShare / 10000);

    /*
       Cash shortages hurt the company.
    */

    if (state.cash < 0) {
        state.companyValue *= 0.85;
        state.reputation -= 5;
    }

    state.companyValue = Math.max(
        0,
        state.companyValue
    );
}


/* =========================================================
   ACTION CARDS
   ========================================================= */

function renderYearActions() {
    const container =
        $("actionCards") ||
        $("actions") ||
        $("level3Actions");

    if (!container) {
        return;
    }

    container.innerHTML = "";

    const actions = getActionsForYear();

    actions.forEach(action => {
        const card = document.createElement("div");

        card.className = "action-card";

        card.innerHTML = `
            <h3>${action.title}</h3>
            <p>${action.description}</p>
            <button>${action.buttonText || "Choose"}</button>
        `;

        card.querySelector("button")
            .addEventListener("click", () => {
                executeAction(action);
            });

        container.appendChild(card);
    });
}


function getActionsForYear() {

    if (state.currentYear === 1) {
        return [
            {
                id: "product",
                title: "Develop a new product",
                description:
                    "Use your funding to build something customers actually want.",
                buttonText: "Develop"
            },
            {
                id: "marketing",
                title: "Invest in marketing",
                description:
                    "Spend money to attract customers and increase market share.",
                buttonText: "Market"
            },
            {
                id: "locations",
                title: "Open a new location",
                description:
                    "Expand your physical presence.",
                buttonText: "Expand"
            },
            {
                id: "self",
                title: "Spend investor money on yourself",
                description:
                    "Choose how much of the company's money to spend personally.",
                buttonText: "Spend"
            },
            {
                id: "rnd",
                title: "Invest in R&D",
                description:
                    "Fund research that could create long-term advantages.",
                buttonText: "Research"
            },
            {
                id: "salary",
                title: "Take a high salary",
                description:
                    "Pay yourself a large salary.",
                buttonText: "Take salary"
            }
        ];
    }

    return [
        {
            id: "product",
            title: "Develop a new product",
            description:
                "Invest in another product or feature.",
            buttonText: "Develop"
        },
        {
            id: "marketing",
            title: "Invest in marketing",
            description:
                "Increase customer acquisition.",
            buttonText: "Market"
        },
        {
            id: "rnd",
            title: "Invest in R&D",
            description:
                "Create a technological or operational advantage.",
            buttonText: "Research"
        },
        {
            id: "expand",
            title: "Expand operations",
            description:
                "Grow into another market.",
            buttonText: "Expand"
        },
        {
            id: "hire",
            title: "Hire employees",
            description:
                "Increase your team's capacity.",
            buttonText: "Hire"
        },
        {
            id: "salary",
            title: "Increase executive salaries",
            description:
                "Pay yourself and your executives more.",
            buttonText: "Increase"
        }
    ];
}


/* =========================================================
   ACTION EXECUTION
   ========================================================= */

function executeAction(action) {

    if (state.bankrupt) {
        return;
    }

    state.actionsThisYear++;

    switch (action.id) {

        case "product":
            developProduct();
            break;

        case "marketing":
            investMarketing();
            break;

        case "locations":
        case "expand":
            expandCompany();
            break;

        case "rnd":
            investRAndD();
            break;

        case "salary":
            takeHighSalary();
            break;

        case "self":
            openPersonalSpendingChoice();
            break;

        case "hire":
            hireEmployees();
            break;
    }

    updateLevel3Displays();
}


/* =========================================================
   ACTION CONSEQUENCES
   ========================================================= */

function developProduct() {
    const cost =
        state.currentYear <= 2
            ? 25000
            : 250000;

    state.cash -= cost;

    state.users +=
        state.currentYear * random(10000, 50000);

    state.revenue +=
        random(10000, 100000);

    state.companyValue *= 1.08;

    state.reputation += 3;

    showToast(
        "Product development paid off. Your company is growing."
    );
}


function investMarketing() {
    const cost =
        state.currentYear <= 2
            ? 20000
            : 200000;

    state.cash -= cost;

    state.users += random(25000, 150000);

    state.marketShare += random(1, 5);

    state.companyValue *= 1.06;

    showToast(
        "Marketing brought in new customers."
    );
}


function expandCompany() {
    const cost =
        state.currentYear <= 2
            ? 50000
            : 500000;

    state.cash -= cost;

    state.marketShare += random(1, 4);

    state.revenue += random(25000, 200000);

    state.companyValue *= 1.05;

    showToast(
        "Your company expanded its operations."
    );
}


function investRAndD() {
    const cost =
        state.currentYear <= 2
            ? 30000
            : 300000;

    state.cash -= cost;

    state.companyValue *= 1.12;

    state.reputation += 5;

    state.users += random(5000, 50000);

    showToast(
        "R&D created a long-term competitive advantage."
    );
}


function takeHighSalary() {
    const salary =
        state.currentYear <= 2
            ? 25000
            : 250000;

    state.cash -= salary;

    state.reputation -= 3;

    state.companyValue *= 0.97;

    showToast(
        "You paid yourself a high salary. Investors noticed."
    );
}


function hireEmployees() {
    const cost =
        state.currentYear <= 3
            ? 50000
            : 500000;

    state.cash -= cost;

    state.reputation += 2;

    state.revenue += random(25000, 150000);

    state.companyValue *= 1.05;

    showToast(
        "Your team is larger and can handle more work."
    );
}


/* =========================================================
   PERSONAL SPENDING
   ========================================================= */

function openPersonalSpendingChoice() {

    const amount =
        prompt(
            "How much investor money do you want to spend on yourself?\n\n" +
            "Enter 10, 50 or 100."
        );

    if (amount === null) {
        return;
    }

    const percentage = parseInt(amount, 10);

    if (![10, 50, 100].includes(percentage)) {
        showToast("Choose 10, 50 or 100.");
        return;
    }

    const spending =
        state.cash * (percentage / 100);

    state.cash -= spending;

    state.reputation -= percentage / 5;

    state.companyValue *=
        1 - (percentage / 500);

    showToast(
        "You spent " +
        percentage +
        "% of the company's cash on yourself."
    );

    updateLevel3Displays();
}


/* =========================================================
   YEAR 2 COFOUNDER EVENT
   ========================================================= */

function triggerCofounderEvent() {

    if (!state.cofounder) {
        return;
    }

    hideAllGameScreens();

    show("level3Event");
    show("eventScreen");

    setText(
        "eventTitle",
        "SURPRISE!"
    );

    setText(
        "eventText",
        "Your cofounder used the company debit card to buy " +
        "themself a Lamborghini. It cost the company $250,000."
    );

    setText(
        "eventExplanation",
        "Because the purchase was made using company money, " +
        "the company bears the financial loss. You must decide " +
        "whether to continue working with your cofounder or buy " +
        "out their ownership."
    );
}


function keepCofounder() {
    state.cash -= 250000;
    state.reputation -= 2;

    closeEventAndReturnToYear();

    showToast(
        "You kept your cofounder. The company absorbed the $250K loss."
    );
}


function removeCofounder() {

    /*
       A buyout means the company/founder purchases the
       cofounder's ownership interest. The exact amount is
       based on the company's current value.
    */

    const buyoutPrice =
        state.companyValue *
        (state.cofounderEquity / 100);

    state.cash -= buyoutPrice;

    state.cofounder = false;

    state.cofounderEquity = 0;

    state.reputation += 3;

    state.companyValue *= 1.05;

    closeEventAndReturnToYear();

    showToast(
        "You bought out your cofounder's shares for " +
        formatMoney(buyoutPrice) +
        ". You now own the company."
    );
}


function closeEventAndReturnToYear() {
    hideAllGameScreens();

    show("level3Game");
    show("yearScreen");

    updateLevel3Displays();
    renderYearActions();
    startYearTimer();
}


/* =========================================================
   YEAR 3 EVENTS
   ========================================================= */

function triggerYear3GoodEvent() {

    hideAllGameScreens();

    show("level3Event");
    show("eventScreen");

    setText(
        "eventTitle",
        "GOOD NEWS!"
    );

    if (state.industry === "tech") {

        setText(
            "eventText",
            "You have been featured in a technology magazine."
        );

        setText(
            "eventExplanation",
            "The article calls your company a 'New disruptive startup.' " +
            "The magazine feature gives you free advertising and " +
            "increases your market share."
        );

        state.marketShare =
            clamp(state.marketShare + 14.5, 0, 100);

        state.companyValue *= 1.15;

    } else {

        setText(
            "eventText",
            "You won a government grant and a small-business loan worth $10 million combined."
        );

        setText(
            "eventExplanation",
            "The grant does not have to be repaid. The loan does. " +
            "The additional capital gives your company more runway."
        );

        state.cash += 10000000;
        state.companyValue *= 1.10;
    }

    updateLevel3Displays();
}


function closeYear3Event() {
    closeEventAndReturnToYear();
}


/* =========================================================
   YEAR 8 RECESSION
   ========================================================= */

function triggerRecessionEvent() {

    hideAllGameScreens();

    show("level3Event");
    show("eventScreen");

    setText(
        "eventTitle",
        "RECESSION"
    );

    setText(
        "eventText",
        "The economy has entered a recession."
    );

    setText(
        "eventExplanation",
        "Customers and investors are becoming more cautious. " +
        "Companies with strong cash reserves and disciplined spending " +
        "have a better chance of surviving the downturn."
    );

    state.companyValue *= 0.85;
    state.revenue *= 0.85;
    state.marketShare *= 0.95;

    updateLevel3Displays();
}


/* =========================================================
   YEAR 9 IRS AUDIT
   ========================================================= */

function triggerAuditEvent() {

    hideAllGameScreens();

    show("level3Event");
    show("eventScreen");

    setText(
        "eventTitle",
        "IRS AUDIT"
    );

    setText(
        "eventText",
        "The IRS has selected your company for an audit."
    );

    setText(
        "eventExplanation",
        "An audit examines whether your company properly reported " +
        "income, expenses and other tax information. Poor financial " +
        "records can create additional costs and reputational damage."
    );

    state.cash -= random(25000, 250000);

    state.reputation -= 5;

    state.companyValue *= 0.95;

    if (state.industry === "tech") {
        state.marketShare *= 0.90;
    }

    updateLevel3Displays();
}


/* =========================================================
   YEAR 10 CUSTOMER LOSS
   ========================================================= */

function triggerYear10Event() {

    hideAllGameScreens();

    show("level3Event");
    show("eventScreen");

    setText(
        "eventTitle",
        "CUSTOMERS ARE LEAVING"
    );

    state.users *= 0.75;

    state.revenue *= 0.75;

    state.marketShare *= 0.75;

    state.companyValue *= 0.70;

    if (state.industry === "tech") {

        setText(
            "eventText",
            "Your company has lost too many customers and can no longer sustain its operations."
        );

        setText(
            "eventExplanation",
            "Your technology company has reached bankruptcy."
        );

        state.bankrupt = true;

    } else {

        setText(
            "eventText",
            "Your company is no longer profitable and is approaching bankruptcy."
        );

        setText(
            "eventExplanation",
            "You are not technically bankrupt yet, but the company is in serious financial trouble."
        );
    }

    updateLevel3Displays();
}


/* =========================================================
   YEAR-SPECIFIC EVENT HOOK
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


/* =========================================================
   OVERRIDE YEAR TRANSITION
   ========================================================= */

const originalEndCurrentYear = endCurrentYear;

function advanceYear() {

    clearInterval(state.timer);

    if (checkYearEvents()) {
        return;
    }

    originalEndCurrentYear();
}


/* =========================================================
   DIALOGS
   ========================================================= */

function showYearDialog(title, text) {

    const dialog =
        $("dialog") ||
        $("level3Dialog");

    if (dialog) {
        dialog.style.display = "";
    }

    setText("dialogTitle", title);
    setText("dialogText", text);
}


function closeDialog() {

    const dialog =
        $("dialog") ||
        $("level3Dialog");

    if (dialog) {
        dialog.style.display = "none";
    }
}


/* =========================================================
   TOAST
   ========================================================= */

function showToast(message) {

    let toast = $("toast");

    if (!toast) {
        toast = document.createElement("div");
        toast.id = "toast";
        toast.className = "toast";
        document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 3000);
}


/* =========================================================
   DISPLAY UPDATES
   ========================================================= */

function updateLevel3Displays() {

    setText(
        "companyValue",
        formatMoney(state.companyValue)
    );

    setText(
        "computerValue",
        formatMoney(state.computerValue)
    );

    setText(
        "cashValue",
        formatMoney(state.cash)
    );

    setText(
        "usersValue",
        formatUsers(state.users)
    );

    setText(
        "revenueValue",
        formatMoney(state.revenue)
    );

    setText(
        "marketShare",
        state.marketShare.toFixed(1) + "%"
    );

    setText(
        "reputationValue",
        Math.round(state.reputation)
    );

    setText(
        "yearNumber",
        state.currentYear
    );

    updateProgressBar();
    updateCompanyPie();
    updateComputerAI();
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


/* =========================================================
   10-YEAR PROGRESS BAR
   ========================================================= */

function updateProgressBar() {

    const container =
        $("yearProgress") ||
        $("progressBar") ||
        $("timeline");

    if (!container) {
        return;
    }

    const boxes =
        container.querySelectorAll(
            ".year-box, .progress-box, .year"
        );

    boxes.forEach((box, index) => {

        box.classList.remove(
            "completed",
            "current"
        );

        if (index + 1 < state.currentYear) {
            box.classList.add("completed");
        }

        if (index + 1 === state.currentYear) {
            box.classList.add("current");
        }
    });
}


/* =========================================================
   COMPANY VALUE PIE CHART
   ========================================================= */

function updateCompanyPie() {

    const pie =
        $("companyPie") ||
        $("valuePie");

    if (!pie) {
        return;
    }

    const normalized =
        clamp(
            Math.log10(
                Math.max(state.companyValue, 1000)
            ) / 10,
            0.02,
            1
        );

    const degrees =
        normalized * 360;

    pie.style.background =
        `conic-gradient(
            currentColor 0deg ${degrees}deg,
            rgba(255,255,255,0.12) ${degrees}deg 360deg
        )`;
}


/* =========================================================
   COMPUTER COMPETITOR
   ========================================================= */

function updateComputerAI() {

    /*
       The computer makes reasonable decisions automatically.
       It does not simply copy the player.
    */

    const growthRate =
        random(3, 10) / 100;

    state.computerValue *=
        1 + growthRate;

    /*
       Good years give the computer stronger growth.
    */

    if (
        state.currentYear === 3 ||
        state.currentYear === 5 ||
        state.currentYear === 7
    ) {
        state.computerValue *= 1.08;
    }

    /*
       Recession.
    */

    if (state.currentYear === 8) {
        state.computerValue *= 0.88;
    }

    /*
       Audit.
    */

    if (state.currentYear === 9) {
        state.computerValue *= 0.93;
    }

    /*
       Final customer loss.
    */

    if (state.currentYear === 10) {
        state.computerValue *= 0.75;
    }
}


/* =========================================================
   FINAL SCREEN
   ========================================================= */

function finishLevel3() {

    clearInterval(state.timer);

    state.yearStarted = false;

    hideAllGameScreens();

    show("level3Final");
    show("finalScreen");

    const playerValue =
        Math.max(0, state.companyValue);

    const computerValue =
        Math.max(0, state.computerValue);

    setText(
        "finalPlayerValue",
        formatMoney(playerValue)
    );

    setText(
        "finalComputerValue",
        formatMoney(computerValue)
    );

    let result;

    if (playerValue > computerValue) {
        result = "YOU WIN!";
    } else if (computerValue > playerValue) {
        result = "THE COMPUTER WINS!";
    } else {
        result = "IT'S A TIE!";
    }

    setText(
        "finalResult",
        result
    );

    setText(
        "finalCompanyName",
        state.startupType
            ? state.startupType.name
            : "Your Company"
    );

    updateFinalStats();
}


function updateFinalStats() {

    setText(
        "finalUsers",
        formatUsers(state.users)
    );

    setText(
        "finalRevenue",
        formatMoney(state.revenue)
    );

    setText(
        "finalMarketShare",
        state.marketShare.toFixed(1) + "%"
    );

    setText(
        "finalReputation",
        Math.round(state.reputation)
    );
}


/* =========================================================
   LEVEL 3 RESTART
   ========================================================= */

function restartLevel3() {

    clearInterval(state.timer);

    state.currentYear = 1;
    state.industry = null;
    state.startupType = null;
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

    initializeLevel3();
}


/* =========================================================
   BUTTON HANDLERS
   ========================================================= */

document.addEventListener("click", event => {

   const target = event.target;

   if (target.matches("#btnPlayNow")) {
        hideAllGameScreens();
        show("screen-menu");
    }

    if (
        target.matches(
            "#startFunding, [data-action='start-funding']"
        )
    ) {
        startFundingSimulator();
    }

    if (
        target.matches(
            "#chooseTech, [data-industry='tech']"
        )
    ) {
        chooseIndustry("tech");
    }

    if (
        target.matches(
            "#chooseNonTech, [data-industry='nontech']"
        )
    ) {
        chooseIndustry("nontech");
    }

    if (
        target.matches(
            "#spinButton, [data-action='spin']"
        )
    ) {
        spinIndustry();
    }

    if (
        target.matches(
            "#startYearOne, [data-action='start-year']"
        )
    ) {
        startYearOne();
    }

    if (
        target.matches(
            "#keepCofounder, [data-action='keep-cofounder']"
        )
    ) {
        keepCofounder();
    }

    if (
        target.matches(
            "#removeCofounder, [data-action='remove-cofounder']"
        )
    ) {
        removeCofounder();
    }

    if (
        target.matches(
            "#closeEvent, [data-action='close-event']"
        )
    ) {
        closeEventAndReturnToYear();
    }

    if (
        target.matches(
            "#restartLevel3, [data-action='restart']"
        )
    ) {
        restartLevel3();
    }

    if (
        target.matches(
            "#finalMenu, [data-action='menu']"
        )
    ) {
        goToMenu();
    }

    if (
        target.matches(
            "#finalHome, [data-action='home']"
        )
    ) {
        goHome();
    }
});


/* =========================================================
   SEED FUNDING EXPLANATION
   ========================================================= */

function showSeedFundingExplanation() {

    const explanation =
        $("seedFundingExplanation");

    if (!explanation) {
        return;
    }

    explanation.textContent =
        "Pre-seed funding is early-stage money used to help a startup " +
        "turn an idea into a real business. It can pay for early product " +
        "development, research, hiring, equipment, marketing and other " +
        "startup expenses before the company has established significant revenue.";

    explanation.style.display = "";
}


/* =========================================================
   RUNWAY EXPLANATION
   ========================================================= */

function showRunwayExplanation() {

    const explanation =
        $("runwayExplanation");

    if (!explanation) {
        return;
    }

    explanation.textContent =
        "Runway is the amount of time a company can continue operating " +
        "before it runs out of cash. Six months of runway means the company " +
        "could continue operating for roughly six more months at its current " +
        "rate of spending.";

    explanation.style.display = "";
}


/* =========================================================
   EXPORTS
   ========================================================= */

window.goHome = goHome;
window.goToMenu = goToMenu;
window.selectLevel = selectLevel;

window.startFundingSimulator = startFundingSimulator;
window.chooseIndustry = chooseIndustry;
window.spinIndustry = spinIndustry;
window.startYearOne = startYearOne;

window.keepCofounder = keepCofounder;
window.removeCofounder = removeCofounder;

window.restartLevel3 = restartLevel3;
window.finishLevel3 = finishLevel3;

window.showSeedFundingExplanation =
    showSeedFundingExplanation;

window.showRunwayExplanation =
    showRunwayExplanation;
