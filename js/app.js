/* ═════════════ Tabs ═════════════ */
const TABS = ['lernen', 'uebungen', 'test', 'karten'];
function showTab(t) {
  if (!TABS.includes(t)) t = 'lernen';
  document.querySelectorAll('.tab').forEach(b => b.setAttribute('aria-selected', b.dataset.tab === t));
  document.querySelectorAll('main > section').forEach(s => s.hidden = s.id !== t);
  if (t === 'karten') renderCards();
  if (t === 'test' && !testState) renderTestStart();
  store.set('tab', t);
  window.scrollTo({ top: 0 });
}
document.querySelectorAll('.tab').forEach(b => b.addEventListener('click', () => { location.hash = b.dataset.tab; }));
window.addEventListener('hashchange', () => showTab(location.hash.slice(1).split('/')[0]));

/* Theme */
(function () {
  const t = store.get('theme', null);
  if (t) document.documentElement.dataset.theme = t;
  document.getElementById('themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    const nx = cur === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = nx; store.set('theme', nx);
  });
})();

/* ═════════════ LERNEN ═════════════ */
const MERK_ID = 'merk';
let curModule = store.get('module', 'm0');
function doneSet() { return new Set(store.get('done', [])); }
function renderLearnNav() {
  const nav = document.getElementById('learnNav'); nav.innerHTML = '';
  const done = doneSet(); let lastPart = '';
  const sel = document.getElementById('learnSelect'); sel.innerHTML = '';
  MODULES.forEach(m => {
    if (m.part !== lastPart) { nav.append(h('div', { class: 'navpart' }, m.part)); lastPart = m.part; }
    nav.append(h('button', { class: 'navitem' + (m.id === curModule ? ' cur' : '') + (done.has(m.id) ? ' done' : ''), onclick: () => openModule(m.id) },
      h('span', { class: 'chk' }, done.has(m.id) ? '✓' : ''), m.title));
    sel.append(h('option', { value: m.id, selected: m.id === curModule }, (done.has(m.id) ? '✓ ' : '') + m.title));
  });
  nav.append(h('div', { class: 'navpart' }, 'Wiederholen'));
  nav.append(h('button', { class: 'navitem merkbtn' + (curModule === MERK_ID ? ' cur' : ''), onclick: () => openModule(MERK_ID) }, h('span', { class: 'chk' }, '★'), 'Alle Merkhilfen zum Auswendiglernen'));
  sel.append(h('option', { value: MERK_ID, selected: curModule === MERK_ID }, '★ Alle Merkhilfen'));
  const pct = Math.round(100 * done.size / MODULES.length);
  document.getElementById('learnProg').innerHTML = `<div class="bar"><span style="width:${pct}%"></span></div><span class="small">${done.size}/${MODULES.length} Kapitel verstanden</span>`;
}
document.getElementById('learnSelect').addEventListener('change', e => openModule(e.target.value));

function openModule(id) {
  curModule = id; store.set('module', id);
  renderLearnNav();
  const box = document.getElementById('learnBody'); box.innerHTML = '';
  if (id === MERK_ID) { renderMerk(box); window.scrollTo({ top: 0 }); return; }
  const i = MODULES.findIndex(m => m.id === id), m = MODULES[i];
  box.append(h('div', { class: 'crumb' }, m.part), h('h2', null, m.title), h('div', { class: 'mod', html: m.html }));
  if (m.mini && m.mini.length) {
    const mc = h('div', { class: 'mini' }, h('h3', null, '✎ Mini-Check'));
    m.mini.forEach((q, qi) => {
      const fb = h('div', { class: 'fb hidden' });
      const opts = h('div', { class: 'opts' });
      q.o.forEach((o, oi) => opts.append(h('button', { class: 'opt', onclick: e => {
        opts.querySelectorAll('.opt').forEach((b, bi) => { b.disabled = true; if (bi === q.a) b.classList.add('right'); });
        if (oi !== q.a) e.currentTarget.classList.add('wrong');
        fb.classList.remove('hidden');
        feedback(fb, oi === q.a, oi === q.a ? 'Richtig!' : 'Leider falsch.', [q.why + ' ' + S(q.src[0], q.src[1])]);
      } }, o)));
      mc.append(h('div', { class: 'miniq' }, h('p', { class: 'q' }, `${qi + 1}. ${q.q}`), opts, fb));
    });
    box.append(mc);
  }
  const done = doneSet();
  const cb = h('label', { class: 'donebox' }, h('input', { type: 'checkbox', checked: done.has(id), onchange: e => {
    const d = doneSet(); e.target.checked ? d.add(id) : d.delete(id); store.set('done', [...d]); renderLearnNav();
  } }), ' Kapitel verstanden');
  const nav = h('div', { class: 'modnav' },
    i > 0 ? h('button', { class: 'btn ghost', onclick: () => openModule(MODULES[i - 1].id) }, '← ' + MODULES[i - 1].title) : h('span'),
    cb,
    i < MODULES.length - 1 ? h('button', { class: 'btn', onclick: () => { const d = doneSet(); d.add(id); store.set('done', [...d]); openModule(MODULES[i + 1].id); } }, 'Weiter: ' + MODULES[i + 1].title + ' →')
      : h('button', { class: 'btn', onclick: () => openModule(MERK_ID) }, 'Zu den Merkhilfen ★'));
  box.append(nav);
  window.scrollTo({ top: 0 });
}

function renderMerk(box) {
  box.append(h('div', { class: 'crumb' }, 'Wiederholen'), h('h2', null, '★ Alle Merkhilfen'));
  let hide = store.get('merkHide', false);
  const tgl = h('label', { class: 'donebox' }, h('input', { type: 'checkbox', checked: hide, onchange: e => { hide = e.target.checked; store.set('merkHide', hide); list.classList.toggle('cover', hide); } }), ' Abdeckmodus (Text verstecken – Antippen zum Aufdecken)');
  box.append(h('p', null, 'Alle Merkhilfen aus den Kapiteln an einem Ort. Mit dem Abdeckmodus kannst du sie wie Karteikarten auswendig lernen: Überschrift lesen, Merkspruch aufsagen, dann antippen.'), tgl);
  const list = h('div', { class: 'merklist' + (hide ? ' cover' : '') });
  MODULES.forEach(m => {
    const t = document.createElement('template'); t.innerHTML = m.html;
    const ms = t.content.querySelectorAll('.merk');
    if (!ms.length) return;
    list.append(h('h3', null, m.title));
    ms.forEach(el => {
      const b = el.querySelector('b'); const head = b ? b.textContent.replace(/:$/, '') : 'Merkhilfe';
      const body = el.cloneNode(true); const bb = body.querySelector('b'); if (bb) bb.remove();
      const card = h('div', { class: 'merkcard', onclick: () => card.classList.toggle('open') },
        h('div', { class: 'mh' }, head), h('div', { class: 'mb', html: body.innerHTML }),
        h('button', { class: 'linkbtn', onclick: e => { e.stopPropagation(); openModule(m.id); } }, '→ zum Kapitel'));
      list.append(card);
    });
  });
  box.append(list);
}

/* ═════════════ ÜBUNGEN ═════════════ */
function exStats() { return store.get('exstats', {}); }
function renderExercises() {
  const wrap = document.getElementById('exList'); wrap.innerHTML = '';
  const toc = document.getElementById('exToc'); toc.innerHTML = '';
  EXERCISES.forEach((ex, n) => {
    toc.append(h('a', { href: '#uebungen', class: 'chip', onclick: e => { e.preventDefault(); document.getElementById('ex-' + ex.id).scrollIntoView({ behavior: 'smooth' }); } }, `${n + 1}. ${ex.title}`));
    const card = h('div', { class: 'excard', id: 'ex-' + ex.id });
    const st = h('span', { class: 'stat' });
    const updStat = () => { const s = exStats()[ex.id] || { r: 0, t: 0 }; st.textContent = s.t ? `${s.r}/${s.t} richtig` : ''; };
    updStat();
    card.append(h('div', { class: 'exhead' }, h('h3', null, `${n + 1}. ${ex.title}`), st), h('p', { class: 'small', html: ex.intro + ' ' + srcList(ex.src) }));
    const body = h('div', { class: 'exbody' });
    card.append(body); wrap.append(card);
    let idx = 0;
    const load = () => {
      body.innerHTML = '';
      let task;
      if (ex.fixed && idx < ex.fixed.length) task = ex.fixed[idx];
      else if (ex.fixedFromItems) task = { it: ex.items[idx % ex.items.length] };
      else task = ex.random();
      const c = { area: h('div', { class: 'exarea' }), fb: h('div', { class: 'fb hidden' }) };
      const label = ex.fixed && idx < ex.fixed.length ? `Skript-Aufgabe ${idx + 1}/${ex.fixed.length}` : ex.fixedFromItems ? `Frage ${idx % ex.items.length + 1}/${ex.items.length}` : 'Zufallsaufgabe';
      body.append(h('div', { class: 'tasklabel' }, label));
      ex.render(task, c);
      const sol = h('div', { class: 'sol hidden' });
      body.append(c.area, c.fb, sol);
      const ctr = h('div', { class: 'ctrls' });
      let counted = false;
      const count = ok => { if (counted || ok === null) return; counted = true; const s = exStats(); s[ex.id] = s[ex.id] || { r: 0, t: 0 }; s[ex.id].t++; if (ok) s[ex.id].r++; store.set('exstats', s); updStat(); };
      if (c.selfAssess) {
        const yes = h('button', { class: 'btn ok sm', disabled: true, onclick: () => { count(true); next(); } }, '✓ Gewusst');
        const no = h('button', { class: 'btn bad sm', disabled: true, onclick: () => { count(false); next(); } }, '✗ Nicht gewusst');
        ctr.append(h('button', { class: 'btn', onclick: () => { c.fb.classList.remove('hidden'); c.fb.className = 'fb info'; c.fb.innerHTML = c.selfAssess.answer; yes.disabled = no.disabled = false; } }, 'Musterantwort zeigen'), yes, no);
      } else {
        const chk = () => { c.fb.classList.remove('hidden'); const ok = c.onCheck(); count(ok); if (ok === false) solBtn.classList.add('pulse'); };
        const solBtn = h('button', { class: 'btn ghost', onclick: () => { sol.classList.toggle('hidden'); if (!sol.innerHTML) sol.innerHTML = '<h4>Lösungsweg – Schritt für Schritt</h4>' + c.solution(); solBtn.classList.remove('pulse'); } }, 'Lösungsweg anzeigen');
        ctr.append(h('button', { class: 'btn', onclick: chk }, 'Prüfen'), solBtn);
        c.area.querySelectorAll('input').forEach(i => i.addEventListener('keydown', e => { if (e.key === 'Enter') chk(); }));
      }
      const next = () => { idx++; load(); };
      ctr.append(h('button', { class: 'btn ghost', onclick: next }, 'Nächste Aufgabe →'));
      body.append(ctr);
    };
    load();
  });
}

/* ═════════════ TEST ═════════════ */
let testState = null;
const GRADES = [[87.5, 1, 'Sehr gut'], [75, 2, 'Gut'], [62.5, 3, 'Befriedigend'], [50, 4, 'Genügend'], [0, 5, 'Nicht genügend']];
function gradeOf(p) { return GRADES.find(g => p >= g[0]); }
function normAns(s) { return String(s || '').trim().toLowerCase().replace(/\s+/g, ''); }
function checkAns(q, val) {
  if (q.type === 'mc') return val === q.a;
  if (q.num) { const v = parseNum(val); return q.acc.some(a => parseNum(a) === v); }
  return q.acc.some(a => normAns(a) === normAns(val));
}
function ansText(q, val) {
  if (val == null || val === '') return '— (keine Antwort)';
  return q.type === 'mc' ? q.o[val] : val;
}
function rightText(q) { return q.type === 'mc' ? q.o[q.a] : q.show; }

function renderTestStart() {
  testState = null;
  const box = document.getElementById('testBody'); box.innerHTML = '';
  const hist = store.get('tests', []);
  box.append(
    h('div', { class: 'hero' },
      h('h2', null, 'Test auf ein Sehr gut'),
      h('p', null, 'Jeder Test zieht ', h('b', null, '10 Aufgaben'), ' aus einem Pool von ', h('b', null, `${POOL.length} Aufgaben`), ': 4 × IPv6, 4 × TCP/UDP, 2 × Packet Tracer. Am Ende wird benotet. Falsche Fragen werden markiert und kommen automatisch zu den Karteikarten.'),
      h('button', { class: 'btn big', onclick: startTest }, 'Neuen Test starten')),
    h('h3', null, 'Notenschlüssel'),
    h('table', { class: 'tbl', html: '<tr><th>Richtig</th><th>Prozent</th><th>Note</th></tr><tr><td>9–10</td><td>≥ 87,5 %</td><td>1 · Sehr gut</td></tr><tr><td>8</td><td>≥ 75 %</td><td>2 · Gut</td></tr><tr><td>7</td><td>≥ 62,5 %</td><td>3 · Befriedigend</td></tr><tr><td>5–6</td><td>≥ 50 %</td><td>4 · Genügend</td></tr><tr><td>0–4</td><td>&lt; 50 %</td><td>5 · Nicht genügend</td></tr>' }),
  );
  if (hist.length) {
    box.append(h('h3', null, 'Deine letzten Tests'));
    const t = h('table', { class: 'tbl' }, h('tr', null, h('th', null, 'Datum'), h('th', null, 'Punkte'), h('th', null, 'Note')));
    hist.slice(-10).reverse().forEach(r => t.append(h('tr', null, h('td', null, new Date(r.d).toLocaleString('de-AT', { dateStyle: 'short', timeStyle: 'short' })), h('td', null, `${r.s}/${r.n}`), h('td', null, h('span', { class: 'grade g' + r.g }, r.g)))));
    box.append(t);
  }
}
function startTest() {
  const by = t => shuffle(POOL.filter(q => q.t === t));
  const qs = shuffle([...by('ip6').slice(0, 4), ...by('tcp').slice(0, 4), ...by('pt').slice(0, 2)]);
  testState = { qs: qs.map(q => ({ q, order: q.type === 'mc' ? shuffle(q.o.map((_, i) => i)) : null, val: null })), done: false };
  renderTest();
}
function renderTest() {
  const box = document.getElementById('testBody'); box.innerHTML = '';
  const prog = h('div', { class: 'testprog' });
  const updProg = () => { const n = testState.qs.filter(x => x.val !== null && x.val !== '').length; prog.innerHTML = `<div class="bar"><span style="width:${n * 10}%"></span></div><span class="small">${n}/10 beantwortet</span>`; };
  box.append(h('h2', null, 'Test'), prog);
  testState.qs.forEach((it, n) => {
    const q = it.q;
    const card = h('div', { class: 'tq' }, h('div', { class: 'tqn' }, `Aufgabe ${n + 1}`, h('span', { class: 'tag' }, { ip6: 'IPv6', tcp: 'TCP/UDP', pt: 'Packet Tracer' }[q.t])), h('p', { class: 'q' }, q.q));
    if (q.type === 'mc') {
      const opts = h('div', { class: 'opts col' });
      it.order.forEach(oi => opts.append(h('button', { class: 'opt' + (it.val === oi ? ' sel' : ''), onclick: e => { it.val = oi; opts.querySelectorAll('.opt').forEach(b => b.classList.remove('sel')); e.currentTarget.classList.add('sel'); updProg(); } }, q.o[oi])));
      card.append(opts);
    } else {
      card.append(h('input', { class: 'inp' + (q.full || /kürzester|Loopback/.test(q.q) ? ' mono' : ''), value: it.val || '', placeholder: 'Antwort eingeben', autocomplete: 'off', spellcheck: 'false', oninput: e => { it.val = e.target.value; updProg(); } }));
    }
    box.append(card);
  });
  updProg();
  box.append(h('div', { class: 'ctrls' }, h('button', { class: 'btn big', onclick: () => submitTest() }, 'Abgeben & benoten'), h('button', { class: 'btn ghost', onclick: () => askConfirm('Test wirklich abbrechen? Deine Antworten gehen verloren.', 'Abbrechen', renderTestStart) }, 'Abbrechen')));
  window.scrollTo({ top: 0 });
}
function submitTest(force) {
  const open = testState.qs.filter(x => x.val === null || x.val === '').length;
  if (open && force !== true) return askConfirm(`${open} Aufgabe(n) sind noch offen. Trotzdem abgeben?`, 'Trotzdem abgeben', () => submitTest(true));
  const cards = store.get('cards', {});
  let s = 0;
  testState.qs.forEach(it => {
    it.ok = checkAns(it.q, it.val);
    if (it.ok) s++;
    else { const c = cards[it.q.id] || { wrong: 0 }; c.wrong++; c.box = 'open'; c.at = Date.now(); cards[it.q.id] = c; }
  });
  store.set('cards', cards);
  const pct = s * 10, g = gradeOf(pct);
  const hist = store.get('tests', []); hist.push({ d: Date.now(), s, n: 10, g: g[1], wrong: testState.qs.filter(x => !x.ok).map(x => x.q.id) }); store.set('tests', hist);
  testState.done = true;
  const box = document.getElementById('testBody'); box.innerHTML = '';
  box.append(h('div', { class: 'result-hero g' + g[1] },
    h('div', { class: 'big-grade' }, g[1]),
    h('div', null, h('div', { class: 'gname' }, g[2]), h('div', null, `${s} von 10 richtig (${pct} %)`),
      h('div', { class: 'small' }, s < 10 ? `${10 - s} falsche Frage(n) sind jetzt bei den Karteikarten markiert.` : 'Alles richtig – stark!'))));
  box.append(h('div', { class: 'ctrls' },
    s < 10 ? h('button', { class: 'btn', onclick: () => { cardDeck = 'open'; location.hash = 'karten'; } }, 'Falsche jetzt als Karteikarten lernen') : null,
    h('button', { class: 'btn ghost', onclick: startTest }, 'Neuer Test'),
    h('label', { class: 'donebox' }, h('input', { type: 'checkbox', onchange: e => box.classList.toggle('onlywrong', e.target.checked) }), ' nur falsche zeigen')));
  testState.qs.forEach((it, n) => {
    const q = it.q;
    box.append(h('div', { class: 'tq review ' + (it.ok ? 'ok' : 'bad') },
      h('div', { class: 'tqn' }, `${it.ok ? '✔' : '✘'} Aufgabe ${n + 1}`, h('span', { class: 'tag' }, it.ok ? 'richtig' : 'falsch – markiert')),
      h('p', { class: 'q' }, q.q),
      h('p', null, h('span', { class: 'lbl' }, 'Deine Antwort: '), h('span', { class: it.ok ? 'right-t' : 'wrong-t' }, ansText(q, it.val))),
      it.ok ? null : h('p', null, h('span', { class: 'lbl' }, 'Richtig: '), h('b', { class: 'right-t' }, rightText(q))),
      h('div', { class: 'why', html: '<b>Warum?</b> ' + q.why + '<br>' + srcList(q.src) })));
  });
  window.scrollTo({ top: 0 });
}

/* ═════════════ KARTEIKARTEN ═════════════ */
let cardDeck = 'open', cardQueue = [], cardFlip = false;
function deckIds(deck) {
  const cards = store.get('cards', {});
  if (deck === 'all') return POOL.map(q => q.id);
  return POOL.filter(q => cards[q.id] && (cards[q.id].box || 'open') === deck).map(q => q.id);
}
function renderCards(rebuild = true) {
  const box = document.getElementById('cardBody'); box.innerHTML = '';
  const cards = store.get('cards', {});
  const nOpen = deckIds('open').length, nKnown = deckIds('known').length;
  const tabs = h('div', { class: 'seg' },
    [['open', `Noch üben (${nOpen})`], ['known', `Kann ich (${nKnown})`], ['all', `Alle ${POOL.length} Fragen`]].map(([k, l]) =>
      h('button', { class: cardDeck === k ? 'on' : '', onclick: () => { cardDeck = k; renderCards(); } }, l)));
  box.append(tabs);
  if (rebuild) { cardQueue = shuffle(deckIds(cardDeck)); cardFlip = false; }
  if (!cardQueue.length) {
    box.append(h('div', { class: 'empty' }, cardDeck === 'open'
      ? (nKnown ? '🎉 Keine offenen Karten mehr – alles gelernt! Mach einen neuen Test oder wiederhole „Alle Fragen“.' : 'Noch keine Karten. Falsche Antworten aus dem Test landen automatisch hier. Du kannst aber jederzeit „Alle Fragen“ üben.')
      : cardDeck === 'known' ? 'Noch keine Karte als „Kann ich“ markiert.' : ''));
    return;
  }
  const id = cardQueue[0], q = POOL.find(x => x.id === id), meta = cards[id] || {};
  const card = h('div', { class: 'flash' + (cardFlip ? ' flipped' : '') });
  card.append(h('div', { class: 'tqn' }, `Karte · noch ${cardQueue.length} im Stapel`, h('span', { class: 'tag' }, { ip6: 'IPv6', tcp: 'TCP/UDP', pt: 'Packet Tracer' }[q.t]), meta.wrong ? h('span', { class: 'tag bad' }, `${meta.wrong}× falsch`) : null));
  card.append(h('p', { class: 'q' }, q.q));
  if (q.type === 'mc') card.append(h('ul', { class: 'cardopts' }, q.o.map((o, i) => h('li', { class: cardFlip && i === q.a ? 'right' : '' }, o))));
  if (!cardFlip) {
    card.append(h('div', { class: 'ctrls' }, h('button', { class: 'btn big', onclick: () => { cardFlip = true; renderCards(false); } }, 'Antwort aufdecken')));
  } else {
    card.append(h('div', { class: 'back' }, h('p', null, h('span', { class: 'lbl' }, 'Antwort: '), h('b', null, rightText(q))), h('div', { class: 'why', html: q.why + '<br>' + srcList(q.src) })));
    const rate = known => {
      const c = store.get('cards', {}); const m = c[id] || { wrong: 0 };
      if (known) m.box = 'known'; else { m.box = 'open'; m.wrong = (m.wrong || 0) + (cardDeck === 'all' ? 1 : 0); }
      c[id] = m; store.set('cards', c);
      cardQueue.shift(); if (!known && cardDeck !== 'all') cardQueue.push(id);
      cardFlip = false; renderCards(false);
    };
    card.append(h('div', { class: 'ctrls' },
      h('button', { class: 'btn bad', onclick: () => rate(false) }, '✗ Kann ich noch nicht'),
      h('button', { class: 'btn ok', onclick: () => rate(true) }, '✓ Kann ich')));
  }
  box.append(card);
  box.append(h('p', { class: 'small' }, '„Kann ich noch nicht“ legt die Karte hinten in den Stapel zurück. „Kann ich“ verschiebt sie zu „Kann ich“. ',
    h('button', { class: 'linkbtn', onclick: () => askConfirm('Alle Karteikarten-Markierungen löschen?', 'Löschen', () => { store.set('cards', {}); renderCards(); }) }, 'Alles zurücksetzen')));
}

/* ═════════════ Start ═════════════ */
renderLearnNav();
openModule(curModule);
renderExercises();
showTab(location.hash.slice(1) || store.get('tab', 'lernen'));
