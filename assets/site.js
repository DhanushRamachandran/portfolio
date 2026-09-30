/* Site chrome (header, footer, theme, command palette) + page renderers. Content lives in content.js. */
(function () {
  const S = window.SITE, P = S.person;
  const page = document.body.dataset.page;
  const $ = (s, r = document) => r.querySelector(s);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };

  const PAGES = [
    { id: "profile", label: "profile", href: "index.html", title: "Profile" },
    { id: "projects", label: "projects", href: "projects.html", title: "Projects" },
    { id: "research", label: "research", href: "research.html", title: "Research interests" },
    { id: "writeups", label: "writeups", href: "writeups.html", title: "Writeups" },
    { id: "resume", label: "resume", href: "resume.html", title: "Resume" }
  ];
  const ICON = {
    sun: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></svg>',
    moon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>',
    gh: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 .5A11.5 11.5 0 0 0 8.4 22.9c.6.1.8-.2.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.5-1.3-1.3-1.7-1.3-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.8 1.3 3.5 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.5-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0C17.3 4.4 18.3 4.7 18.3 4.7c.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.4.8 1.1.8 2.2v3.3c0 .4.2.7.8.6A11.5 11.5 0 0 0 12 .5z"/></svg>',
    li: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.4 20.5h-3.6v-5.6c0-1.3 0-3-1.8-3s-2.1 1.4-2.1 2.9v5.7H9.3V9h3.4v1.6c.5-.9 1.6-1.8 3.4-1.8 3.6 0 4.3 2.4 4.3 5.5v6.2zM5.3 7.4a2.1 2.1 0 1 1 0-4.2 2.1 2.1 0 0 1 0 4.2zM7.1 20.5H3.6V9h3.5v11.5zM22.2 0H1.8C.8 0 0 .8 0 1.7v20.6c0 .9.8 1.7 1.8 1.7h20.4c1 0 1.8-.8 1.8-1.7V1.7C24 .8 23.2 0 22.2 0z"/></svg>',
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M12 18v-6M9 15l3 3 3-3"/></svg>'
  };

  /* ---------------- theme ---------------- */
  const root = document.documentElement;
  const saved = store.get("theme");
  if (saved === "light" || saved === "dark") root.dataset.theme = saved;
  const isDark = () => root.dataset.theme ? root.dataset.theme === "dark" : matchMedia("(prefers-color-scheme: dark)").matches;
  function toggleTheme() {
    root.dataset.theme = isDark() ? "light" : "dark";
    store.set("theme", root.dataset.theme);
    paintThemeBtn();
  }
  function paintThemeBtn() {
    const b = $("#theme-btn"); if (!b) return;
    b.innerHTML = isDark() ? ICON.sun : ICON.moon;
    b.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme");
  }

  /* ---------------- chrome ---------------- */
  const cur = PAGES.find((p) => p.id === page) || PAGES[0];
  const header = document.createElement("header");
  header.className = "bar";
  header.innerHTML = `
    <div class="wrap">
      <a class="path" href="index.html">~/<b>${esc(P.handle)}</b>${cur.id === "profile" ? "" : `/<span class="cur">${cur.label}</span>`}</a>
      <nav class="nav" aria-label="Main">
        ${PAGES.map((p) => `<a href="${p.href}"${p.id === page ? ' aria-current="page"' : ""}>${p.label}</a>`).join("")}
      </nav>
      <div class="tools">
        <button class="kbtn" id="cmdk-btn" type="button" aria-label="Open command palette"><span class="lbl">Jump to…</span><kbd>Ctrl K</kbd></button>
        <button class="btn-icon" id="theme-btn" type="button"></button>
      </div>
    </div>`;
  document.body.prepend(header);

  const footer = document.createElement("footer");
  footer.className = "foot";
  footer.innerHTML = `<div class="wrap"><span>© ${new Date().getFullYear()} ${esc(P.name)} · ${esc(P.location)}</span>
    <span><a href="${P.links.github}" target="_blank" rel="noopener">github</a> · <a href="${P.links.linkedin}" target="_blank" rel="noopener">linkedin</a> · press <kbd>/</kbd> to search</span></div>`;
  document.body.append(footer);
  paintThemeBtn();
  $("#theme-btn").addEventListener("click", toggleTheme);

  /* ---------------- helpers ---------------- */
  function toast(msg) {
    const t = document.createElement("div");
    t.className = "toast"; t.setAttribute("role", "status"); t.textContent = msg;
    document.body.append(t); setTimeout(() => t.remove(), 1800);
  }
  function copyText(text, el) {
    const done = () => toast("Copied " + text);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(done, () => selectFallback(el));
    } else selectFallback(el);
  }
  function selectFallback(el) {
    if (!el) return;
    const r = document.createRange(); r.selectNodeContents(el);
    const s = getSelection(); s.removeAllRanges(); s.addRange(r);
    toast("Press Ctrl+C to copy");
  }
  function copyField() {
    return `<div class="copy-field"><span id="email-text">${esc(P.email)}</span><button type="button" data-copy-email>Copy</button></div>`;
  }
  document.addEventListener("click", (e) => {
    if (e.target.closest("[data-copy-email]")) copyText(P.email, $("#email-text"));
  });
  const projById = Object.fromEntries(S.projects.map((p) => [p.id, p]));
  const sectionHead = (tag, title, extra = "") =>
    `<div class="section-head"><div><span class="eyebrow"><span class="hash">#</span> ${esc(tag)}</span><h2>${esc(title)}</h2></div>${extra}</div>`;
  function projectCard(p) {
    return `<a class="card" href="projects.html#${p.id}">
      ${p.image ? `<img class="cover" src="${esc(p.image)}" alt="" loading="lazy">` : ""}
      <div class="meta"><span>${esc(p.kind)}${p.org ? " · " + esc(p.org) : ""}</span><span>${esc(p.year)}</span></div>
      <h3>${esc(p.title)}</h3>
      <p>${esc(p.summary)}</p>
      <div class="impact">→ ${esc(p.impact[0])}</div>
      <div class="chips">${p.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
    </a>`;
  }
  function expItem(x, full) {
    return `<div class="tl-item">
      <div class="tl-top"><h3>${esc(x.role)} <span class="tl-org">· ${esc(x.org)}</span></h3><span class="tl-when">${esc(x.dates)}</span></div>
      <ul>${(full ? x.bullets : x.bullets.slice(0, 2)).map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
      <div class="chips">${x.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
    </div>`;
  }

  /* ---------------- pages ---------------- */
  const main = $("main");
  const R = {};

  R.profile = () => {
    const traceLines = [
      ['<span class="t-p">$</span> whoami', ""],
      [`<span class="t-a">${esc(P.name.toLowerCase())}</span> <span class="t-p">// ${esc(P.location)}</span>`, ""],
      ["", ""],
      ['<span class="t-p">$</span> agent run <span class="t-a">"what does dhanush build?"</span>', ""],
      ['<span class="t-w">supervisor</span> ▸ routing to 3 workers', ""],
      ['  <span class="t-p">├─</span> retrieval  ▸ GraphRAG · pgvector · Milvus', ""],
      ['  <span class="t-p">├─</span> platforms  ▸ Databricks · Airflow · Datadog MCP', ""],
      ['  <span class="t-p">└─</span> modeling   ▸ PyTorch · RL · contrastive', ""],
      ['<span class="t-w">supervisor</span> ▸ grounding answer in 3 sources', ""],
      ['<span class="t-ok">✓</span> agents that cite their evidence', ""],
      ['<span class="t-ok">✓</span> retrieval that is fast enough to use', ""],
      ['<span class="t-p">$</span> <span class="t-a">▍</span>', ""]
    ];
    main.innerHTML = `
      <section class="hero">
        <div>
          <div class="status"><span class="pulse" aria-hidden="true"></span>${esc(P.status)}</div>
          <h1>${esc(P.name)}<span class="role">${esc(P.role)}</span></h1>
          <p class="tagline">${esc(P.tagline)}</p>
          <div class="row">
            <a class="btn primary" href="projects.html">View projects <span class="arrow">→</span></a>
            <a class="btn" href="resume.html">${ICON.doc} Resume</a>
            <a class="btn" href="${P.links.github}" target="_blank" rel="noopener" aria-label="GitHub">${ICON.gh}</a>
            <a class="btn" href="${P.links.linkedin}" target="_blank" rel="noopener" aria-label="LinkedIn">${ICON.li}</a>
          </div>
        </div>
        <div class="panel trace" aria-label="Terminal-style summary">
          <div class="trace-head"><span class="dots"><i></i><i></i><i></i></span> agent.trace <button class="replay" type="button" id="replay">↻ replay</button></div>
          <pre>${traceLines.map((l) => `<span class="ln">${l[0] || " "}</span>`).join("")}</pre>
        </div>
      </section>

      <section aria-label="Highlights">
        <div class="metrics">${S.metrics.map((m) => `<div class="metric"><span class="v">${esc(m.value)}</span><span class="l">${esc(m.label)}</span><span class="c">${esc(m.ctx)}</span></div>`).join("")}</div>
      </section>

      <section class="two">
        <div><span class="eyebrow"><span class="hash">#</span> about</span></div>
        <div class="prose">${P.about.map((a) => `<p>${esc(a)}</p>`).join("")}</div>
      </section>

      <section>
        ${sectionHead("experience", "Where I've worked", `<a class="back" href="resume.html">full resume →</a>`)}
        <div class="timeline">${S.experience.map((x) => expItem(x, false)).join("")}</div>
      </section>

      <section>
        ${sectionHead("selected work", "Projects", `<a class="back" href="projects.html">all ${S.projects.length} projects →</a>`)}
        <div class="grid-cards">${(S.projects.filter((p) => p.featured).length ? S.projects.filter((p) => p.featured) : S.projects.slice(0, 3)).map(projectCard).join("")}</div>
      </section>

      <section class="two">
        <div><span class="eyebrow"><span class="hash">#</span> toolbox</span></div>
        <dl class="skills-table">${Object.entries(S.skills).map(([k, v]) => `<dt>${esc(k)}</dt><dd class="chips">${v.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</dd>`).join("")}</dl>
      </section>

      <section class="two">
        <div><span class="eyebrow"><span class="hash">#</span> education</span></div>
        <div class="timeline">${S.education.map((e) => `<div class="tl-item"><div class="tl-top"><h3>${esc(e.degree)} <span class="tl-org">· ${esc(e.school)}</span></h3><span class="tl-when">${esc(e.dates)}</span></div><div class="muted mono" style="font-size:.85rem">${esc(e.grade)}</div></div>`).join("")}
          <div class="tl-item"><div class="tl-top"><h3>Certifications</h3></div><div class="chips">${S.certificates.map((c) => `<span class="chip accent">${esc(c)}</span>`).join("")}</div></div>
        </div>
      </section>

      <section class="panel contact">
        <div><span class="eyebrow"><span class="hash">#</span> contact</span><h2 style="font-size:var(--step-2);margin-top:6px">Let's talk about AI systems.</h2></div>
        ${copyField()}
      </section>`;

    const lines = [...main.querySelectorAll(".trace .ln")];
    function play() {
      if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      lines.forEach((l) => l.classList.add("dim"));
      lines.forEach((l, i) => setTimeout(() => l.classList.remove("dim"), 180 + i * 170));
    }
    play();
    $("#replay").addEventListener("click", play);
  };

  R.projects = () => {
    const tags = {};
    S.projects.forEach((p) => p.tags.forEach((t) => (tags[t] = (tags[t] || 0) + 1)));
    const tagList = Object.entries(tags).sort((a, b) => b[1] - a[1]);
    let active = "All", q = "";

    main.innerHTML = `<section id="list-view">
      ${sectionHead("projects", "Things I've built", `<p class="muted mono" style="font-size:.8rem">${S.projects.length} projects · work, academic, personal</p>`)}
      <div class="filters">
        <label class="search" for="proj-q"><span class="mono muted">⌕</span><input id="proj-q" type="search" placeholder="filter by name, stack, outcome…" autocomplete="off"></label>
        <div class="chips" id="tagbar" role="group" aria-label="Filter by tag">
          ${[["All", S.projects.length], ...tagList].map(([t, n]) => `<button type="button" class="filter-chip" data-tag="${esc(t)}" aria-pressed="${t === "All"}">${esc(t)}<span class="n">${n}</span></button>`).join("")}
        </div>
      </div>
      <div class="grid-cards" id="proj-grid"></div>
    </section>
    <section id="detail-view" hidden></section>`;

    const grid = $("#proj-grid");
    function renderList() {
      const ql = q.toLowerCase();
      const items = S.projects.filter((p) =>
        (active === "All" || p.tags.includes(active)) &&
        (!ql || JSON.stringify([p.title, p.summary, p.stack, p.tags, p.impact, p.org]).toLowerCase().includes(ql)));
      grid.innerHTML = items.length ? items.map(projectCard).join("") : `<div class="empty">No projects match “${esc(q)}”. Clear the filter to see all ${S.projects.length}.</div>`;
    }
    $("#tagbar").addEventListener("click", (e) => {
      const b = e.target.closest("[data-tag]"); if (!b) return;
      active = b.dataset.tag;
      document.querySelectorAll("#tagbar [data-tag]").forEach((x) => x.setAttribute("aria-pressed", x === b));
      renderList();
    });
    $("#proj-q").addEventListener("input", (e) => { q = e.target.value.trim(); renderList(); });

    function renderDetail(p) {
      const links = [p.repo && `<a class="btn" href="${p.repo}" target="_blank" rel="noopener">${ICON.gh} Code</a>`, p.demo && `<a class="btn" href="${p.demo}" target="_blank" rel="noopener">Live demo →</a>`].filter(Boolean).join("");
      const related = S.research.filter((r) => r.evidence.includes(p.id));
      $("#detail-view").innerHTML = `
        <a class="back" href="projects.html#all">← all projects</a>
        <article class="panel detail" style="margin-top:16px">
          ${p.image ? `<img class="cover" src="${esc(p.image)}" alt="${esc(p.title)}">` : ""}
          <div>
            <div class="eyebrow">${esc(p.kind)}${p.org ? " · " + esc(p.org) : ""} · ${esc(p.year)}</div>
            <h1 style="font-size:var(--step-3);margin-top:8px">${esc(p.title)}</h1>
            <p class="lede" style="margin-top:12px">${esc(p.summary)}</p>
          </div>
          <div class="kv">
            <div class="k">Problem</div><p>${esc(p.problem)}</p>
            <div class="k">What I built</div><ul>${p.build.map((b) => `<li>${esc(b)}</li>`).join("")}</ul>
            <div class="k">Outcome</div><div class="chips">${p.impact.map((i) => `<span class="chip accent">${esc(i)}</span>`).join("")}</div>
            <div class="k">Stack</div><div class="chips">${p.stack.map((s) => `<span class="chip">${esc(s)}</span>`).join("")}</div>
            ${related.length ? `<div class="k">Research area</div><div class="chips">${related.map((r) => `<a class="chip" href="research.html">${esc(r.area)}</a>`).join("")}</div>` : ""}
          </div>
          ${links ? `<div class="row">${links}</div>` : ""}
        </article>`;
    }
    function route() {
      const id = location.hash.slice(1);
      const p = projById[id];
      $("#list-view").hidden = !!p; $("#detail-view").hidden = !p;
      if (p) { renderDetail(p); document.title = p.title + " · " + P.name; scrollTo(0, 0); }
      else document.title = "Projects · " + P.name;
    }
    addEventListener("hashchange", route);
    renderList(); route();
  };

  R.research = () => {
    main.innerHTML = `<section>
      ${sectionHead("research interests", "Questions I want to work on")}
      <p class="lede">These come straight out of problems I've hit while building. Each area links to the projects that raised it.</p>
    </section>
    <section class="areas">
      ${S.research.map((r, i) => `<article class="panel area" id="area-${i + 1}">
        <div>
          <div class="idx">area.${String(i + 1).padStart(2, "0")}</div>
          <h3>${esc(r.area)}</h3>
          <p>${esc(r.body)}</p>
          <div class="chips" style="margin-top:14px">${r.keywords.map((k) => `<span class="chip">${esc(k)}</span>`).join("")}</div>
        </div>
        <div class="qs">
          <span class="eyebrow">open questions</span>
          <ul>${r.questions.map((q) => `<li>${esc(q)}</li>`).join("")}</ul>
          <div class="ev"><span class="eyebrow" style="width:100%">related work</span>${r.evidence.filter((id) => projById[id]).map((id) => `<a href="projects.html#${id}">${esc(projById[id].title)} →</a>`).join("")}</div>
        </div>
      </article>`).join("")}
    </section>`;
  };

  R.writeups = () => {
    main.innerHTML = `<section id="list-view">
      ${sectionHead("writeups", "Notes from building", `<p class="muted mono" style="font-size:.8rem">${S.writeups.length} posts</p>`)}
      <div class="posts">${S.writeups.map((w) => `<a class="post-row" href="writeups.html#${w.id}">
        <span class="date">${esc(w.date)}</span>
        <div><h3>${esc(w.title)}</h3><p>${esc(w.dek)}</p></div>
        <div class="chips">${w.status === "draft" ? '<span class="chip draft">draft</span>' : ""}<span class="chip">${esc(w.read)}</span></div>
      </a>`).join("")}</div>
    </section>
    <section id="post-view" hidden></section>`;

    function block(b) {
      if (b.h) return `<h2>${esc(b.h)}</h2>`;
      if (b.code) return `<pre><code>${esc(b.code)}</code></pre>`;
      if (b.list) return `<ul>${b.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>`;
      if (b.p) return /^TODO:/.test(b.p) ? `<p class="todo">${esc(b.p)}</p>` : `<p>${esc(b.p)}</p>`;
      return "";
    }
    function route() {
      const w = S.writeups.find((x) => x.id === location.hash.slice(1));
      $("#list-view").hidden = !!w; $("#post-view").hidden = !w;
      if (!w) { document.title = "Writeups · " + P.name; return; }
      document.title = w.title + " · " + P.name;
      $("#post-view").innerHTML = `<a class="back" href="writeups.html#all">← all writeups</a>
        <article class="article" style="margin-top:20px">
          <div class="row"><span class="eyebrow">${esc(w.date)} · ${esc(w.read)}</span>${w.status === "draft" ? '<span class="chip draft">draft</span>' : ""}${w.tags.map((t) => `<span class="chip">${esc(t)}</span>`).join("")}</div>
          <h1>${esc(w.title)}</h1>
          <p class="dek">${esc(w.dek)}</p>
          ${w.body.map(block).join("")}
        </article>`;
      scrollTo(0, 0);
    }
    addEventListener("hashchange", route); route();
  };

  R.resume = () => {
    main.innerHTML = `<section>
      ${sectionHead("resume", "Resume", `<div class="row"><a class="btn primary" href="assets/resume.pdf" target="_blank" rel="noopener">${ICON.doc} Download PDF</a></div>`)}
      <article class="panel resume">
        <header>
          <div><h1 style="font-size:var(--step-3)">${esc(P.name)}</h1><p class="muted" style="margin-top:6px">${esc(P.role)} · ${esc(P.location)}</p></div>
          <div class="row" style="font-size:.9rem">${copyField()}<a href="${P.links.github}" target="_blank" rel="noopener">github</a><a href="${P.links.linkedin}" target="_blank" rel="noopener">linkedin</a></div>
        </header>
        <section><h2 class="rs">Education</h2>
          ${S.education.map((e) => `<div class="rs-item"><div class="tl-top"><h3>${esc(e.degree)} <span class="tl-org">· ${esc(e.school)}</span></h3><span class="tl-when">${esc(e.dates)} · ${esc(e.place)}</span></div><div class="muted" style="font-size:.92rem">${esc(e.grade)}${e.notes ? " · " + esc(e.notes) : ""}</div></div>`).join("")}
        </section>
        <section><h2 class="rs">Experience</h2>
          ${S.experience.map((x) => `<div class="rs-item"><div class="tl-top"><h3>${esc(x.role)} <span class="tl-org">· ${esc(x.org)} (${esc(x.sector)})</span></h3><span class="tl-when">${esc(x.dates)} · ${esc(x.place)}</span></div><ul>${x.bullets.map((b) => `<li>${esc(b)}</li>`).join("")}</ul></div>`).join("")}
        </section>
        <section><h2 class="rs">Projects</h2>
          ${S.projects.filter((p) => p.kind !== "work").map((p) => `<div class="rs-item"><div class="tl-top"><h3><a href="projects.html#${p.id}" style="color:inherit">${esc(p.title)}</a></h3><span class="tl-when">${esc(p.year)}</span></div><ul><li>${esc(p.summary)}</li><li>${esc(p.impact.join(" · "))}</li></ul></div>`).join("")}
        </section>
        <section><h2 class="rs">Skills</h2>
          <dl class="skills-table">${Object.entries(S.skills).map(([k, v]) => `<dt>${esc(k)}</dt><dd>${esc(v.join(", "))}</dd>`).join("")}</dl>
        </section>
        <section><h2 class="rs">Certifications</h2><div class="chips">${S.certificates.map((c) => `<span class="chip accent">${esc(c)}</span>`).join("")}</div></section>
      </article>
    </section>`;
  };

  (R[page] || R.profile)();

  /* ---------------- command palette ---------------- */
  const cmds = [
    ...PAGES.map((p) => ({ label: "Go to " + p.title, grp: "page", run: () => (location.href = p.href) })),
    ...S.projects.map((p) => ({ label: p.title, grp: "project", run: () => (location.href = "projects.html#" + p.id) })),
    ...S.writeups.map((w) => ({ label: w.title, grp: "writeup", run: () => (location.href = "writeups.html#" + w.id) })),
    ...S.research.map((r) => ({ label: r.area, grp: "research", run: () => (location.href = "research.html") })),
    { label: "Toggle light / dark theme", grp: "action", run: toggleTheme },
    { label: "Copy email address", grp: "action", run: () => copyText(P.email) },
    { label: "Open GitHub", grp: "link", run: () => window.open(P.links.github, "_blank", "noopener") || (location.href = P.links.github) },
    { label: "Open LinkedIn", grp: "link", run: () => window.open(P.links.linkedin, "_blank", "noopener") || (location.href = P.links.linkedin) }
  ];
  let back = null, sel = 0, shown = [];
  function openK() {
    if (back) return;
    back = document.createElement("div");
    back.className = "cmdk-back";
    back.innerHTML = `<div class="cmdk" role="dialog" aria-modal="true" aria-label="Command palette">
      <div class="cmdk-in"><span>›</span><input id="cmdk-q" placeholder="Jump to a page, project or writeup…" autocomplete="off" aria-controls="cmdk-list"></div>
      <ul id="cmdk-list" role="listbox"></ul>
      <div class="cmdk-foot"><span><kbd>↑</kbd> <kbd>↓</kbd> move</span><span><kbd>Enter</kbd> open</span><span><kbd>Esc</kbd> close</span></div></div>`;
    document.body.append(back);
    const inp = $("#cmdk-q", back);
    back.addEventListener("mousedown", (e) => { if (e.target === back) closeK(); });
    inp.addEventListener("input", () => { sel = 0; paint(inp.value); });
    inp.addEventListener("keydown", (e) => {
      if (e.key === "ArrowDown") { e.preventDefault(); sel = Math.min(sel + 1, shown.length - 1); paint(inp.value, true); }
      else if (e.key === "ArrowUp") { e.preventDefault(); sel = Math.max(sel - 1, 0); paint(inp.value, true); }
      else if (e.key === "Enter") { e.preventDefault(); const c = shown[sel]; if (c) { closeK(); c.run(); } }
      else if (e.key === "Escape") closeK();
    });
    $("#cmdk-list", back).addEventListener("click", (e) => {
      const li = e.target.closest("li"); if (!li) return;
      const c = shown[+li.dataset.i]; closeK(); c.run();
    });
    paint(""); inp.focus();
  }
  function paint(q, keep) {
    const t = q.toLowerCase().trim();
    shown = !t ? cmds : cmds.filter((c) => t.split(/\s+/).every((w) => (c.label + " " + c.grp).toLowerCase().includes(w)));
    const ul = $("#cmdk-list", back);
    ul.innerHTML = shown.length ? shown.map((c, i) => `<li role="option" data-i="${i}" aria-selected="${i === sel}"><span>${esc(c.label)}</span><span class="grp">${c.grp}</span></li>`).join("")
      : `<li aria-disabled="true"><span class="muted">Nothing matches “${esc(q)}”</span></li>`;
    const s = ul.querySelector('[aria-selected="true"]'); if (s && keep) s.scrollIntoView({ block: "nearest" });
  }
  function closeK() { if (back) { back.remove(); back = null; $("#cmdk-btn").focus(); } }
  $("#cmdk-btn").addEventListener("click", openK);
  document.addEventListener("keydown", (e) => {
    const typing = /INPUT|TEXTAREA/.test(document.activeElement?.tagName);
    if ((e.key === "k" || e.key === "K") && (e.ctrlKey || e.metaKey)) { e.preventDefault(); back ? closeK() : openK(); }
    else if (e.key === "/" && !typing && !back) { e.preventDefault(); openK(); }
  });
  if (/Mac|iPhone|iPad/.test(navigator.platform)) { const k = $("#cmdk-btn kbd"); if (k) k.textContent = "⌘K"; }
})();
