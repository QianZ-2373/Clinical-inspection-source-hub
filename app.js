/* Clinical Inspection Findings Source Hub - front-end logic */
(function () {
  "use strict";

  var STORAGE_KEY = "ct_inspection_hub_data_v1";

  // ---------- Data loading: prefer localStorage overrides ----------
  function loadData() {
    try {
      var saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(window.DATA || { organizations: [], categories: [] }));
  }

  function persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.data));
    } catch (e) {
      alert("Failed to save to browser: " + e.message);
    }
  }

  var state = {
    data: loadData(),
    view: "all",            // "all" | "co" | "dm" | "compare" | "summary" | orgId
    query: "",
    orgType: "all",
    sev: "all",
    year: "all",
    orgFilter: null,        // restrict domain views to one org (set from the matrix)
    collapsed: {},          // categoryId -> true
    highlight: {},          // sourceId -> true
    hsAll: false,           // overview: show all categories in the Critical & Major chart
    editing: null
  };

  // ---------- Constants ----------
  var DOMAIN = {
    co: { label: "Clinical Operations", short: "Clin Ops", color: "#0f6bff", soft: "#e4efff" },
    dm: { label: "Data Management", short: "Data Mgmt", color: "#0a8f7f", soft: "#d8f6f2" }
  };

  var SEVERITY = {
    critical: { label: "Critical", color: "#e11d48", rank: 4 },
    major:    { label: "Major",    color: "#d97706", rank: 3 },
    minor:    { label: "Minor / other", color: "#6b6485", rank: 2 },
    trend:    { label: "Trend / aggregate", color: "#7A00E6", rank: 1 }
  };

  var ORG_TYPE = {
    regulator: { label: "Regulator / Health Authority", color: "#0071bc", icon: '<path d="M3 21h18M5 21V10l7-4 7 4v11M9 21v-6h6v6M12 3v3"/>' },
    mnc:       { label: "Global MNC Pharma",            color: "#7A00E6", icon: '<path d="M10 2v7.5L4.5 19a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 9.5V2M8.5 2h7M7 15h10"/>' },
    cro:       { label: "CRO / Site (case)",            color: "#00857c", icon: '<path d="M9 3h6M10 3v5l-5 9a3 3 0 0 0 3 4h8a3 3 0 0 0 3-4l-5-9V3"/>' },
    industry:  { label: "Industry & Professional Body", color: "#c47f17", icon: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.2"/><path d="M3 20v-1.5A4.5 4.5 0 0 1 7.5 14h3A4.5 4.5 0 0 1 15 18.5V20M15.5 14h1A3.5 3.5 0 0 1 20 17.5V20"/>' },
    academia:  { label: "Research & Literature",        color: "#3949ab", icon: '<path d="M12 4 2 9l10 5 10-5-10-5M6 11.5V18c0 1.4 2.7 2.5 6 2.5s6-1.1 6-2.5v-6.5"/>' }
  };
  var ORG_ORDER = ["regulator", "mnc", "cro", "industry", "academia"];

  // ---------- Helpers ----------
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
  }
  function toTime(d) {
    var m = String(d || "").match(/(\d{4})(?:-(\d{1,2}))?(?:-(\d{1,2}))?/);
    if (!m) return 0;
    return new Date(+m[1], m[2] ? +m[2] - 1 : 0, m[3] ? +m[3] : 1).getTime();
  }
  function yearOf(d) {
    var m = String(d || "").match(/(\d{4})/);
    return m ? m[1] : "";
  }
  function svgIcon(paths, size) {
    size = size || 14;
    return '<svg width="' + size + '" height="' + size + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + paths + '</svg>';
  }
  var REGION = {
    na:     { label: "North America", color: "#0071bc", note: "FDA, Health Canada, US-headquartered pharma and North American industry bodies" },
    eu:     { label: "Europe (EU / UK)", color: "#3949ab", note: "EMA, MHRA and Europe-headquartered pharma" },
    ch:     { label: "Switzerland", color: "#d52b1e", note: "Swissmedic and Swiss-headquartered pharma" },
    asia:   { label: "Asia", color: "#c47f17", note: "NMPA, PMDA, MFDS and Asia-based CROs" },
    au:     { label: "Australia", color: "#00857c", note: "TGA" },
    latam:  { label: "Latin America", color: "#2e7d32", note: "ANVISA" },
    global: { label: "Global / multi-region", color: "#6b6485", note: "WHO PQ, international societies and literature" }
  };
  var REGION_ORDER = ["na", "eu", "ch", "asia", "au", "latam", "global"];
  var REGION_OF = {
    "fda": "na", "health-canada": "na", "pfizer": "na", "merck-msd": "na", "bms": "na", "lilly": "na", "amgen": "na",
    "capra": "na", "redica": "na", "goodwin": "na", "tufts-csdd": "na",
    "ema": "eu", "mhra": "eu", "astrazeneca": "eu",
    "swissmedic": "ch", "roche-genentech": "ch", "novartis": "ch", "csl-vifor": "ch", "idorsia": "ch",
    "nmpa": "asia", "pmda": "asia", "mfds": "asia", "synapse": "asia", "synchron": "asia", "panexcell": "asia",
    "tga": "au", "anvisa": "latam",
    "who-pq": "global", "scdm": "global", "literature": "global"
  };
  function regionOf(org) { return (org && (org.region || REGION_OF[org.id])) || "global"; }

  function categories() { return state.data.categories || []; }
  function catById(id) { return categories().find(function (c) { return c.id === id; }); }
  function catLabel(id) { var c = catById(id); return c ? c.label : id; }
  function findOrg(id) { return (state.data.organizations || []).find(function (o) { return o.id === id; }); }
  function orgType(org) { return ORG_TYPE[org && org.category] || null; }

  function allFindings() {
    var out = [];
    (state.data.organizations || []).forEach(function (org) {
      (org.sources || []).forEach(function (src) {
        (src.findings || []).forEach(function (f, i) {
          out.push({ org: org, src: src, f: f, idx: i });
        });
      });
    });
    return out;
  }
  function allSources() {
    var out = [];
    (state.data.organizations || []).forEach(function (org) {
      (org.sources || []).forEach(function (src) { out.push({ org: org, src: src }); });
    });
    return out;
  }

  function matchesFilters(x, opts) {
    opts = opts || {};
    if (!opts.ignoreOrgType && state.orgType !== "all" && x.org.category !== state.orgType) return false;
    if (state.sev !== "all" && x.f.sev !== state.sev) return false;
    if (state.year !== "all" && yearOf(x.src.publishedAt) !== state.year) return false;
    if (state.query) {
      var q = state.query.toLowerCase();
      var hay = [x.org.name, x.org.short, x.src.title, x.src.summary, x.src.type, x.src.scope, x.src.sponsor,
        x.f.text, x.f.ref, catLabel(x.f.cat)].join(" ").toLowerCase();
      if (hay.indexOf(q) === -1) return false;
    }
    return true;
  }

  // ---------- Logos & badges ----------
  function faviconUrl(domain) {
    return "https://www.google.com/s2/favicons?domain=" + encodeURIComponent(domain) + "&sz=128";
  }
  function renderLogo(org, cls) {
    var color = org.brandColor || (orgType(org) || {}).color || "#7A00E6";
    var fallback = esc(org.logoText || org.short || "?");
    var src = org.logo || (org.domain ? faviconUrl(org.domain) : "");
    cls = cls || "org-logo";
    if (src) {
      return '<div class="' + cls + '" style="background:' + esc(color) + '">' +
        '<img src="' + esc(src) + '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />' +
        '<span style="display:none;width:100%;height:100%;align-items:center;justify-content:center;">' + fallback + '</span>' +
      '</div>';
    }
    return '<div class="' + cls + '" style="background:' + esc(color) + '">' + fallback + '</div>';
  }
  function navLogo(org) {
    var color = org.brandColor || (orgType(org) || {}).color || "#7A00E6";
    var mono = esc((org.logoText || org.short || org.name || "?").slice(0, 3));
    var src = org.logo || (org.domain ? faviconUrl(org.domain) : "");
    if (src) {
      return '<img class="nav-logo" src="' + esc(src) + '" alt="" onerror="this.style.display=\'none\';this.nextElementSibling.style.display=\'flex\';" />' +
        '<span class="nav-logo mono" style="display:none;background:' + esc(color) + '">' + mono + '</span>';
    }
    return '<span class="nav-logo mono" style="background:' + esc(color) + '">' + mono + '</span>';
  }
  function typeBadge(org) {
    var c = orgType(org);
    if (!c) return "";
    return '<span class="cat-badge" style="--cc:' + c.color + '">' + svgIcon(c.icon, 12) + '<span>' + esc(c.label) + '</span></span>';
  }
  function typeLegend() {
    return ORG_ORDER.map(function (k) {
      var c = ORG_TYPE[k];
      return '<span class="cat-badge" style="--cc:' + c.color + '">' + svgIcon(c.icon, 12) + '<span>' + esc(c.label) + '</span></span>';
    }).join("");
  }
  function sevBadge(sev) {
    var s = SEVERITY[sev] || SEVERITY.minor;
    return '<span class="sev" style="--sc:' + s.color + '">' + esc(s.label) + '</span>';
  }
  function catPill(id) {
    var c = catById(id);
    var d = DOMAIN[c ? c.domain : "co"];
    return '<span class="cat-pill" style="--dc:' + d.color + '">' + esc(catLabel(id)) + '</span>';
  }
  function secondaryBadge(src) {
    if (!src.flag) return "";
    return '<span class="sev" style="--sc:#8a8299;cursor:help" title="' + esc(src.flagNote || "") + '">\u26A0 ' + esc(src.flag) + '</span>';
  }

  // ---------- Nav ----------
  var orgNav = document.getElementById("orgNav");

  function countDomain(d) {
    return allFindings().filter(function (x) { return x.f.domain === d; }).length;
  }

  function renderNav() {
    var orgs = state.data.organizations || [];
    function chip(cls, view, icon, label, count) {
      return '<button class="nav-chip ' + cls + (state.view === view ? " active" : "") + '" data-view="' + view + '">' +
        svgIcon(icon, 16) + '<span>' + label + '</span>' +
        (count != null ? '<em class="nav-count">' + count + '</em>' : '') + '</button>';
    }
    var primary =
      chip("nav-overview", "all", '<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>', "Overview") +
      chip("dom-co", "co", '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>', "Clinical Operations findings", countDomain("co")) +
      chip("dom-dm", "dm", '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>', "Data Management findings", countDomain("dm")) +
      chip("compare", "compare", '<path d="M9 3v18M15 3v18M3 9h18M3 15h18"/>', "Cross-comparison") +
      chip("summary", "summary", '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>', "Summary");

    var groups = {};
    orgs.forEach(function (o) { (groups[o.category] = groups[o.category] || []).push(o); });
    var boxes = ORG_ORDER.filter(function (k) { return groups[k]; }).map(function (k) {
      var c = ORG_TYPE[k];
      var wide = groups[k].length >= 8 ? " wide" : "";
      return '<section class="nav-gbox' + wide + '" style="--cc:' + c.color + '">' +
        '<div class="nav-gtitle">' + svgIcon(c.icon, 13) + '<span>' + esc(c.label) + '</span><em>' + groups[k].length + '</em></div>' +
        '<div class="nav-gchips">' + groups[k].map(function (o) {
          return '<button class="nav-chip nav-org' + (state.view === o.id ? " active" : "") + '" data-view="' + esc(o.id) + '" style="--brand:' + c.color + '" title="' + esc(o.name) + '">' +
            navLogo(o) + '<span>' + esc(o.short || o.name) + '</span></button>';
        }).join("") + '</div></section>';
    }).join("");

    orgNav.innerHTML = '<div class="nav-primary">' + primary + '</div><div class="nav-groups">' + boxes + '</div>';
    orgNav.querySelectorAll("[data-view]").forEach(function (el) {
      el.addEventListener("click", function () { go(el.getAttribute("data-view")); });
    });
  }

  function go(view, keepOrgFilter) {
    state.view = view;
    if (!keepOrgFilter) state.orgFilter = null;
    window.scrollTo({ top: 0, behavior: "smooth" });
    render();
  }

  // ---------- Toolbar ----------
  var toolbar = document.getElementById("toolbar");
  var content = document.getElementById("content");

  function fillToolbar() {
    var ot = document.getElementById("orgTypeSelect");
    ot.innerHTML = '<option value="all">All organization types</option>' +
      ORG_ORDER.map(function (k) { return '<option value="' + k + '">' + esc(ORG_TYPE[k].label) + '</option>'; }).join("");
    ot.value = state.orgType;

    var sv = document.getElementById("sevSelect");
    sv.innerHTML = '<option value="all">All severities</option>' +
      Object.keys(SEVERITY).map(function (k) { return '<option value="' + k + '">' + esc(SEVERITY[k].label) + '</option>'; }).join("");
    sv.value = state.sev;

    var years = {};
    allSources().forEach(function (x) { var y = yearOf(x.src.publishedAt); if (y) years[y] = 1; });
    var ys = Object.keys(years).sort().reverse();
    var yr = document.getElementById("yearSelect");
    yr.innerHTML = '<option value="all">All years (2020 →)</option>' + ys.map(function (y) { return '<option value="' + y + '">' + y + '</option>'; }).join("");
    yr.value = state.year;
  }

  document.getElementById("searchInput").addEventListener("input", function (e) { state.query = e.target.value.trim(); renderMain(); });
  document.getElementById("orgTypeSelect").addEventListener("change", function (e) { state.orgType = e.target.value; renderMain(); });
  document.getElementById("sevSelect").addEventListener("change", function (e) { state.sev = e.target.value; renderMain(); });
  document.getElementById("yearSelect").addEventListener("change", function (e) { state.year = e.target.value; renderMain(); });

  // ---------- Render ----------
  function render() {
    renderNav();
    fillToolbar();
    renderMain();
  }

  function renderMain() {
    var v = state.view;
    var showToolbar = v === "co" || v === "dm" || !!findOrg(v);
    toolbar.style.display = showToolbar ? "block" : "none";
    document.getElementById("orgTypeSelect").style.display = (v === "co" || v === "dm") ? "" : "none";
    if (v === "all") renderOverview();
    else if (v === "co" || v === "dm") renderDomain(v);
    else if (v === "compare") renderCompare();
    else if (v === "summary") renderSummary();
    else renderOrgView(v);
  }

  // ---------- Overview ----------
  var KPI_ICONS = {
    org: '<path d="M3 21h18M5 21V7l7-4 7 4v14M9 21v-4h6v4"/>',
    doc: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h6"/>',
    co: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
    dm: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/>',
    alert: '<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4M12 17h.01"/>'
  };
  function kpi(color, soft, icon, num, label, view) {
    return '<div class="kpi' + (view ? " click" : "") + '" style="--kc:' + color + ';--ks:' + soft + '"' + (view ? ' data-go="' + view + '"' : '') + '>' +
      '<div class="kpi-top"><span class="kpi-ico">' + svgIcon(KPI_ICONS[icon], 20) + '</span><span class="kpi-num">' + num + '</span></div>' +
      '<div class="kpi-lbl">' + label + '</div></div>';
  }

  function buildYearChart(rows) {
    // rows: [{ year, co, dm }]
    var W = 720, H = 280, padL = 42, padR = 18, padT = 30, padB = 42;
    var plotW = W - padL - padR, plotH = H - padT - padB, baseY = padT + plotH;
    var maxV = Math.max.apply(null, rows.map(function (r) { return r.co + r.dm; }).concat([1]));
    var axisMax = Math.max(4, Math.ceil(maxV / 10) * 10);
    var band = plotW / (rows.length || 1);
    var barW = Math.min(46, band * 0.5);
    var svg = '<svg class="year-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">';
    for (var t = 0; t <= 4; t++) {
      var yy = baseY - (t / 4) * plotH;
      svg += '<line x1="' + padL + '" y1="' + yy + '" x2="' + (W - padR) + '" y2="' + yy + '" stroke="#ecebf3" ' + (t ? 'stroke-dasharray="2 6"' : '') + '/>';
      svg += '<text x="' + (padL - 10) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="11" font-weight="600" fill="#aba4c0">' + Math.round(axisMax * t / 4) + '</text>';
    }
    rows.forEach(function (r, i) {
      var cx = padL + band * i + band / 2, x = cx - barW / 2;
      var hCo = r.co / axisMax * plotH, hDm = r.dm / axisMax * plotH;
      var yDm = baseY - hDm, yCo = yDm - hCo;
      if (hDm) svg += '<rect x="' + x + '" y="' + yDm + '" width="' + barW + '" height="' + hDm + '" rx="4" fill="' + DOMAIN.dm.color + '"/>';
      if (hCo) svg += '<rect x="' + x + '" y="' + yCo + '" width="' + barW + '" height="' + hCo + '" rx="4" fill="' + DOMAIN.co.color + '"/>';
      svg += '<text x="' + cx + '" y="' + (yCo - 8) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#2a2340">' + (r.co + r.dm) + '</text>';
      svg += '<text x="' + cx + '" y="' + (H - 14) + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="#4a4360">' + esc(r.year) + '</text>';
    });
    return svg + '</svg>';
  }

  function sevRows(list) {
    return Object.keys(SEVERITY).sort(function (a, b) { return SEVERITY[b].rank - SEVERITY[a].rank; }).map(function (k) {
      var r = { key: k, co: 0, dm: 0 };
      list.forEach(function (x) { if (x.f.sev === k) r[x.f.domain]++; });
      return r;
    });
  }

  function sevShare(list) {
    var rows = sevRows(list);
    var total = rows.reduce(function (s, r) { return s + r.co + r.dm; }, 0) || 1;
    return '<div class="sev-share"><div class="sev-share-bar">' + rows.map(function (r) {
      var n = r.co + r.dm;
      return n ? '<i style="flex:' + n + ';background:' + SEVERITY[r.key].color + '" title="' + esc(SEVERITY[r.key].label) + ': ' + n + '"></i>' : '';
    }).join("") + '</div><div class="sev-share-lg">' + rows.map(function (r) {
      var S = SEVERITY[r.key], n = r.co + r.dm;
      return '<span><i class="lg-dot" style="background:' + S.color + '"></i>' + esc(S.label) + ' <b>' + Math.round(n / total * 100) + '%</b></span>';
    }).join("") + '</div></div>';
  }

  function buildSevChart(list) {
    var rows = sevRows(list);
    var W = 600, H = 300, padL = 38, padR = 10, padT = 26, padB = 52;
    var plotW = W - padL - padR, plotH = H - padT - padB, baseY = padT + plotH;
    var maxV = Math.max.apply(null, rows.map(function (r) { return r.co + r.dm; }).concat([1]));
    var axisMax = Math.max(4, Math.ceil(maxV / 20) * 20);
    var band = plotW / rows.length;
    var barW = Math.min(72, band * 0.52);
    var svg = '<svg class="year-svg" viewBox="0 0 ' + W + ' ' + H + '" xmlns="http://www.w3.org/2000/svg">';
    for (var t = 0; t <= 4; t++) {
      var yy = baseY - (t / 4) * plotH;
      svg += '<line x1="' + padL + '" y1="' + yy + '" x2="' + (W - padR) + '" y2="' + yy + '" stroke="#ecebf3" ' + (t ? 'stroke-dasharray="2 6"' : '') + '/>';
      svg += '<text x="' + (padL - 10) + '" y="' + (yy + 4) + '" text-anchor="end" font-size="11" font-weight="600" fill="#aba4c0">' + Math.round(axisMax * t / 4) + '</text>';
    }
    rows.forEach(function (r, i) {
      var S = SEVERITY[r.key], n = r.co + r.dm;
      var cx = padL + band * i + band / 2, x = cx - barW / 2;
      var h = n / axisMax * plotH, y = baseY - h;
      if (h) svg += '<rect x="' + x + '" y="' + y + '" width="' + barW + '" height="' + h + '" rx="5" fill="' + S.color + '"><title>' + esc(S.label) + ': ' + n + ' (CO ' + r.co + ', DM ' + r.dm + ')</title></rect>';
      svg += '<text x="' + cx + '" y="' + (y - 8) + '" text-anchor="middle" font-size="13" font-weight="800" fill="#2a2340">' + n + '</text>';
      svg += '<text x="' + cx + '" y="' + (baseY + 20) + '" text-anchor="middle" font-size="12.5" font-weight="700" fill="' + S.color + '">' + esc(S.label) + '</text>';
      svg += '<text x="' + cx + '" y="' + (baseY + 38) + '" text-anchor="middle" font-size="11" font-weight="600" fill="#8a83a0">CO ' + r.co + ' \u00B7 DM ' + r.dm + '</text>';
    });
    return svg + '</svg>';
  }

  function highSevCatBars(list) {
    var counts = {};
    list.forEach(function (x) {
      if (x.f.sev !== "critical" && x.f.sev !== "major") return;
      var c = counts[x.f.cat] = counts[x.f.cat] || { critical: 0, major: 0 };
      c[x.f.sev]++;
    });
    var rows = categories().filter(function (c) { return counts[c.id]; })
      .map(function (c) { var n = counts[c.id]; return { c: c, cr: n.critical, mj: n.major, n: n.critical + n.major }; })
      .sort(function (a, b) { return b.n - a.n || b.cr - a.cr; });
    var max = Math.max.apply(null, rows.map(function (r) { return r.n; }).concat([1]));
    var LIMIT = 10;
    var shown = state.hsAll ? rows : rows.slice(0, LIMIT);
    var html = '<div class="hs-head"><span></span><span>Category</span><span></span><span class="hs-num-h">C</span><span class="hs-num-h">M</span><span class="hs-num-h">Total</span></div>' +
      '<div class="hs-list">' + shown.map(function (r) {
      var D = DOMAIN[r.c.domain];
      return '<div class="hs-row" data-jumpcat="' + r.c.domain + '::' + r.c.id + '" title="' + esc(r.c.label + ": " + r.cr + " critical, " + r.mj + " major") + '">' +
        '<span class="hs-dom" style="background:' + D.soft + ';color:' + D.color + '">' + (r.c.domain === "co" ? "CO" : "DM") + '</span>' +
        '<span class="hs-name">' + esc(r.c.label) + '</span>' +
        '<span class="hs-track">' +
          (r.cr ? '<i style="width:' + (r.cr / max * 100) + '%;background:' + SEVERITY.critical.color + '"></i>' : '') +
          (r.mj ? '<i style="width:' + (r.mj / max * 100) + '%;background:' + SEVERITY.major.color + '"></i>' : '') +
        '</span>' +
        '<span class="hs-n" style="color:' + SEVERITY.critical.color + '">' + (r.cr || "\u2013") + '</span>' +
        '<span class="hs-n" style="color:' + SEVERITY.major.color + '">' + (r.mj || "\u2013") + '</span>' +
        '<span class="hs-n hs-tot">' + r.n + '</span>' +
      '</div>';
    }).join("") + '</div>';
    if (rows.length > LIMIT) {
      html += '<button type="button" class="hs-more" data-hs-toggle>' + (state.hsAll ? 'Show top ' + LIMIT + ' only' : 'Show all ' + rows.length + ' categories') + '</button>';
    }
    return html;
  }

  function catBars(domain, list, clickable) {
    var counts = {};
    list.forEach(function (x) { if (x.f.domain === domain) counts[x.f.cat] = (counts[x.f.cat] || 0) + 1; });
    var cats = categories().filter(function (c) { return c.domain === domain; })
      .map(function (c) { return { c: c, n: counts[c.id] || 0 }; })
      .sort(function (a, b) { return b.n - a.n; });
    var max = Math.max.apply(null, cats.map(function (x) { return x.n; }).concat([1]));
    var color = DOMAIN[domain].color;
    return '<div class="cat-dist">' + cats.map(function (x) {
      return '<div class="cat-row' + (clickable ? " click" : "") + '" style="--cc:' + color + '"' + (clickable ? ' data-jumpcat="' + domain + '::' + x.c.id + '"' : '') + '>' +
        '<div class="cat-row-top"><span class="cat-row-name">' + esc(x.c.label) + '</span><b>' + x.n + '</b></div>' +
        '<div class="cat-track"><i style="width:' + Math.max(3, Math.round(x.n / max * 100)) + '%"></i></div></div>';
    }).join("") + '</div>';
  }

  function renderOverview() {
    var orgs = state.data.organizations || [];
    var fl = allFindings();
    var srcs = allSources();
    var co = fl.filter(function (x) { return x.f.domain === "co"; }).length;
    var dm = fl.filter(function (x) { return x.f.domain === "dm"; }).length;
    var crit = fl.filter(function (x) { return x.f.sev === "critical"; }).length;

    var byYear = {};
    fl.forEach(function (x) {
      var y = yearOf(x.src.publishedAt) || "n/a";
      byYear[y] = byYear[y] || { year: y, co: 0, dm: 0 };
      byYear[y][x.f.domain]++;
    });
    var yearRows = Object.keys(byYear).sort().map(function (k) { return byYear[k]; });

    var typeCounts = {};
    orgs.forEach(function (o) { typeCounts[o.category] = (typeCounts[o.category] || 0) + 1; });
    var typeMax = Math.max.apply(null, ORG_ORDER.map(function (k) { return typeCounts[k] || 0; }).concat([1]));
    var typeDist = '<div class="cat-dist">' + ORG_ORDER.filter(function (k) { return typeCounts[k]; }).map(function (k) {
      var c = ORG_TYPE[k];
      var nf = fl.filter(function (x) { return x.org.category === k; }).length;
      return '<div class="cat-row" style="--cc:' + c.color + '"><div class="cat-row-top"><span class="cat-row-name">' + svgIcon(c.icon, 14) + '<span>' + esc(c.label) + '</span></span><b>' + typeCounts[k] + ' <small style="font-size:11px;color:var(--muted);font-weight:600">orgs · ' + nf + ' findings</small></b></div>' +
        '<div class="cat-track"><i style="width:' + Math.round(typeCounts[k] / typeMax * 100) + '%"></i></div></div>';
    }).join("") + '</div>';

    var orgCards = ORG_ORDER.map(function (k) {
      return orgs.filter(function (o) { return o.category === k; }).map(function (org) {
        var mine = fl.filter(function (x) { return x.org.id === org.id; });
        var nco = mine.filter(function (x) { return x.f.domain === "co"; }).length;
        var ndm = mine.length - nco;
        return '<div class="org-card" data-go="' + esc(org.id) + '">' + renderLogo(org) +
          '<div class="oc-name">' + esc(org.name) + '</div>' +
          '<div class="oc-meta">' + typeBadge(org) +
            '<span class="oc-count co">' + nco + ' CO</span><span class="oc-count dm">' + ndm + ' DM</span></div>' +
          (org.intro ? '<div class="oc-intro">' + esc(org.intro) + '</div>' : '') + '</div>';
      }).join("");
    }).join("");

    content.innerHTML =
      '<div class="ov-hero"><h2>Portfolio overview</h2>' +
        '<p>Publicly released GCP inspection and audit findings from health authorities, global MNC pharma, CROs and industry bodies, reduced to the two areas that matter here — <b style="color:var(--co)">Clinical Operations</b> and <b style="color:var(--dm)">Data Management</b>. Each finding is tied back to its original source document. Use the two domain tabs to see findings grouped by category across all sources, or pick an organization to drill into its documents.</p>' +
        '<span class="ov-note">\u21BB Data last refreshed: ' + esc(state.data.lastCheckedAt || "\u2014") + '</span> ' +
        '<span class="ov-note">\u2139 Coverage: sources dated ' + esc(state.data.coverageStart || "2020-01-01") + ' onward</span>' +
      '</div>' +
      '<div class="kpi-grid">' +
        kpi("#7A00E6", "#f1e6ff", "org", orgs.length, "Organizations tracked") +
        kpi("#6a1fe0", "#f1e6ff", "doc", srcs.length, "Source documents") +
        kpi(DOMAIN.co.color, DOMAIN.co.soft, "co", co, "Clinical Ops findings", "co") +
        kpi(DOMAIN.dm.color, DOMAIN.dm.soft, "dm", dm, "Data Mgmt findings", "dm") +
        kpi("#e11d48", "#ffe4ea", "alert", crit, "Critical findings") +
      '</div>' +
      '<div class="panel"><div class="chart-2col">' +
        '<div class="chart-col"><h3>Findings by source publication year</h3>' + buildYearChart(yearRows) +
          '<div class="legend"><span><i class="lg-dot" style="background:' + DOMAIN.co.color + '"></i>Clinical Operations</span><span><i class="lg-dot" style="background:' + DOMAIN.dm.color + '"></i>Data Management</span></div>' +
          '<div class="caption">Counts reflect findings captured in the hub, not total regulatory activity.</div></div>' +
        '<div class="chart-col"><h3>Organizations by type</h3>' + typeDist +
          '<div class="caption">Regulators and global MNC pharma are the priority focus.</div></div>' +
      '</div></div>' +
      '<div class="panel sev-panel"><div class="sev-grid">' +
        '<div class="sev-card">' +
          '<div class="sev-card-head"><div><h3>Findings by severity</h3><p>All findings in the hub, split by grade</p></div></div>' +
          buildSevChart(fl) + sevShare(fl) +
          '<div class="sev-note">"Trend / aggregate" are summary statistics from metrics reports rather than single graded findings.</div>' +
        '</div>' +
        '<div class="sev-card">' +
          '<div class="sev-card-head"><div><h3>Critical &amp; Major findings by category</h3><p>Where the serious findings concentrate. Click a row to open the category.</p></div>' +
            '<div class="legend sev-lg"><span><i class="lg-dot" style="background:' + SEVERITY.critical.color + '"></i>Critical</span><span><i class="lg-dot" style="background:' + SEVERITY.major.color + '"></i>Major</span></div></div>' +
          highSevCatBars(fl) +
        '</div>' +
      '</div></div>' +
      '<div class="panel"><div class="chart-2col">' +
        '<div class="chart-col"><h3 style="color:' + DOMAIN.co.color + '">Clinical Operations — findings by category</h3>' + catBars("co", allFindings(), true) + '</div>' +
        '<div class="chart-col"><h3 style="color:' + DOMAIN.dm.color + '">Data Management — findings by category</h3>' + catBars("dm", allFindings(), true) + '</div>' +
      '</div><div class="caption">Click a category to open it in the domain view.</div></div>' +
      '<div class="panel"><h3>Organizations included (' + orgs.length + ')</h3>' +
        '<div class="cat-legend">' + typeLegend() + '</div>' +
        '<div class="org-cards">' + orgCards + '</div></div>';

    bindCommon();
  }

  // ---------- Domain views (CO / DM) ----------
  function renderDomain(domain) {
    var D = DOMAIN[domain];
    var base = allFindings().filter(function (x) { return x.f.domain === domain; });
    if (state.orgFilter) base = base.filter(function (x) { return x.org.id === state.orgFilter; });
    var list = base.filter(function (x) { return matchesFilters(x); });

    var cats = categories().filter(function (c) { return c.domain === domain; });
    var groups = cats.map(function (c) {
      var items = list.filter(function (x) { return x.f.cat === c.id; });
      items.sort(function (a, b) {
        var r = (SEVERITY[b.f.sev] || {}).rank - (SEVERITY[a.f.sev] || {}).rank;
        return r || toTime(b.src.publishedAt) - toTime(a.src.publishedAt);
      });
      return { c: c, items: items };
    });
    var sorted = groups.slice().sort(function (a, b) { return b.items.length - a.items.length; });

    var jump = '<div class="cat-jump" style="--dc:' + D.color + '">' + sorted.map(function (g) {
      return '<button class="' + (g.items.length ? "" : "off") + '" data-scroll="' + g.c.id + '">' + esc(g.c.label) + '<em>' + g.items.length + '</em></button>';
    }).join("") + '</div>';

    var orgsInvolved = {};
    list.forEach(function (x) { orgsInvolved[x.org.id] = 1; });
    var crit = list.filter(function (x) { return x.f.sev === "critical"; }).length;
    var major = list.filter(function (x) { return x.f.sev === "major"; }).length;
    var regs = list.filter(function (x) { return x.org.category === "regulator"; }).length;
    var mnc = list.filter(function (x) { return x.org.category === "mnc"; }).length;

    var filterOrg = state.orgFilter ? findOrg(state.orgFilter) : null;
    var groupsHtml = sorted.filter(function (g) { return g.items.length; }).map(function (g) {
      var collapsed = state.collapsed[g.c.id] ? " collapsed" : "";
      var sevCounts = {};
      g.items.forEach(function (x) { sevCounts[x.f.sev] = (sevCounts[x.f.sev] || 0) + 1; });
      var sevHtml = Object.keys(SEVERITY).filter(function (k) { return sevCounts[k]; }).map(function (k) {
        return '<span class="sev" style="--sc:' + SEVERITY[k].color + '">' + sevCounts[k] + ' ' + esc(SEVERITY[k].label) + '</span>';
      }).join("");
      return '<section class="fgroup' + collapsed + '" id="cat-' + g.c.id + '" style="--dc:' + D.color + '">' +
        '<header class="fgroup-hd" data-collapse="' + g.c.id + '">' +
          '<span class="fgroup-ico">' + esc(g.c.code || domain.toUpperCase()) + '</span>' +
          '<div><h3>' + esc(g.c.label) + '</h3><p>' + esc(g.c.description || "") + '</p></div>' +
          '<div class="fgroup-sev">' + sevHtml + '</div>' +
          '<span class="fgroup-count">' + g.items.length + '</span>' +
        '</header>' +
        '<div class="fgroup-body">' + g.items.map(renderFinding).join("") + '</div>' +
      '</section>';
    }).join("");

    content.innerHTML =
      '<div class="ov-hero ' + domain + '"><h2 style="color:' + D.color + '">' + esc(D.label) + ' findings</h2>' +
        '<p>' + esc(domain === "co"
          ? "Inspection and audit findings on how the trial is run: protocol and eligibility compliance, informed consent, safety reporting, investigational product and blinding, investigator oversight, sponsor/CRO monitoring, essential documents, ethics submissions and quality systems."
          : "Inspection and audit findings on how trial data are generated, captured and handled: data integrity, source/ALCOA+ documentation, computerised system validation (EDC/IRT/eCOA), audit trails and access, CRF data entry and cleaning, reconciliation, database lock and unblinding, statistical reporting and laboratory data.") + '</p>' +
        (filterOrg ? '<span class="ov-note">Filtered to <b>' + esc(filterOrg.short || filterOrg.name) + '</b> &nbsp;<a href="#" data-clear-org>clear \u2715</a></span>' : '') +
      '</div>' +
      '<div class="kpi-grid">' +
        kpi(D.color, D.soft, domain, list.length, "Findings shown") +
        kpi("#7A00E6", "#f1e6ff", "org", Object.keys(orgsInvolved).length, "Organizations") +
        kpi("#e11d48", "#ffe4ea", "alert", crit, "Critical") +
        kpi("#d97706", "#fef3c7", "alert", major, "Major") +
        kpi("#0071bc", "#e0eefa", "org", regs + " / " + mnc, "Regulator / MNC findings") +
      '</div>' +
      jump +
      (groupsHtml || '<div class="empty">No findings match the current filters.</div>');

    document.getElementById("countLabel").textContent = list.length + " of " + base.length + " findings";
    content.querySelectorAll("[data-collapse]").forEach(function (el) {
      el.addEventListener("click", function () {
        var id = el.getAttribute("data-collapse");
        state.collapsed[id] = !state.collapsed[id];
        el.parentNode.classList.toggle("collapsed");
      });
    });
    content.querySelectorAll("[data-scroll]").forEach(function (el) {
      el.addEventListener("click", function () {
        var id = el.getAttribute("data-scroll");
        var t = document.getElementById("cat-" + id);
        if (t) { t.classList.remove("collapsed"); state.collapsed[id] = false; t.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    });
    var clr = content.querySelector("[data-clear-org]");
    if (clr) clr.addEventListener("click", function (e) { e.preventDefault(); state.orgFilter = null; renderMain(); });
    bindCommon();
  }

  function renderFinding(x) {
    var s = SEVERITY[x.f.sev] || SEVERITY.minor;
    return '<div class="fd" style="--sc:' + s.color + '">' +
      '<div class="fd-top">' + renderLogo(x.org, "org-logo fd-logo") +
        '<b data-go-src="' + esc(x.org.id) + '::' + esc(x.src.id) + '">' + esc(x.org.short || x.org.name) + '</b>' +
        sevBadge(x.f.sev) +
        '<span class="fd-date">' + esc(x.src.publishedAt || "") + '</span>' +
      '</div>' +
      '<div class="fd-text">' + esc(x.f.text) + '</div>' +
      '<div class="fd-meta">' +
        (x.f.ref && !/^https?:/.test(x.f.ref) ? '<span class="ref-pill">' + esc(x.f.ref) + '</span>' : '') +
        (x.src.scope ? '<span class="scope-pill">' + esc(x.src.scope) + '</span>' : '') +
        (x.src.sponsor ? '<span class="scope-pill" style="background:#f1e6ff;color:#5B00AC">Sponsor: ' + esc(x.src.sponsor) + '</span>' : '') +
      '</div>' +
      '<div class="fd-meta">Source: ' +
        (x.src.url ? '<a href="' + esc(x.src.url) + '" target="_blank" rel="noopener">' + esc(x.src.title) + ' \u2197</a>' : esc(x.src.title)) +
        (x.src.type ? ' <span class="src-type" style="margin-left:0">' + esc(x.src.type) + '</span>' : '') +
        secondaryBadge(x.src) +
        (x.f.ref && /^https?:/.test(x.f.ref) ? ' · <a href="' + esc(x.f.ref) + '" target="_blank" rel="noopener">supporting link \u2197</a>' : '') +
      '</div>' +
    '</div>';
  }

  // ---------- Organization view ----------
  function renderOrgView(orgId) {
    var org = findOrg(orgId);
    if (!org) { go("all"); return; }
    var srcs = (org.sources || []).slice().sort(function (a, b) { return toTime(b.publishedAt) - toTime(a.publishedAt); });
    var all = [];
    srcs.forEach(function (s) { (s.findings || []).forEach(function (f, i) { all.push({ org: org, src: s, f: f, idx: i }); }); });
    var nco = all.filter(function (x) { return x.f.domain === "co"; }).length;
    var ndm = all.length - nco;
    var ncrit = all.filter(function (x) { return x.f.sev === "critical"; }).length;
    var color = (orgType(org) || {}).color || "#7A00E6";

    var shown = 0, totalF = all.length, shownF = 0;
    var srcHtml = srcs.map(function (src) {
      var fs = (src.findings || []).map(function (f, i) { return { org: org, src: src, f: f, idx: i }; });
      var vis = fs.filter(function (x) { return matchesFilters(x, { ignoreOrgType: true }); });
      if (!vis.length && (state.query || state.sev !== "all" || state.year !== "all")) return "";
      shown++; shownF += vis.length;
      function col(d) {
        var items = vis.filter(function (x) { return x.f.domain === d; });
        return '<div class="src-col ' + d + '"><h5>' + esc(DOMAIN[d].label) + '<em>' + items.length + '</em></h5>' +
          (items.length ? items.map(function (x) {
            return '<div class="mini-f"><div class="mf-top">' + sevBadge(x.f.sev) + catPill(x.f.cat) +
              (x.f.ref && !/^https?:/.test(x.f.ref) ? '<span class="ref-pill">' + esc(x.f.ref) + '</span>' : '') + '</div>' +
              esc(x.f.text) + '</div>';
          }).join("") : '<div class="none">No ' + esc(DOMAIN[d].label.toLowerCase()) + ' findings captured from this source.</div>') +
        '</div>';
      }
      return '<div class="src' + (state.highlight[src.id] ? " hl" : "") + '" data-src="' + esc(src.id) + '">' +
        '<div class="src-head"><div>' +
          '<div class="src-title">' + (src.url ? '<a href="' + esc(src.url) + '" target="_blank" rel="noopener">' + esc(src.title) + '</a>' : esc(src.title)) +
            (src.type ? '<span class="src-type">' + esc(src.type) + '</span>' : '') + ' ' + secondaryBadge(src) + '</div>' +
          (src.summary ? '<div class="src-summary">' + esc(src.summary) + '</div>' : '') +
          '<div class="src-times"><span>Published: <b>' + esc(src.publishedAt || "\u2014") + '</b></span>' +
            (src.period ? '<span>Period covered: <b>' + esc(src.period) + '</b></span>' : '') +
            (src.scope ? '<span>Inspected party: <b>' + esc(src.scope) + '</b></span>' : '') +
            (src.sponsor ? '<span>Sponsor: <b>' + esc(src.sponsor) + '</b></span>' : '') + '</div>' +
        '</div><div class="src-side"><button class="btn-soft" data-edit="' + esc(org.id) + '::' + esc(src.id) + '">Edit</button></div></div>' +
        '<div class="src-cols">' + col("co") + col("dm") + '</div>' +
      '</div>';
    }).join("");

    content.innerHTML =
      '<section class="org" style="border-top:4px solid ' + color + '">' +
        '<div class="org-header">' + renderLogo(org) +
          '<div class="org-id-block"><h2 class="org-title">' + esc(org.name) + '</h2>' + typeBadge(org) +
            (org.url ? '<a class="org-link" href="' + esc(org.url) + '" target="_blank" rel="noopener">Website \u2197</a>' : '') + '</div>' +
          (org.intro ? '<p class="org-intro">' + esc(org.intro) + '</p>' : '') +
          '<div class="org-stats">' +
            '<div class="stat src"><span class="num">' + srcs.length + '</span><span class="lbl">Sources</span></div>' +
            '<div class="stat co"><span class="num">' + nco + '</span><span class="lbl">Clin Ops findings</span></div>' +
            '<div class="stat dm"><span class="num">' + ndm + '</span><span class="lbl">Data Mgmt findings</span></div>' +
            '<div class="stat crit"><span class="num">' + ncrit + '</span><span class="lbl">Critical</span></div>' +
          '</div>' +
        '</div>' +
        '<div class="org-body">' + (srcHtml || '<div class="empty">No sources match the current filters.</div>') + '</div>' +
      '</section>';

    document.getElementById("countLabel").textContent = shown + " sources \u00B7 " + shownF + " of " + totalF + " findings";
    state.highlight = {};
    content.querySelectorAll("[data-edit]").forEach(function (el) {
      el.addEventListener("click", function () { var p = el.getAttribute("data-edit").split("::"); openEdit(p[0], p[1]); });
    });
  }

  // ---------- Summary by region ----------
  function pct(n, d) { return d ? Math.round(n / d * 1000) / 10 : 0; }

  function smCatRows(list) {
    var by = {};
    list.forEach(function (x) { (by[x.f.cat] = by[x.f.cat] || []).push(x); });
    return Object.keys(by).map(function (id) {
      var items = by[id];
      var orgs = {};
      items.forEach(function (x) { orgs[x.org.id] = 1; });
      return { c: catById(id) || { id: id, label: id, domain: id.slice(0, 2) }, items: items, n: items.length, orgs: Object.keys(orgs).length };
    }).sort(function (a, b) { return b.n - a.n || b.orgs - a.orgs; });
  }

  function smBlock(title, sub, color, list, limit, showSev) {
    var rows = smCatRows(list);
    var total = list.length;
    var shown = limit ? rows.slice(0, limit) : rows;
    var max = Math.max.apply(null, rows.map(function (r) { return r.n; }).concat([1]));
    var body = !rows.length ? '<div class="sm-empty">No findings in this group for this region.</div>' :
      shown.map(function (r) {
        var D = DOMAIN[r.c.domain] || DOMAIN.co;
        return '<details class="sm-cat"><summary>' +
          '<span class="hs-dom" style="background:' + D.soft + ';color:' + D.color + '">' + (r.c.domain === "dm" ? "DM" : "CO") + '</span>' +
          '<span class="sm-name" title="' + esc(r.c.label + ' \u2014 ' + r.orgs + ' organization(s)') + '">' + esc(r.c.label) + '</span>' +
          '<span class="hs-track"><i style="width:' + (r.n / max * 100) + '%;background:' + color + '"></i></span>' +
          '<span class="sm-n">' + r.n + '</span>' +
          '<span class="sm-pct">' + pct(r.n, total) + '%</span>' +
        '</summary><ul class="sm-items">' + r.items.map(function (x) {
          return '<li>' + (showSev ? sevBadge(x.f.sev) + ' ' : '') + '<b>' + esc(x.org.short || x.org.name) + ':</b> ' + esc(x.f.text) +
            ' <a href="' + esc(x.src.url) + '" target="_blank" rel="noopener" title="' + esc(x.src.title) + '">source \u2197</a></li>';
        }).join("") + '</ul></details>';
      }).join("") +
      (limit && rows.length > limit ? '<div class="sm-more">+ ' + (rows.length - limit) + ' more categories with fewer findings</div>' : '');
    return '<div class="sm-block" style="--bc:' + color + '">' +
      '<div class="sm-block-head"><h4>' + title + '</h4><span>' + sub + '</span></div>' +
      (rows.length ? '<div class="sm-cols"><span></span><span>Category</span><span></span><span>n</span><span>Share</span></div>' : '') +
      body + '</div>';
  }

  function renderSummary() {
    var fl = allFindings();
    var regions = REGION_ORDER.map(function (k) {
      var orgs = (state.data.organizations || []).filter(function (o) { return regionOf(o) === k; });
      var list = fl.filter(function (x) { return regionOf(x.org) === k; });
      var crit = list.filter(function (x) { return x.f.sev === "critical"; });
      var maj = list.filter(function (x) { return x.f.sev === "major"; });
      var other = list.filter(function (x) { return x.f.sev === "minor" || x.f.sev === "trend"; });
      var graded = list.length - list.filter(function (x) { return x.f.sev === "trend"; }).length;
      var flagged = {};
      list.forEach(function (x) { if (x.src.flag && /Allegation|Media|Secondary|Indirect|Preliminary|Limited/i.test(x.src.flag)) flagged[x.src.id] = 1; });
      return { k: k, R: REGION[k], orgs: orgs, list: list, crit: crit, maj: maj, other: other, graded: graded, flagged: Object.keys(flagged).length,
        topCrit: smCatRows(crit)[0], topMaj: smCatRows(maj)[0] };
    }).filter(function (r) { return r.list.length; });

    var table = '<div class="panel"><h3>Regions at a glance</h3><div class="sm-table-wrap"><table class="sm-table"><thead><tr>' +
      '<th>Region</th><th>Orgs</th><th>Findings</th><th>Critical</th><th>Critical rate</th><th>Major</th><th>Major rate</th><th>Top critical category</th><th>Top major category</th></tr></thead><tbody>' +
      regions.map(function (r) {
        return '<tr><td><a class="sm-jump" data-smjump="' + r.k + '" style="--rc:' + r.R.color + '"><i></i>' + esc(r.R.label) + '</a></td>' +
          '<td>' + r.orgs.length + '</td><td>' + r.list.length + '</td>' +
          '<td class="sm-c">' + r.crit.length + '</td><td><span class="sm-rate" style="--sc:' + SEVERITY.critical.color + '">' + pct(r.crit.length, r.graded) + '%</span></td>' +
          '<td class="sm-m">' + r.maj.length + '</td><td><span class="sm-rate" style="--sc:' + SEVERITY.major.color + '">' + pct(r.maj.length, r.graded) + '%</span></td>' +
          '<td>' + (r.topCrit ? esc(r.topCrit.c.label) + ' <small>(' + r.topCrit.n + ')</small>' : '\u2014') + '</td>' +
          '<td>' + (r.topMaj ? esc(r.topMaj.c.label) + ' <small>(' + r.topMaj.n + ')</small>' : '\u2014') + '</td></tr>';
      }).join("") + '</tbody></table></div>' +
      '<div class="caption">Rate = share of the region\u2019s graded findings (critical + major + minor; trend statistics excluded). Click a region to jump to its section.</div></div>';

    var sections = regions.map(function (r) {
      return '<section class="panel sm-region" id="sm-' + r.k + '" style="--rc:' + r.R.color + '">' +
        '<div class="sm-rhead"><div><h3>' + esc(r.R.label) + '</h3><p>' + esc(r.R.note) + '</p></div>' +
          '<div class="sm-stats">' +
            '<span><b>' + r.list.length + '</b> findings</span>' +
            '<span style="--sc:' + SEVERITY.critical.color + '"><b>' + r.crit.length + '</b> critical \u00B7 ' + pct(r.crit.length, r.graded) + '%</span>' +
            '<span style="--sc:' + SEVERITY.major.color + '"><b>' + r.maj.length + '</b> major \u00B7 ' + pct(r.maj.length, r.graded) + '%</span>' +
            '<span><b>' + r.other.length + '</b> minor / trend</span>' +
          '</div></div>' +
        '<div class="sm-orgs">' + r.orgs.map(function (o) {
          return '<button class="nav-chip nav-org" data-go="' + esc(o.id) + '" style="--brand:' + (orgType(o) || {}).color + '">' + navLogo(o) + '<span>' + esc(o.short || o.name) + '</span></button>';
        }).join("") + '</div>' +
        '<div class="sm-grid">' +
          smBlock("1. Critical findings", r.crit.length + ' findings \u00B7 share = % of the region\u2019s critical findings', SEVERITY.critical.color, r.crit, 0, false) +
          smBlock("2. Major findings", r.maj.length + ' findings \u00B7 share = % of the region\u2019s major findings', SEVERITY.major.color, r.maj, 8, false) +
          smBlock("3. Other issues to watch", r.other.length + ' minor findings and trend statistics' + (r.flagged ? ' \u00B7 ' + r.flagged + ' source(s) flagged as allegation, media, secondary or preliminary' : ''), "#7A00E6", r.other, 6, true) +
        '</div></section>';
    }).join("");

    content.innerHTML =
      '<div class="ov-hero sm-hero"><h2>Summary by region</h2>' +
        '<p>Critical and major findings, and other points to watch, grouped by region. Each organization is assigned to the region of its jurisdiction (regulators) or headquarters (companies, CROs, industry bodies); Switzerland is shown separately. Click any category to see the underlying findings and sources.</p></div>' +
      '<div class="sm-chips">' + regions.map(function (r) {
        return '<button class="sm-chip" data-smjump="' + r.k + '" style="--rc:' + r.R.color + '">' + esc(r.R.label) + '<em>' + r.crit.length + ' C</em></button>';
      }).join("") + '</div>' +
      table + sections;

    content.querySelectorAll("[data-smjump]").forEach(function (el) {
      el.addEventListener("click", function () {
        var t = document.getElementById("sm-" + el.getAttribute("data-smjump"));
        if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
    bindCommon();
  }

  // ---------- Cross-comparison ----------
  function renderCompare() {
    var orgs = (state.data.organizations || []).slice().sort(function (a, b) {
      return ORG_ORDER.indexOf(a.category) - ORG_ORDER.indexOf(b.category);
    });
    var fl = allFindings();
    var map = {};
    fl.forEach(function (x) {
      var k = x.f.cat + "|" + x.org.id;
      map[k] = (map[k] || 0) + 1;
    });
    var maxCell = Math.max.apply(null, Object.keys(map).map(function (k) { return map[k]; }).concat([1]));

    var head = '<tr><th class="theme-col">Finding category</th>' + orgs.map(function (o) {
      return '<th title="' + esc(o.name) + '" style="color:' + (orgType(o) || {}).color + '">' + esc(o.short || o.name) + '</th>';
    }).join("") + '<th>Orgs</th></tr>';

    var body = ["co", "dm"].map(function (d) {
      var D = DOMAIN[d];
      var rows = categories().filter(function (c) { return c.domain === d; }).map(function (c) {
        var cover = 0;
        var cells = orgs.map(function (o) {
          var n = map[c.id + "|" + o.id] || 0;
          if (!n) return '<td><span class="heat zero">\u00B7</span></td>';
          cover++;
          var a = 0.15 + 0.85 * (n / maxCell);
          var bg = "color-mix(in srgb, " + D.color + " " + Math.round(a * 100) + "%, #fff)";
          var fg = a > 0.5 ? "#fff" : D.color;
          return '<td><span class="heat" style="background:' + bg + ';color:' + fg + '" data-cell="' + d + '::' + c.id + '::' + esc(o.id) + '" title="' + esc(o.name + " \u2014 " + c.label + ": " + n + " finding(s)") + '">' + n + '</span></td>';
        }).join("");
        return '<tr><td class="theme-cell">' + esc(c.label) + '</td>' + cells + '<td><span class="cov-count">' + cover + '</span></td></tr>';
      }).join("");
      return '<tr class="dom-row" style="--dc:' + D.color + '"><td colspan="' + (orgs.length + 2) + '">' + esc(D.label) + '</td></tr>' + rows;
    }).join("");

    content.innerHTML =
      '<div class="ov-hero"><h2>Cross-comparison matrix</h2>' +
        '<p>How often each finding category appears in each organization\u2019s published sources. Darker cells mean more findings. <b>Click a cell</b> to open that category in the domain view, filtered to the organization. The "Orgs" column counts how many organizations report the category; higher numbers point to systemic, cross-industry issues.</p></div>' +
      '<div class="matrix-wrap"><table class="matrix"><thead>' + head + '</thead><tbody>' + body + '</tbody></table></div>' +
      renderInsights(fl);

    content.querySelectorAll("[data-cell]").forEach(function (el) {
      el.addEventListener("click", function () {
        var p = el.getAttribute("data-cell").split("::");
        state.orgFilter = p[2];
        state.orgType = "all"; state.sev = "all"; state.year = "all"; state.query = "";
        document.getElementById("searchInput").value = "";
        state.view = p[0];
        render();
        setTimeout(function () {
          var t = document.getElementById("cat-" + p[1]);
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 60);
      });
    });
  }

  function topCats(fl, domain, n, filterFn) {
    var counts = {}, orgsBy = {};
    fl.forEach(function (x) {
      if (x.f.domain !== domain || (filterFn && !filterFn(x))) return;
      counts[x.f.cat] = (counts[x.f.cat] || 0) + 1;
      (orgsBy[x.f.cat] = orgsBy[x.f.cat] || {})[x.org.id] = 1;
    });
    return Object.keys(counts).map(function (k) { return { id: k, n: counts[k], orgs: Object.keys(orgsBy[k]).length }; })
      .sort(function (a, b) { return b.orgs - a.orgs || b.n - a.n; }).slice(0, n);
  }

  function renderInsights(fl) {
    var isReg = function (x) { return x.org.category === "regulator"; };
    var isMnc = function (x) { return x.org.category === "mnc"; };
    function li(arr) {
      return arr.map(function (t) { return '<li><b>' + esc(catLabel(t.id)) + '</b> \u2014 ' + t.n + ' findings across ' + t.orgs + ' organizations</li>'; }).join("");
    }
    var critCats = {};
    fl.forEach(function (x) { if (x.f.sev === "critical") critCats[x.f.cat] = (critCats[x.f.cat] || 0) + 1; });
    var critTop = Object.keys(critCats).sort(function (a, b) { return critCats[b] - critCats[a]; }).slice(0, 4)
      .map(function (k) { return '<li><b>' + esc(catLabel(k)) + '</b> \u2014 ' + critCats[k] + ' critical findings</li>'; }).join("");

    var curated = (state.data.insights || []).map(function (ins) {
      return '<div class="insight-card" style="--ic:' + (ins.color || "#7A00E6") + '"><h4>' + esc(ins.title) + '</h4>' +
        (ins.meta ? '<div class="ic-meta">' + esc(ins.meta) + '</div>' : '') +
        '<ul>' + (ins.bullets || []).map(function (b) { return '<li>' + esc(b) + '</li>'; }).join("") + '</ul></div>';
    }).join("");

    return '<div class="insight-head"><span class="ai-chip">\u2726 AI Insight</span><h2>What the findings are telling us</h2></div>' +
      '<p class="insight-sub">The first four cards are calculated live from the data in this hub. The rest are curated readings of the sources and can be edited in <code>data.js</code> (<code>insights</code>).</p>' +
      '<div class="insight-grid">' +
        '<div class="insight-card" style="--ic:' + DOMAIN.co.color + '"><h4>Most widespread Clinical Operations issues</h4><div class="ic-meta">Ranked by number of organizations reporting them</div><ul>' + li(topCats(fl, "co", 4)) + '</ul></div>' +
        '<div class="insight-card" style="--ic:' + DOMAIN.dm.color + '"><h4>Most widespread Data Management issues</h4><div class="ic-meta">Ranked by number of organizations reporting them</div><ul>' + li(topCats(fl, "dm", 4)) + '</ul></div>' +
        '<div class="insight-card" style="--ic:#e11d48"><h4>Where the critical findings sit</h4><div class="ic-meta">Categories with the most findings graded critical</div><ul>' + critTop + '</ul></div>' +
        '<div class="insight-card" style="--ic:#7A00E6"><h4>Regulators vs. MNC pharma cases</h4><div class="ic-meta">Top categories in each group</div><ul>' +
          topCats(fl, "co", 2, isReg).concat(topCats(fl, "dm", 1, isReg)).map(function (t) { return '<li>Regulators: <b>' + esc(catLabel(t.id)) + '</b> (' + t.n + ')</li>'; }).join("") +
          topCats(fl, "co", 2, isMnc).concat(topCats(fl, "dm", 1, isMnc)).map(function (t) { return '<li>MNC pharma: <b>' + esc(catLabel(t.id)) + '</b> (' + t.n + ')</li>'; }).join("") +
        '</ul></div>' +
        curated +
      '</div>';
  }

  // ---------- Shared bindings ----------
  function bindCommon() {
    content.querySelectorAll("[data-hs-toggle]").forEach(function (el) {
      el.addEventListener("click", function () {
        var y = window.scrollY;
        state.hsAll = !state.hsAll;
        render();
        window.scrollTo(0, y);
      });
    });
    content.querySelectorAll("[data-go]").forEach(function (el) {
      el.addEventListener("click", function () { go(el.getAttribute("data-go")); });
    });
    content.querySelectorAll("[data-jumpcat]").forEach(function (el) {
      el.addEventListener("click", function () {
        var p = el.getAttribute("data-jumpcat").split("::");
        go(p[0]);
        setTimeout(function () {
          var t = document.getElementById("cat-" + p[1]);
          if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 80);
      });
    });
    content.querySelectorAll("[data-go-src]").forEach(function (el) {
      el.addEventListener("click", function () {
        var p = el.getAttribute("data-go-src").split("::");
        state.highlight = {}; state.highlight[p[1]] = true;
        state.query = ""; document.getElementById("searchInput").value = "";
        state.sev = "all"; state.year = "all";
        state.view = p[0];
        render();
        setTimeout(function () {
          var t = content.querySelector('.src[data-src="' + p[1] + '"]');
          if (t) t.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 60);
      });
    });
  }

  // ---------- Add / edit ----------
  var editModal = document.getElementById("editModal");
  var fOrg = document.getElementById("fOrg");

  function openEdit(orgId, srcId) {
    fOrg.innerHTML = (state.data.organizations || []).map(function (o) {
      return '<option value="' + esc(o.id) + '">' + esc(o.name) + '</option>';
    }).join("");
    document.getElementById("catHelp").textContent = "Category ids: " + categories().map(function (c) { return c.id; }).join(", ") + " · Severity: " + Object.keys(SEVERITY).join(", ");
    var org = orgId ? findOrg(orgId) : null;
    var src = org && srcId ? (org.sources || []).find(function (s) { return s.id === srcId; }) : null;
    state.editing = { orgId: orgId, srcId: src ? src.id : null };
    document.getElementById("editTitle").textContent = src ? "Edit source" : "Add source";
    document.getElementById("deleteBtn").style.display = src ? "inline-block" : "none";
    fOrg.value = orgId || (findOrg(state.view) ? state.view : (state.data.organizations[0] || {}).id);
    var v = function (k) { return src ? (src[k] || "") : ""; };
    document.getElementById("fTitle").value = v("title");
    document.getElementById("fType").value = v("type");
    document.getElementById("fUrl").value = v("url");
    document.getElementById("fPublished").value = v("publishedAt");
    document.getElementById("fPeriod").value = v("period");
    document.getElementById("fScope").value = v("scope");
    document.getElementById("fSummary").value = v("summary");
    document.getElementById("fFindings").value = src ? (src.findings || []).map(function (f) {
      return [f.domain, f.cat, f.sev, f.text, f.ref || ""].join(" | ");
    }).join("\n") : "";
    editModal.classList.add("open");
  }

  function parseFindings(text) {
    return text.split("\n").map(function (l) { return l.trim(); }).filter(Boolean).map(function (l) {
      var p = l.split("|").map(function (s) { return s.trim(); });
      var cat = catById(p[1]);
      return {
        domain: p[0] === "dm" ? "dm" : "co",
        cat: cat ? cat.id : (p[0] === "dm" ? "dm-integrity" : "co-protocol"),
        sev: SEVERITY[p[2]] ? p[2] : "minor",
        text: p[3] || "",
        ref: p[4] || ""
      };
    });
  }

  document.getElementById("saveEditBtn").addEventListener("click", function () {
    var title = document.getElementById("fTitle").value.trim();
    if (!title) { alert("Please enter a title"); return; }
    var org = findOrg(fOrg.value);
    if (!org) return;
    var data = {
      title: title,
      type: document.getElementById("fType").value.trim(),
      url: document.getElementById("fUrl").value.trim(),
      publishedAt: document.getElementById("fPublished").value.trim(),
      period: document.getElementById("fPeriod").value.trim(),
      scope: document.getElementById("fScope").value.trim(),
      summary: document.getElementById("fSummary").value.trim(),
      findings: parseFindings(document.getElementById("fFindings").value)
    };
    var ed = state.editing || {};
    if (ed.srcId) {
      var oldOrg = findOrg(ed.orgId);
      var existing = oldOrg && (oldOrg.sources || []).find(function (s) { return s.id === ed.srcId; });
      if (existing && oldOrg === org) Object.assign(existing, data);
      else {
        if (oldOrg) oldOrg.sources = oldOrg.sources.filter(function (s) { return s.id !== ed.srcId; });
        data.id = ed.srcId;
        (org.sources = org.sources || []).push(data);
      }
    } else {
      data.id = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40) + "-" + Date.now().toString(36);
      (org.sources = org.sources || []).push(data);
    }
    persist();
    editModal.classList.remove("open");
    updateHeaderMeta();
    render();
  });
  document.getElementById("deleteBtn").addEventListener("click", function () {
    var ed = state.editing;
    if (!ed || !ed.srcId || !confirm("Delete this source and all its findings?")) return;
    var org = findOrg(ed.orgId);
    if (org) org.sources = (org.sources || []).filter(function (s) { return s.id !== ed.srcId; });
    persist();
    editModal.classList.remove("open");
    updateHeaderMeta();
    render();
  });
  document.getElementById("cancelEditBtn").addEventListener("click", function () { editModal.classList.remove("open"); });
  document.getElementById("addBtn").addEventListener("click", function () { openEdit(findOrg(state.view) ? state.view : null, null); });
  editModal.addEventListener("click", function (e) { if (e.target === editModal) editModal.classList.remove("open"); });

  // ---------- Export ----------
  var exportModal = document.getElementById("exportModal");
  document.getElementById("exportBtn").addEventListener("click", function () {
    document.getElementById("exportArea").value =
      "/* Clinical Inspection Findings Source Hub - data (exported from page) */\nwindow.DATA = " + JSON.stringify(state.data, null, 2) + ";\n";
    exportModal.classList.add("open");
  });
  document.getElementById("copyExportBtn").addEventListener("click", function () {
    var ta = document.getElementById("exportArea");
    ta.select();
    try { navigator.clipboard.writeText(ta.value); } catch (e) { document.execCommand("copy"); }
    this.textContent = "Copied \u2713";
    var btn = this;
    setTimeout(function () { btn.textContent = "Copy to clipboard"; }, 1500);
  });
  document.getElementById("closeExportBtn").addEventListener("click", function () { exportModal.classList.remove("open"); });
  exportModal.addEventListener("click", function (e) { if (e.target === exportModal) exportModal.classList.remove("open"); });

  // ---------- Header meta ----------
  function updateHeaderMeta() {
    var orgs = state.data.organizations || [];
    var fl = allFindings();
    var co = fl.filter(function (x) { return x.f.domain === "co"; }).length;
    document.getElementById("headerMeta").innerHTML =
      '<div class="hstat"><b>' + orgs.length + '</b><span>Organizations</span></div>' +
      '<div class="hstat"><b>' + allSources().length + '</b><span>Sources</span></div>' +
      '<div class="hstat"><b>' + co + '</b><span>Clin Ops findings</span></div>' +
      '<div class="hstat"><b>' + (fl.length - co) + '</b><span>Data Mgmt findings</span></div>' +
      (state.data.lastCheckedAt ? '<div class="hstat"><b style="font-size:14px;">' + esc(state.data.lastCheckedAt) + '</b><span>Last refreshed</span></div>' : '');
  }

  // ---------- Boot ----------
  updateHeaderMeta();
  render();

  window.resetHubData = function () {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  };
})();
