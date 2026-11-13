// Headless balance simulator for shipE.
// Loads the real game.js into a stubbed DOM and plays N games per bot strategy.
// Usage: node balance-sim.js path/to/game.js [gamesPerStrategy] [trace strategy industry]
// Set DIFF=hard to test Hard mode. Rival strength lives in DIFFICULTY in game.js.
const fs = require("fs");
const vm = require("vm");

const file = process.argv[2];
const N = parseInt(process.argv[3] || "2000", 10);
const src = fs.readFileSync(file, "utf8");

function makeContext() {
    const noopEl = () => ({
        style: {}, classList: { add() {}, remove() {} }, appendChild() {},
        querySelectorAll: () => [], querySelector: () => null, addEventListener() {}
    });
    const document = {
        getElementById: () => null,
        querySelectorAll: () => [],
        querySelector: () => null,
        createElement: noopEl,
        addEventListener() {},
        body: { appendChild() {} }
    };
    const ctx = {
        document, console, Math, Number, String, parseInt, Object, Array, JSON,
        getComputedStyle: () => ({ position: "relative" }),
        setInterval: () => 0, clearInterval() {}, setTimeout: () => 0, clearTimeout() {},
        localStorage: { getItem: () => null, setItem() {} }
    };
    ctx.globalThis = ctx;
    vm.createContext(ctx);
    vm.runInContext(src + "\n;globalThis.S = state;", ctx);
    return ctx;
}

const ctx = makeContext();
const S = ctx.S;

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

// Strategies return the action ids to try this year (in order).
const STRATEGIES = {
    random:   () => [0, 1, 2].map(() => pick(["product", "marketing", "expansion", "rd", "salary"])),
    rdSpam:   () => ["rd", "rd", "rd"],
    balanced: (y) => y % 2 ? ["product", "rd", "marketing"] : ["expansion", "rd", "product"],
    idle:     () => [],
    greedy:   () => ["rd", "product", "expansion"],
    pme:      () => ["product", "marketing", "expansion"],
    smart:    (y) => y <= 4 ? ["rd", "product", "marketing"] : ["product", "marketing", "expansion"],
};
// Event choice policies.
const EVENT_POLICY = {
    random: ev => pick(ev.choices),
    first: ev => ev.choices[0],
    // "sensible": prefer a choice whose label suggests the careful option
    sensible: ev => ev.choices.find(c => /traction|Renegotiate|focused|Grant only|counter|equity|compliance|Overhaul|scanner|Publish|Lock in|non-exclusive|first-party|Decline|Stay private|Invest through|Cooperate|Pivot|Adapt|more tests|Open-core|Absorb/i.test(c.label)) || ev.choices[0],
};

function playGame(strategy, policy, industry) {
    ctx.initializeGame(); S.difficulty = process.env.DIFF || "normal";
    
    S.industry = industry;
    const list = industry === "tech" ? ctx.TECH_INDUSTRIES_REF() : ctx.NONTECH_INDUSTRIES_REF();
    S.startupType = pick(list);
    ctx.startYearOne();
    const trace = [];
    let guard = 0;
    while (guard++ < 20) {
        const year = S.currentYear;
        for (const id of STRATEGIES[strategy](year)) {
            const a = ctx.getActionsForYear().find(x => x.id === id);
            if (a && S.cash >= a.cost && S.actionsThisYear < ctx.MAX_ACTIONS_REF()) ctx.executeAction(a);
        }
        trace.push({ rmoves: (S.rival.lastMoves||[]).join("+"), rcash: S.rival.cash, rrd: S.rival.rdLevel, rrep: S.rival.reputation, sent: S.sentiment, rd: S.rdLevel, sh: S.marketShare, rep: S.reputation, rsh: S.rival.marketShare, y: year, v: S.companyValue, c: S.computerValue, cash: S.cash, rev: S.revenue, users: S.users });
        // end of year: event then year end
        S.yearStarted = false;
        const ev = ctx.buildYearEvent(year);
        if (ev) {
            const choice = EVENT_POLICY[policy](ev);
            const outcome = choice.apply();
            ctx.clampState();
        }
        const before = S.currentYear;
        ctx.endCurrentYear();
        if (S.bankrupt || S.currentYear === before) break;
    }
    return { win: !S.bankrupt && S.companyValue > S.computerValue, bankrupt: S.bankrupt, v: S.companyValue, c: S.computerValue, trace };
}

// expose consts declared with const/let (not on global)
vm.runInContext(`
globalThis.TECH_INDUSTRIES_REF = () => TECH_INDUSTRIES;
globalThis.NONTECH_INDUSTRIES_REF = () => NONTECH_INDUSTRIES;
globalThis.MAX_ACTIONS_REF = () => MAX_ACTIONS_PER_YEAR;
`, ctx);

const fmt = v => v >= 1e9 ? (v / 1e9).toFixed(2) + "B" : v >= 1e6 ? (v / 1e6).toFixed(1) + "M" : (v / 1e3).toFixed(0) + "K";
const median = a => { const s = [...a].sort((x, y) => x - y); return s[Math.floor(s.length / 2)]; };

console.log(`file: ${file}, games per cell: ${N}`);
console.log("strategy  policy    industry  win%   bankrupt%  medianPlayer  medianRival");
for (const strategy of Object.keys(STRATEGIES)) {
    for (const policy of ["sensible", "random"]) {
        for (const industry of ["tech", "nontech"]) {
            let wins = 0, bk = 0; const vs = [], cs = [];
            for (let i = 0; i < N; i++) {
                const r = playGame(strategy, policy, industry);
                if (r.win) wins++; if (r.bankrupt) bk++;
                vs.push(r.v); cs.push(r.c);
            }
            console.log(`${strategy.padEnd(9)} ${policy.padEnd(9)} ${industry.padEnd(9)} ${(wins / N * 100).toFixed(0).padStart(4)}%  ${(bk / N * 100).toFixed(0).padStart(6)}%    ${fmt(median(vs)).padStart(9)}    ${fmt(median(cs)).padStart(9)}`);
        }
    }
}

if (process.argv[4] === "trace") {
    const r = playGame(process.argv[5] || "balanced", "sensible", process.argv[6] || "tech");
    console.log("\nSample trace (balanced, sensible, tech):");
    r.trace.forEach(t => console.log(`Y${t.y}: value ${fmt(t.v)}  rival ${fmt(t.c)}  cash ${fmt(t.cash)}  revenue ${fmt(t.rev)}  users ${Math.round(t.users)}  sent ${t.sent.toFixed(2)} rd ${t.rd.toFixed(1)} share ${t.sh.toFixed(1)}/${t.rsh.toFixed(1)} rep ${Math.round(t.rep)}/${Math.round(t.rrep)} | rival cash ${fmt(t.rcash)} rd ${t.rrd.toFixed(1)} moves ${t.rmoves}`));
    console.log(`final: ${fmt(r.v)} vs ${fmt(r.c)}`);
}
