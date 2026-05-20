const STORAGE_KEY = "tennisrunde-saison-v1";
const CONFIG = window.BODENSEERUNDE_CONFIG || {};
let remoteStoreEnabled = false;
let storageMode = "local";

const demoState = {
  year: 2026,
  selectedGroupId: "A",
  groups: [
    {
      id: "A",
      name: "Gruppe A",
      startDate: "2026-05-06",
      intervalDays: 7,
      teams: [
        "TC-Bregenz",
        "TC-Nonnenhorn2",
        "TC-Scheidegg",
        "TC-Langenargen1",
        "TC-Lauterach",
        "SPG-Oberreitnau/Bodolz"
      ],
      matches: [
        match("A-1", 1, "2026-05-06", "TC-Bregenz", "TC-Nonnenhorn2", 36, 11, 6, 0, 3, 0),
        match("A-2", 1, "2026-05-06", "TC-Scheidegg", "TC-Langenargen1", 16, 37, 1, 6, 0, 3),
        match("A-3", 1, "2026-05-06", "TC-Lauterach", "SPG-Oberreitnau/Bodolz", 17, 32, 2, 4, 1, 2),
        match("A-4", 2, "2026-05-14", "TC-Langenargen1", "TC-Bregenz", 37, 12, 6, 0, 3, 0),
        match("A-5", 2, "2026-05-13", "TC-Nonnenhorn2", "TC-Lauterach", 18, 35, 1, 6, 0, 3),
        match("A-6", 2, "2026-05-13", "SPG-Oberreitnau/Bodolz", "TC-Scheidegg", 26, 22, 4, 3, 2, 1),
        match("A-7", 3, "2026-05-20", "TC-Bregenz", "TC-Lauterach"),
        match("A-8", 3, "2026-05-21", "TC-Langenargen1", "SPG-Oberreitnau/Bodolz"),
        match("A-9", 3, "2026-05-20", "TC-Scheidegg", "TC-Nonnenhorn2"),
        match("A-10", 4, "2026-05-26", "SPG-Oberreitnau/Bodolz", "TC-Bregenz"),
        match("A-11", 4, "2026-05-27", "TC-Lauterach", "TC-Scheidegg"),
        match("A-12", 4, "2026-05-27", "TC-Nonnenhorn2", "TC-Langenargen1"),
        match("A-13", 5, "2026-06-03", "TC-Bregenz", "TC-Scheidegg"),
        match("A-14", 5, "2026-06-03", "SPG-Oberreitnau/Bodolz", "TC-Nonnenhorn2"),
        match("A-15", 5, "2026-06-04", "TC-Langenargen1", "TC-Lauterach")
      ]
    },
    {
      id: "B",
      name: "Gruppe B",
      startDate: "2026-05-06",
      intervalDays: 7,
      teams: [
        "TC-Lindau",
        "TC-Nonnenhorn1",
        "ESV-Wolfurt",
        "TC-Sigmarszell",
        "TC-Langenargen2"
      ],
      matches: [
        match("B-1", 1, "2026-05-06", "TC-Lindau", "TC-Nonnenhorn1", 20, 35, 2, 5, 1, 2),
        match("B-2", 1, "2026-05-06", "ESV-Wolfurt", "TC-Sigmarszell", 37, 10, 6, 0, 3, 0),
        match("B-3", 2, "2026-05-13", "TC-Sigmarszell", "TC-Lindau", 37, 14, 6, 1, 3, 0),
        match("B-4", 2, "2026-05-13", "TC-Nonnenhorn1", "TC-Langenargen2", 36, 12, 6, 0, 3, 0),
        match("B-5", 3, "2026-05-20", "TC-Lindau", "TC-Langenargen2"),
        match("B-6", 3, "2026-05-20", "ESV-Wolfurt", "TC-Nonnenhorn1"),
        match("B-7", 4, "2026-05-27", "TC-Langenargen2", "ESV-Wolfurt"),
        match("B-8", 4, "2026-05-27", "TC-Nonnenhorn1", "TC-Sigmarszell"),
        match("B-9", 5, "2026-06-03", "TC-Lindau", "ESV-Wolfurt"),
        match("B-10", 5, "2026-06-03", "TC-Sigmarszell", "TC-Langenargen2")
      ]
    }
  ],
  updatedAt: null
};

let state = structuredClone(demoState);

const els = {
  tabs: document.querySelectorAll(".tab"),
  views: document.querySelectorAll(".view"),
  overviewGrid: document.querySelector("#overviewGrid"),
  lastUpdated: document.querySelector("#lastUpdated"),
  seasonYear: document.querySelector("#seasonYear"),
  addGroup: document.querySelector("#addGroup"),
  groupList: document.querySelector("#groupList"),
  groupName: document.querySelector("#groupName"),
  seasonStart: document.querySelector("#seasonStart"),
  roundInterval: document.querySelector("#roundInterval"),
  teamsInput: document.querySelector("#teamsInput"),
  saveGroup: document.querySelector("#saveGroup"),
  generateSchedule: document.querySelector("#generateSchedule"),
  manualDate: document.querySelector("#manualDate"),
  manualHome: document.querySelector("#manualHome"),
  manualAway: document.querySelector("#manualAway"),
  addMatch: document.querySelector("#addMatch"),
  scheduleEditor: document.querySelector("#scheduleEditor"),
  resultGroup: document.querySelector("#resultGroup"),
  resultMatch: document.querySelector("#resultMatch"),
  selectedMatch: document.querySelector("#selectedMatch"),
  lockedNotice: document.querySelector("#lockedNotice"),
  doublesRows: document.querySelector("#doublesRows"),
  calculateResult: document.querySelector("#calculateResult"),
  saveResult: document.querySelector("#saveResult"),
  computedResult: document.querySelector("#computedResult"),
  reportFile: document.querySelector("#reportFile"),
  reportList: document.querySelector("#reportList"),
  approvedBy: document.querySelector("#approvedBy"),
  approveResult: document.querySelector("#approveResult"),
  unlockResult: document.querySelector("#unlockResult"),
  linkList: document.querySelector("#linkList")
};

function match(id, round, date, home, away, gamesHome = null, gamesAway = null, setsHome = null, setsAway = null, pointsHome = null, pointsAway = null) {
  return {
    id,
    round,
    date,
    home,
    away,
    gamesHome,
    gamesAway,
    setsHome,
    setsAway,
    pointsHome,
    pointsAway,
    doubles: [],
    reports: [],
    locked: false,
    approvedBy: null,
    approvedAt: null
  };
}

async function loadState() {
  const remote = await loadRemoteState();
  if (remote) return remote;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) return structuredClone(demoState);
  try {
    return JSON.parse(saved);
  } catch {
    return structuredClone(demoState);
  }
}

async function saveState() {
  state.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  render();
  await saveRemoteState();
}

function configureRemoteStore() {
  const hasConfig = CONFIG.supabaseUrl && CONFIG.supabaseAnonKey;
  if (!hasConfig) {
    storageMode = "local";
    return;
  }
  remoteStoreEnabled = true;
  storageMode = "online";
}

async function loadRemoteState() {
  if (!remoteStoreEnabled) return null;
  const seasonId = CONFIG.seasonId || String(demoState.year);
  try {
    const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/app_state?id=eq.${encodeURIComponent(seasonId)}&select=data`, {
      headers: remoteHeaders()
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const rows = await response.json();
    const data = rows[0];
    if (!data || !data.data || Object.keys(data.data).length === 0) {
      await saveRemoteState(structuredClone(demoState));
      return structuredClone(demoState);
    }
    storageMode = "online";
    return data.data;
  } catch (error) {
    console.warn("Online-Daten konnten nicht geladen werden.", error);
    storageMode = "local";
    return null;
  }
}

async function saveRemoteState(nextState = state) {
  if (!remoteStoreEnabled) return;
  const seasonId = CONFIG.seasonId || String(nextState.year || demoState.year);
  try {
    const response = await fetch(`${CONFIG.supabaseUrl}/rest/v1/app_state`, {
      method: "POST",
      headers: {
        ...remoteHeaders(),
        "Content-Type": "application/json",
        "Prefer": "resolution=merge-duplicates"
      },
      body: JSON.stringify({
        id: seasonId,
        data: nextState,
        updated_at: new Date().toISOString()
      })
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
  } catch (error) {
    console.warn("Online-Daten konnten nicht gespeichert werden.", error);
    storageMode = "local";
    render();
  }
}

function remoteHeaders() {
  return {
    "apikey": CONFIG.supabaseAnonKey,
    "Authorization": `Bearer ${CONFIG.supabaseAnonKey}`
  };
}

function currentGroup() {
  return state.groups.find(group => group.id === state.selectedGroupId) || state.groups[0];
}

function isBye(team) {
  return team === "* Freilos *";
}

function hasResult(matchItem) {
  normalizeMatch(matchItem);
  return [matchItem.gamesHome, matchItem.gamesAway, matchItem.setsHome, matchItem.setsAway, matchItem.pointsHome, matchItem.pointsAway]
    .every(value => value !== null && value !== "" && !Number.isNaN(Number(value)));
}

function normalizeMatch(matchItem) {
  if (!Array.isArray(matchItem.doubles)) {
    matchItem.doubles = [];
  }
  if (!Array.isArray(matchItem.reports)) {
    matchItem.reports = [];
  }
  if (typeof matchItem.locked !== "boolean") {
    matchItem.locked = false;
  }
  for (let index = 0; index < 3; index += 1) {
    if (!matchItem.doubles[index]) {
      matchItem.doubles[index] = emptyDouble(index + 1);
    }
  }
}

function emptyDouble(number) {
  return {
    number,
    sets: [
      { home: "", away: "" },
      { home: "", away: "" },
      { home: "", away: "" }
    ]
  };
}

function formatDate(dateText) {
  if (!dateText) return "ohne Datum";
  return new Intl.DateTimeFormat("de-DE", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(`${dateText}T12:00:00`));
}

function render() {
  els.seasonYear.value = state.year;
  els.lastUpdated.textContent = state.updatedAt
    ? `${storageMode === "online" ? "Online gespeichert" : "Lokal gespeichert"} ${new Intl.DateTimeFormat("de-DE", { dateStyle: "short", timeStyle: "short" }).format(new Date(state.updatedAt))}`
    : `${storageMode === "online" ? "Online verbunden" : "Lokale Demo"} - noch nicht gespeichert`;
  renderOverview();
  renderPlanning();
  renderResults();
}

function renderOverview() {
  els.overviewGrid.innerHTML = "";
  state.groups.forEach(group => {
    const template = document.querySelector("#tableTemplate").content.cloneNode(true);
    const groupBlock = template.querySelector(".group-block");
    groupBlock.dataset.groupId = group.id;
    template.querySelector("h3").textContent = group.name;
    const realTeams = group.teams.filter(team => !isBye(team)).length;
    template.querySelector(".block-head span").textContent = `${realTeams} Mannschaften`;
    template.querySelector(".table-wrap").innerHTML = standingsTable(calculateStandings(group));
    const openMatches = group.matches
      .filter(item => !hasResult(item))
      .filter(item => !isBye(item.home) && !isBye(item.away))
      .sort((a, b) => `${a.date}-${a.round}`.localeCompare(`${b.date}-${b.round}`));
    const nextRound = openMatches[0]?.round;
    const next = openMatches.filter(item => item.round === nextRound);
    const rest = openMatches.filter(item => item.round !== nextRound);
    template.querySelector(".next-matches").innerHTML = openMatches.length
      ? `
        ${next.map(item => `
          <div class="match-row">
            <span>${formatDate(item.date)}</span>
            <strong>${item.home} - ${item.away}</strong>
            <span>Runde ${item.round}</span>
          </div>
        `).join("")}
        ${rest.map(item => `
          <div class="match-row extra-match" hidden>
            <span>${formatDate(item.date)}</span>
            <strong>${item.home} - ${item.away}</strong>
            <span>Runde ${item.round}</span>
          </div>
        `).join("")}
      `
      : `<div class="empty">Alle Ergebnisse sind erfasst.</div>`;
    const toggleButton = template.querySelector(".toggle-extra-matches");
    toggleButton.hidden = rest.length === 0;
    toggleButton.textContent = `Restliche Spiele anzeigen (${rest.length})`;
    const played = group.matches
      .filter(hasResult)
      .filter(item => !isBye(item.home) && !isBye(item.away))
      .sort((a, b) => `${b.date}-${b.round}`.localeCompare(`${a.date}-${a.round}`));
    template.querySelector(".played-matches").innerHTML = played.length
      ? played.map(item => `
          <div class="match-row played">
            <span>${formatDate(item.date)}</span>
            <strong>${item.home} - ${item.away}</strong>
            <span class="result-badge">${item.pointsHome}:${item.pointsAway} Doppel</span>
            <span>Saetze ${item.setsHome}:${item.setsAway}<br>Spiele ${item.gamesHome}:${item.gamesAway}</span>
            ${reportIcon(item)}
          </div>
        `).join("")
      : `<div class="empty">Noch keine Ergebnisse erfasst.</div>`;
    els.overviewGrid.appendChild(template);
  });
}

function reportIcon(matchItem) {
  normalizeMatch(matchItem);
  const report = matchItem.reports.find(item => reportDataUrl(item));
  if (!report) {
    return `<span class="report-icon empty-report" title="Kein Spielbericht">-</span>`;
  }
  return `
    <button class="report-icon" type="button" data-report-match="${matchItem.id}" title="Spielbericht oeffnen">
      <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <path d="M14 2v6h6"></path>
        <path d="M8 13h8"></path>
        <path d="M8 17h5"></path>
      </svg>
    </button>
  `;
}

function reportDataUrl(report) {
  return report?.dataUrl || report?.data_url || report?.url || "";
}

function openReport(matchId) {
  const matchItem = state.groups
    .flatMap(group => group.matches)
    .find(item => item.id === matchId);
  const report = matchItem?.reports?.find(item => reportDataUrl(item));
  const dataUrl = reportDataUrl(report);
  if (!dataUrl) {
    alert("Zu diesem Ergebnis ist kein Spielbericht gespeichert.");
    return;
  }
  const reportWindow = window.open("", "_blank", "noopener");
  if (!reportWindow) {
    alert("Der Spielbericht konnte nicht geoeffnet werden. Bitte Pop-up-Blocker pruefen.");
    return;
  }
  reportWindow.document.write(`<!doctype html><title>${report.name || "Spielbericht"}</title><style>html,body{margin:0;height:100%;}iframe{border:0;width:100%;height:100%;}</style><iframe src="${dataUrl}"></iframe>`);
  reportWindow.document.close();
}

function standingsTable(rows) {
  return `
    <table>
      <thead>
        <tr>
          <th class="number">Platz</th>
          <th>Mannschaft</th>
          <th class="number">Sp.</th>
          <th class="number">Spiele</th>
          <th class="number">Saetze</th>
          <th class="number">Punkte</th>
        </tr>
      </thead>
      <tbody>
        ${rows.map((row, index) => `
          <tr>
            <td class="number">${index + 1}</td>
            <td>${row.team}</td>
            <td class="number">${row.played}</td>
            <td class="number">${row.gamesFor}:${row.gamesAgainst}</td>
            <td class="number">${row.setsFor}:${row.setsAgainst}</td>
            <td class="number">${row.pointsFor}:${row.pointsAgainst}</td>
          </tr>
        `).join("")}
      </tbody>
    </table>
  `;
}

function calculateStandings(group) {
  const table = new Map();
  group.teams.filter(team => !isBye(team)).forEach(team => {
    table.set(team, {
      team,
      played: 0,
      gamesFor: 0,
      gamesAgainst: 0,
      setsFor: 0,
      setsAgainst: 0,
      pointsFor: 0,
      pointsAgainst: 0
    });
  });

  group.matches.filter(hasResult).forEach(item => {
    if (isBye(item.home) || isBye(item.away)) return;
    addResult(table.get(item.home), item.gamesHome, item.gamesAway, item.setsHome, item.setsAway, item.pointsHome, item.pointsAway);
    addResult(table.get(item.away), item.gamesAway, item.gamesHome, item.setsAway, item.setsHome, item.pointsAway, item.pointsHome);
  });

  return [...table.values()].sort((a, b) => {
    const pointsFor = b.pointsFor - a.pointsFor;
    if (pointsFor) return pointsFor;
    const pointDiff = (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
    if (pointDiff) return pointDiff;
    const setDiff = (b.setsFor - b.setsAgainst) - (a.setsFor - a.setsAgainst);
    if (setDiff) return setDiff;
    const gameDiff = (b.gamesFor - b.gamesAgainst) - (a.gamesFor - a.gamesAgainst);
    if (gameDiff) return gameDiff;
    return a.team.localeCompare(b.team, "de");
  });
}

function addResult(row, gamesFor, gamesAgainst, setsFor, setsAgainst, pointsFor, pointsAgainst) {
  row.played += 1;
  row.gamesFor += Number(gamesFor);
  row.gamesAgainst += Number(gamesAgainst);
  row.setsFor += Number(setsFor);
  row.setsAgainst += Number(setsAgainst);
  row.pointsFor += Number(pointsFor);
  row.pointsAgainst += Number(pointsAgainst);
}

function renderPlanning() {
  const group = currentGroup();
  if (!group) return;
  els.groupList.innerHTML = state.groups.map(item => `
    <button type="button" class="${item.id === group.id ? "active" : ""}" data-group-id="${item.id}">
      <strong>${item.name}</strong><br>
      <span>${item.teams.filter(team => !isBye(team)).length} Mannschaften</span>
    </button>
  `).join("");
  els.groupName.value = group.name;
  els.seasonStart.value = group.startDate || "";
  els.roundInterval.value = String(group.intervalDays || 7);
  els.teamsInput.value = group.teams.filter(team => !isBye(team)).join("\n");
  renderTeamSelects(group);
  renderScheduleEditor(group);
}

function renderTeamSelects(group) {
  const options = group.teams.filter(team => !isBye(team)).map(team => `<option value="${team}">${team}</option>`).join("");
  els.manualHome.innerHTML = options;
  els.manualAway.innerHTML = options;
}

function renderScheduleEditor(group) {
  const realMatches = group.matches.filter(item => !isBye(item.home) && !isBye(item.away));
  const teamOptions = group.teams
    .filter(team => !isBye(team))
    .map(team => `<option value="${team}">${team}</option>`)
    .join("");
  els.scheduleEditor.innerHTML = realMatches.length
    ? realMatches.map(item => `
        <div class="schedule-row" data-match-id="${item.id}">
          <input type="number" min="1" value="${item.round}" aria-label="Runde">
          <input type="date" value="${item.date}" aria-label="Datum">
          <select aria-label="Heim">${teamOptions.replace(`value="${item.home}"`, `value="${item.home}" selected`)}</select>
          <select aria-label="Gast">${teamOptions.replace(`value="${item.away}"`, `value="${item.away}" selected`)}</select>
          <button type="button" class="secondary" data-delete-match="${item.id}">Loeschen</button>
        </div>
      `).join("")
    : `<div class="empty">Noch kein Spielplan vorhanden.</div>`;
}

function renderResults() {
  const group = currentGroup();
  const previousMatchId = els.resultMatch.value;
  els.resultGroup.innerHTML = state.groups.map(item => `<option value="${item.id}">${item.name}</option>`).join("");
  els.resultGroup.value = group.id;
  const matches = group.matches.filter(item => !isBye(item.home) && !isBye(item.away));
  els.resultMatch.innerHTML = matches.map(item => `
    <option value="${item.id}">${formatDate(item.date)} | ${item.home} - ${item.away}</option>
  `).join("");
  const selectedStillExists = matches.some(item => item.id === previousMatchId);
  if (selectedStillExists) {
    els.resultMatch.value = previousMatchId;
  } else if (matches[0]) {
    els.resultMatch.value = matches.find(item => !hasResult(item))?.id || matches[0].id;
  }
  renderSelectedMatch();
  els.linkList.innerHTML = matches.slice(0, 8).map(item => `
    <button type="button" data-link-match="${item.id}" ${item.locked ? "disabled" : ""}>
      ${item.home} - ${item.away}<br>
      <span>${item.locked ? "freigegeben, Link gesperrt" : `${location.pathname}?spiel=${item.id}`}</span>
    </button>
  `).join("");
}

function renderSelectedMatch() {
  const group = currentGroup();
  const item = group.matches.find(matchItem => matchItem.id === els.resultMatch.value);
  if (!item) {
    els.selectedMatch.innerHTML = `<div class="empty">Keine Begegnung ausgewaehlt.</div>`;
    return;
  }
  normalizeMatch(item);
  els.selectedMatch.innerHTML = `
    <strong>${item.home} - ${item.away}</strong><br>
    <span>${formatDate(item.date)} | Runde ${item.round}</span>
  `;
  const disabled = item.locked ? "disabled" : "";
  els.lockedNotice.hidden = !item.locked;
  els.lockedNotice.textContent = item.locked
    ? `Dieses Ergebnis wurde freigegeben (${item.approvedBy || "Verantwortlicher"}) und ist fuer Teams gesperrt.`
    : "";
  els.doublesRows.innerHTML = item.doubles.map((doubleItem, doubleIndex) => `
    <div class="double-row" data-double-index="${doubleIndex}">
      <label>Doppel ${doubleIndex + 1}</label>
      ${doubleItem.sets.map((setItem, setIndex) => `
        <div class="set-pair">
          <input ${disabled} type="number" min="0" inputmode="numeric" aria-label="Doppel ${doubleIndex + 1}, Satz ${setIndex + 1}, Heim" data-set-index="${setIndex}" data-side="home" value="${setItem.home ?? ""}" placeholder="Heim">
          <input ${disabled} type="number" min="0" inputmode="numeric" aria-label="Doppel ${doubleIndex + 1}, Satz ${setIndex + 1}, Gast" data-set-index="${setIndex}" data-side="away" value="${setItem.away ?? ""}" placeholder="Gast">
        </div>
      `).join("")}
      <div class="winner-pill">${doubleWinnerLabel(doubleItem)}</div>
    </div>
  `).join("");
  els.calculateResult.disabled = item.locked;
  els.saveResult.disabled = item.locked;
  els.reportFile.disabled = item.locked;
  els.approveResult.disabled = item.locked || !hasResult(item);
  els.unlockResult.disabled = !item.locked;
  els.computedResult.textContent = resultSummary(item);
  renderReports(item);
}

function parseTeams(text) {
  return text
    .split(/\n|;/)
    .map(team => team.trim())
    .filter(Boolean);
}

function generateRoundRobin(teams, startDate, intervalDays, groupId) {
  const list = [...teams];
  if (list.length % 2 === 1) list.push("* Freilos *");
  const rounds = list.length - 1;
  const half = list.length / 2;
  const rotating = [...list];
  const generated = [];

  for (let round = 1; round <= rounds; round += 1) {
    const date = addDays(startDate, (round - 1) * intervalDays);
    for (let index = 0; index < half; index += 1) {
      const left = rotating[index];
      const right = rotating[rotating.length - 1 - index];
      const homeFirst = round % 2 === 1;
      generated.push(match(
        `${groupId}-${round}-${index + 1}-${Date.now()}`,
        round,
        date,
        homeFirst ? left : right,
        homeFirst ? right : left
      ));
    }
    rotating.splice(1, 0, rotating.pop());
  }

  return generated;
}

function addDays(dateText, amount) {
  const date = new Date(`${dateText}T12:00:00`);
  date.setDate(date.getDate() + amount);
  return date.toISOString().slice(0, 10);
}

function collectDoublesFromForm() {
  const doubles = [emptyDouble(1), emptyDouble(2), emptyDouble(3)];
  els.doublesRows.querySelectorAll(".double-row").forEach(row => {
    const doubleIndex = Number(row.dataset.doubleIndex);
    row.querySelectorAll("input").forEach(input => {
      const setIndex = Number(input.dataset.setIndex);
      const side = input.dataset.side;
      doubles[doubleIndex].sets[setIndex][side] = input.value === "" ? "" : Number(input.value);
    });
  });
  return doubles;
}

function calculateMatchFromDoubles(doubles) {
  const totals = {
    gamesHome: 0,
    gamesAway: 0,
    setsHome: 0,
    setsAway: 0,
    pointsHome: 0,
    pointsAway: 0,
    complete: true
  };

  doubles.forEach(doubleItem => {
    let doubleSetsHome = 0;
    let doubleSetsAway = 0;
    doubleItem.sets.forEach(setItem => {
      const home = setItem.home;
      const away = setItem.away;
      if (home === "" && away === "") return;
      if (home === "" || away === "" || Number(home) === Number(away)) {
        totals.complete = false;
        return;
      }
      totals.gamesHome += Number(home);
      totals.gamesAway += Number(away);
      if (Number(home) > Number(away)) doubleSetsHome += 1;
      if (Number(away) > Number(home)) doubleSetsAway += 1;
    });
    totals.setsHome += doubleSetsHome;
    totals.setsAway += doubleSetsAway;
    if (doubleSetsHome > doubleSetsAway) totals.pointsHome += 1;
    if (doubleSetsAway > doubleSetsHome) totals.pointsAway += 1;
    if (doubleSetsHome === doubleSetsAway) totals.complete = false;
  });

  if (totals.pointsHome + totals.pointsAway !== 3) totals.complete = false;
  return totals;
}

function applyCalculatedResult(matchItem) {
  matchItem.doubles = collectDoublesFromForm();
  const totals = calculateMatchFromDoubles(matchItem.doubles);
  matchItem.gamesHome = totals.gamesHome;
  matchItem.gamesAway = totals.gamesAway;
  matchItem.setsHome = totals.setsHome;
  matchItem.setsAway = totals.setsAway;
  matchItem.pointsHome = totals.pointsHome;
  matchItem.pointsAway = totals.pointsAway;
  return totals;
}

function doubleWinnerLabel(doubleItem) {
  const totals = calculateMatchFromDoubles([doubleItem]);
  if (totals.pointsHome === 1) return "Heim";
  if (totals.pointsAway === 1) return "Gast";
  return "offen";
}

function resultSummary(matchItem) {
  if (!hasResult(matchItem)) return "Noch kein vollstaendiges Ergebnis.";
  return `Ergebnis: ${matchItem.pointsHome}:${matchItem.pointsAway} Doppel | Saetze ${matchItem.setsHome}:${matchItem.setsAway} | Spiele ${matchItem.gamesHome}:${matchItem.gamesAway}`;
}

function renderReports(matchItem) {
  normalizeMatch(matchItem);
  els.reportList.innerHTML = matchItem.reports.length
    ? matchItem.reports.map(report => `
        <a class="report-link" href="${report.dataUrl}" target="_blank" rel="noopener">
          <strong>${report.name}</strong>
          <span>oeffnen / drucken</span>
        </a>
      `).join("")
    : `<div class="empty">Noch kein Spielbericht hochgeladen.</div>`;
}

function selectedResultMatch() {
  const group = currentGroup();
  return group.matches.find(matchItem => matchItem.id === els.resultMatch.value);
}

els.tabs.forEach(tab => {
  tab.addEventListener("click", () => {
    els.tabs.forEach(item => item.classList.toggle("active", item === tab));
    els.views.forEach(view => view.classList.toggle("active", view.id === tab.dataset.view));
  });
});

els.seasonYear.addEventListener("change", () => {
  state.year = Number(els.seasonYear.value);
  saveState();
});

els.groupList.addEventListener("click", event => {
  const button = event.target.closest("button[data-group-id]");
  if (!button) return;
  state.selectedGroupId = button.dataset.groupId;
  render();
});

els.overviewGrid.addEventListener("click", event => {
  const reportButton = event.target.closest(".report-icon[data-report-match]");
  if (reportButton) {
    openReport(reportButton.dataset.reportMatch);
    return;
  }
  const button = event.target.closest(".toggle-extra-matches");
  if (!button) return;
  const block = button.closest(".group-block");
  const extras = block.querySelectorAll(".extra-match");
  const shouldShow = [...extras].some(item => item.hidden);
  extras.forEach(item => {
    item.hidden = !shouldShow;
  });
  button.textContent = shouldShow
    ? "Restliche Spiele ausblenden"
    : `Restliche Spiele anzeigen (${extras.length})`;
});

els.addGroup.addEventListener("click", () => {
  const id = `G${state.groups.length + 1}`;
  state.groups.push({
    id,
    name: `Gruppe ${id}`,
    startDate: `${state.year}-05-01`,
    intervalDays: 7,
    teams: [],
    matches: []
  });
  state.selectedGroupId = id;
  saveState();
});

els.saveGroup.addEventListener("click", () => {
  const group = currentGroup();
  group.name = els.groupName.value.trim() || group.name;
  group.startDate = els.seasonStart.value;
  group.intervalDays = Number(els.roundInterval.value);
  group.teams = parseTeams(els.teamsInput.value);
  group.matches = group.matches.filter(item => group.teams.includes(item.home) && group.teams.includes(item.away));
  saveState();
});

els.generateSchedule.addEventListener("click", () => {
  const group = currentGroup();
  group.name = els.groupName.value.trim() || group.name;
  group.startDate = els.seasonStart.value || `${state.year}-05-01`;
  group.intervalDays = Number(els.roundInterval.value);
  group.teams = parseTeams(els.teamsInput.value);
  group.matches = generateRoundRobin(group.teams, group.startDate, group.intervalDays, group.id);
  saveState();
});

els.addMatch.addEventListener("click", () => {
  const group = currentGroup();
  if (!els.manualDate.value || !els.manualHome.value || !els.manualAway.value || els.manualHome.value === els.manualAway.value) return;
  group.matches.push(match(`${group.id}-manual-${Date.now()}`, nextRound(group), els.manualDate.value, els.manualHome.value, els.manualAway.value));
  saveState();
});

els.scheduleEditor.addEventListener("change", event => {
  const row = event.target.closest(".schedule-row[data-match-id]");
  if (!row) return;
  const group = currentGroup();
  const item = group.matches.find(matchItem => matchItem.id === row.dataset.matchId);
  if (!item) return;
  const fields = row.querySelectorAll("input, select");
  const nextRoundValue = Number(fields[0].value);
  const nextDate = fields[1].value;
  const nextHome = fields[2].value;
  const nextAway = fields[3].value;
  if (!nextRoundValue || !nextDate || !nextHome || !nextAway || nextHome === nextAway) {
    renderPlanning();
    return;
  }
  item.round = nextRoundValue;
  item.date = nextDate;
  item.home = nextHome;
  item.away = nextAway;
  saveState();
});

els.scheduleEditor.addEventListener("click", event => {
  const button = event.target.closest("button[data-delete-match]");
  if (!button) return;
  const group = currentGroup();
  group.matches = group.matches.filter(matchItem => matchItem.id !== button.dataset.deleteMatch);
  saveState();
});

function nextRound(group) {
  return group.matches.reduce((max, item) => Math.max(max, Number(item.round) || 0), 0) + 1;
}

els.resultGroup.addEventListener("change", () => {
  state.selectedGroupId = els.resultGroup.value;
  render();
});

els.resultMatch.addEventListener("change", renderSelectedMatch);

els.doublesRows.addEventListener("input", () => {
  const item = selectedResultMatch();
  if (!item || item.locked) return;
  item.doubles = collectDoublesFromForm();
  els.computedResult.textContent = resultSummary({ ...item, ...calculateMatchFromDoubles(item.doubles) });
  els.doublesRows.querySelectorAll(".double-row").forEach((row, index) => {
    row.querySelector(".winner-pill").textContent = doubleWinnerLabel(item.doubles[index]);
  });
});

els.calculateResult.addEventListener("click", () => {
  const item = selectedResultMatch();
  if (!item || item.locked) return;
  applyCalculatedResult(item);
  renderSelectedMatch();
});

els.saveResult.addEventListener("click", () => {
  const item = selectedResultMatch();
  if (!item || item.locked) return;
  const totals = applyCalculatedResult(item);
  if (!totals.complete) {
    els.computedResult.textContent = "Bitte alle drei Doppel mit eindeutigen Satzwerten erfassen.";
    return;
  }
  saveState();
});

els.reportFile.addEventListener("change", () => {
  const item = selectedResultMatch();
  const file = els.reportFile.files[0];
  if (!item || item.locked || !file) return;
  const reader = new FileReader();
  reader.addEventListener("load", () => {
    normalizeMatch(item);
    item.reports.push({
      id: `report-${Date.now()}`,
      name: file.name,
      type: file.type || "application/octet-stream",
      dataUrl: reader.result,
      uploadedAt: new Date().toISOString()
    });
    els.reportFile.value = "";
    saveState();
  });
  reader.readAsDataURL(file);
});

els.approveResult.addEventListener("click", () => {
  const item = selectedResultMatch();
  if (!item || !hasResult(item)) return;
  item.locked = true;
  item.approvedBy = els.approvedBy.value;
  item.approvedAt = new Date().toISOString();
  saveState();
});

els.unlockResult.addEventListener("click", () => {
  const item = selectedResultMatch();
  if (!item) return;
  item.locked = false;
  item.approvedBy = null;
  item.approvedAt = null;
  saveState();
});

els.linkList.addEventListener("click", event => {
  const button = event.target.closest("button[data-link-match]");
  if (!button) return;
  els.resultMatch.value = button.dataset.linkMatch;
  renderSelectedMatch();
});

const initialMatch = new URLSearchParams(location.search).get("spiel");

async function init() {
  configureRemoteStore();
  state = await loadState();
  render();
  if (initialMatch) {
    const group = state.groups.find(item => item.matches.some(matchItem => matchItem.id === initialMatch));
    if (group) {
      state.selectedGroupId = group.id;
      document.querySelector('[data-view="results"]').click();
      els.resultMatch.value = initialMatch;
      renderSelectedMatch();
    }
  }
}

init();
