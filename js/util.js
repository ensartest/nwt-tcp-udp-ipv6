/* kleine Helfer */
function h(tag, attrs, ...kids) {
  const el = document.createElement(tag);
  if (attrs) for (const [k, v] of Object.entries(attrs)) {
    if (v == null || v === false) continue;
    if (k === 'class') el.className = v;
    else if (k === 'html') el.innerHTML = v;
    else if (k.startsWith('on')) el.addEventListener(k.slice(2), v);
    else el.setAttribute(k, v === true ? '' : v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) el.append(c.nodeType ? c : document.createTextNode(String(c)));
  return el;
}
const store = {
  get(k, d) { try { const v = localStorage.getItem('nwt_' + k); return v == null ? d : JSON.parse(v); } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem('nwt_' + k, JSON.stringify(v)); } catch (e) { /* privat-Modus */ } }
};
function rnd(n) { return Math.floor(Math.random() * n); }
function pick(arr) { return arr[rnd(arr.length)]; }
function shuffle(a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function srcList(src) { return (src || []).map(([k, p]) => S(k, p)).join(' '); }
function fmtNum(n) { return n.toLocaleString('de-AT').replace(/ | /g, ' '); }
/* "65.536", "65 536", "2^16", "2 hoch 16" → Zahl */
function parseNum(raw) {
  let s = String(raw || '').trim().toLowerCase().replace(/bit|byte|subnetze?/g, '').trim();
  const pow = s.match(/^2\s*(\^|hoch|\*\*)\s*(\d+)$/);
  if (pow) return Math.pow(2, +pow[2]);
  s = s.replace(/[\s.'’,_]/g, '');
  return /^\d+$/.test(s) ? Number(s) : NaN;
}
function feedback(el, ok, title, msgs, partial) {
  el.innerHTML = '';
  el.className = 'fb ' + (ok ? 'ok' : partial ? 'partial' : 'bad');
  el.append(h('div', { class: 'fb-t', html: (ok ? '✔ ' : partial ? '≈ ' : '✘ ') + title }));
  if (msgs && msgs.length) el.append(h('ul', null, msgs.map(m => h('li', { html: m }))));
}
/* Adressen nur an Doppelpunkten umbrechen */
function wbr(t) { return String(t).replace(/:/g, ':<wbr>'); }
