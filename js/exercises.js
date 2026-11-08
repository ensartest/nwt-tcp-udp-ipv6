/* Übungen: feste Aufgaben aus den Skripten + Zufallsgenerator, mit Fehlerkorrektur und Lösungsweg */

/* ───────── Zufalls-Adressen ───────── */
function randGroup() {
  const kinds = [
    () => rnd(0x10000).toString(16),                         // beliebig
    () => '0' + rnd(0x1000).toString(16).padStart(3, '0'),   // 0db8
    () => '00' + rnd(0x100).toString(16).padStart(2, '0'),   // 00aa
    () => '000' + (1 + rnd(15)).toString(16),                 // 0009
    () => (1 + rnd(15)).toString(16) + '000',                 // 1000
    () => (16 + rnd(240)).toString(16) + '00'                 // aa00
  ];
  let g = pick(kinds)().padStart(4, '0');
  if (parseInt(g, 16) === 0) g = '0001';
  return g;
}
function randAddrForShort() {
  const g = Array.from({ length: 8 }, randGroup);
  g[0] = pick(['2001', '2a01', '2a02', '2003', '2001', 'fe80', 'fd00', '2600']);
  if (g[0] === '2001' && Math.random() < .6) g[1] = '0db8';
  const len = pick([2, 2, 3, 3, 4, 5]);
  const start = 1 + rnd(8 - len);
  for (let i = start; i < start + len; i++) g[i] = '0000';
  if (Math.random() < .55) {                                  // zweite, kürzere Null-Stelle
    const free = [...Array(8).keys()].filter(i => i > 0 && (i < start - 1 || i > start + len));
    if (free.length) g[pick(free)] = '0000';
  }
  return g;
}

/* ───────── Lösungsweg-Renderer ───────── */
function solShort(groups) {
  const st = groups.map(IPV6.strip);
  const runs = IPV6.zeroRuns(groups);
  const b = IPV6.bestRun(groups);
  let html = `<h5>Schritt 1 – voll ausgeschrieben, Gruppen nummerieren</h5>
  <table class="tbl gtbl"><tr><th>Gruppe</th>${groups.map((_, i) => `<th>${i + 1}</th>`).join('')}</tr>
  <tr><td>voll</td>${groups.map(g => `<td><code>${g}</code></td>`).join('')}</tr>
  <tr><td>ohne führende Nullen</td>${st.map((g, i) => `<td><code class="${parseInt(groups[i], 16) === 0 ? 'z' : ''}">${g}</code></td>`).join('')}</tr></table>
  <h5>Schritt 2 – führende Nullen weg (Regel 2) ${S('IP6', 1)}</h5>
  <p>Nur die Nullen <b>vorne</b> in jeder Gruppe fallen weg: ${groups.map((g, i) => g !== st[i] ? `<code>${g}</code>→<code>${st[i]}</code>` : null).filter(Boolean).join(', ') || 'keine vorhanden'}.
  ${groups.some(g => /[1-9a-f]0+$/.test(g)) ? `<br>Achtung: ${groups.filter(g => /[1-9a-f]0+$/.test(g)).map(g => `<code>${g}</code>`).join(', ')} behalten ihre Nullen, weil sie <b>hinten</b> stehen!` : ''}</p>
  <p>Zwischenergebnis: <code>${st.join(':')}</code></p>
  <h5>Schritt 3 – Null-Ketten suchen, längste durch :: ersetzen (Regel 3) ${S('IP6', 2)}</h5>`;
  if (!runs.length) html += '<p>Es gibt keine Null-Gruppen → nichts mehr zu kürzen.</p>';
  else {
    html += '<ul>' + runs.map(r => `<li>Gruppe${r.len > 1 ? 'n' : ''} ${r.start + 1}${r.len > 1 ? '–' + (r.start + r.len) : ''}: <b>${r.len}</b> Null-Gruppe${r.len > 1 ? 'n' : ''}${r.len === 1 ? ' (einzeln → bleibt <code>0</code>)' : ''}${b.len >= 2 && r.start === b.start ? ' ← <b>längste, wird zu ::</b>' : ''}</li>`).join('') + '</ul>';
    if (runs.filter(r => r.len === b.len).length > 1) html += '<p class="small">Zwei gleich lange Ketten → man nimmt die <b>erste</b> (RFC 5952).</p>';
  }
  html += `<h5>Ergebnis</h5><p class="result"><code>${IPV6.shortest(groups)}</code></p>`;
  return html;
}

function solFull(task) {
  const p = IPV6.parse(task.q);
  const given = p.left.concat(p.right);
  return `<h5>Schritt 1 – vorhandene Gruppen zählen</h5>
  <p><code>${task.q}</code> → ${given.map(g => `<code>${g}</code>`).join(', ')} = <b>${given.length}</b> Gruppe${given.length === 1 ? '' : 'n'}.</p>
  <h5>Schritt 2 – wie viele Null-Gruppen ersetzt „::“?</h5>
  <p>8 − ${given.length} = <b>${p.missing}</b> Gruppen <code>0000</code> kommen an die Stelle von <code>::</code> (${p.left.length ? 'nach Gruppe ' + p.left.length : 'ganz am Anfang'}).</p>
  <h5>Schritt 3 – jede Gruppe vorne auf 4 Ziffern auffüllen</h5>
  <p>${given.map(g => `<code>${g}</code>→<code>${IPV6.pad(g)}</code>`).join(', ')}</p>
  <h5>Schritt 4 – zusammensetzen & kontrollieren (8 Gruppen?)</h5>
  <p class="result"><code>${IPV6.full(p.groups)}</code></p>
  <p class="small">${p.groups.map((_, i) => i + 1).join(' · ')} → 8 Gruppen ✔ ${S('IP6', 2)}</p>`;
}

function colorAddr(groups, n) {
  const digits = groups.join('');
  let out = '', idx = 0;
  groups.forEach((g, gi) => {
    for (const ch of g) {
      const cls = idx < n / 4 ? 'np' : idx < 16 ? 'sn' : 'iid';
      out += `<span class="${cls}">${ch}</span>`; idx++;
    }
    if (gi < 7) out += ':';
  });
  return `<div class="addr big">${out}</div><p class="legend"><span class="np">Präfix ${n} Bit</span> ${n < 64 ? `<span class="sn">Subnetz ${64 - n} Bit</span>` : ''} <span class="iid">Interface ID 64 Bit</span></p>`;
}

/* ───────── Definition der Übungen ───────── */
const EXERCISES = [
{
  id: 'short', title: 'IPv6 kürzen (Kurzschreibweise)', src: [['IP6', 1], ['IP6', 2]],
  intro: 'Schreibe die Adresse in der <b>kürzest möglichen</b> Form. Die ersten 4 Aufgaben sind die Übungsbeispiele aus dem Skript, danach kommen Zufallsaufgaben.',
  fixed: [
    '2001:0db8:00aa:bbbb:0000:dddd:eeee:0001', '2001:0db8:0000:0000:cccc:0000:eeee:0001',
    '2001:0db8:aa00:00bb:0000:0000:0000:0001', '2001:0000:0000:bbbb:0000:0000:0000:0001'
  ].map(a => ({ groups: a.split(':'), fromScript: true })),
  random: () => ({ groups: randAddrForShort() }),
  render(task, c) {
    c.area.append(h('p', { class: 'q' }, h('code', { class: 'qaddr', html: wbr(task.groups.join(':')) })));
    const inp = h('input', { class: 'inp mono', placeholder: 'z. B. 2001:db8::1', autocomplete: 'off', spellcheck: 'false' });
    c.area.append(inp);
    c.onCheck = () => {
      const d = IPV6.diagnoseShort(inp.value, task.groups);
      feedback(c.fb, d.ok, d.ok ? 'Richtig – kürzeste Schreibweise!' : 'Noch nicht ganz.', d.msgs, d.partial);
      return d.ok;
    };
    c.solution = () => solShort(task.groups);
    c.focus = inp;
  }
},
{
  id: 'full', title: 'IPv6 voll ausschreiben', src: [['IP6', 2]],
  intro: 'Schreibe die Adresse <b>voll aus</b>: 8 Gruppen, jede mit 4 Ziffern. Die ersten 4 sind aus dem Skript.',
  fixed: ['2001::aa:0:1', '2001:a0::b0:1', '2001::1', '::abc:1'].map(q => ({ q, fromScript: true })),
  random: () => ({ q: IPV6.shortest(randAddrForShort()) }),
  render(task, c) {
    c.area.append(h('p', { class: 'q' }, h('code', { class: 'qaddr', html: wbr(task.q) })));
    const inp = h('input', { class: 'inp mono', placeholder: 'xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx:xxxx', autocomplete: 'off', spellcheck: 'false' });
    c.area.append(inp);
    const target = IPV6.parse(task.q).groups;
    c.onCheck = () => {
      const d = IPV6.diagnoseFull(inp.value, target);
      feedback(c.fb, d.ok, d.ok ? 'Richtig ausgeschrieben!' : 'Noch nicht ganz.', d.msgs, d.partial);
      return d.ok;
    };
    c.solution = () => solFull(task);
    c.focus = inp;
  }
},
{
  id: 'prefix', title: 'Präfix, Interface ID & Subnetze', src: [['IP6', 2], ['IP6', 3]],
  intro: 'Bestimme die Anzahl der <b>Subnetz-Bits</b> und der möglichen <b>Subnetze</b> (Interface ID = 64 Bit). Die ersten 4 sind die Skript-Beispiele. Eingabe z. B. <code>256</code>, <code>65.536</code> oder <code>2^16</code>.',
  fixed: [64, 48, 56, 32].map(n => ({ groups: '2001:0db8:00aa:bbbb:0000:dddd:eeee:0001'.split(':'), n, noSlash: n === 64, fromScript: true })),
  random: () => ({ groups: Array.from({ length: 8 }, randGroup).map((g, i) => i === 0 ? pick(['2001', '2a01', '2a02', '2003']) : g), n: pick([32, 40, 44, 48, 48, 52, 56, 56, 60, 64]) }),
  render(task, c) {
    const addr = task.groups.join(':') + (task.noSlash ? '' : '/' + task.n);
    c.area.append(h('p', { class: 'q' }, h('code', { class: 'qaddr', html: wbr(addr) })));
    if (task.noSlash) c.area.append(h('p', { class: 'small' }, 'Kein Slash angegeben.'));
    const i1 = h('input', { class: 'inp', placeholder: 'Subnetz-Bits', inputmode: 'numeric' });
    const i2 = h('input', { class: 'inp', placeholder: 'Anzahl Subnetze' });
    c.area.append(h('div', { class: 'row2' }, h('label', null, 'a) Subnetz-Bits', i1), h('label', null, 'b) Anzahl Subnetze', i2)));
    const bits = 64 - task.n, nets = Math.pow(2, bits);
    c.onCheck = () => {
      const a = parseNum(i1.value), b = parseNum(i2.value), msgs = [];
      const okA = a === bits, okB = b === nets;
      if (!okA) {
        if (isNaN(a)) msgs.push('a) Bitte eine Zahl eingeben.');
        else if (a === task.n) msgs.push(`a) ${a} ist die <b>Präfixlänge</b>, nicht die Subnetz-Bits. Rechne <b>64 − ${task.n}</b>.`);
        else if (a === 128 - task.n) msgs.push(`a) Du hast von 128 abgezogen. Der Interface Identifier hat aber fix 64 Bit → nur die ersten 64 Bit gehören dem Netz: <b>64 − ${task.n}</b>.`);
        else msgs.push(`a) Falsch. Subnetz-Bits = 64 − Präfixlänge = 64 − ${task.n}.`);
        if (task.noSlash) msgs.push('Ohne Slash gilt der <b>Standard /64</b>.');
      }
      if (!okB) {
        if (isNaN(b)) msgs.push('b) Bitte eine Zahl (oder 2^x) eingeben.');
        else if (b === bits) msgs.push(`b) Das ist die Anzahl der <b>Bits</b>. Die Anzahl Subnetze ist <b>2 hoch</b> diese Zahl.`);
        else if (b === 2 * bits) msgs.push(`b) Du hast 2 · ${bits} gerechnet – es muss aber 2<sup>${bits}</sup> (2 <b>hoch</b> ${bits}) sein.`);
        else msgs.push(`b) Falsch. Anzahl = 2<sup>Subnetz-Bits</sup>.`);
      }
      feedback(c.fb, okA && okB, okA && okB ? 'Richtig!' : (okA || okB) ? 'Teilweise richtig.' : 'Noch nicht.', msgs, (okA || okB) && !(okA && okB));
      return okA && okB;
    };
    c.solution = () => `<h5>Schritt 1 – Präfixlänge ablesen</h5><p>${task.noSlash ? 'Kein Slash → Standard: <b>/64</b>.' : `Hinter dem Slash steht <b>/${task.n}</b>.`} ${S('IP6', 2)}</p>
      <h5>Schritt 2 – Wo liegt die Grenze? (1 Hex-Ziffer = 4 Bit)</h5><p>${task.n} : 4 = <b>${task.n / 4}</b> Hex-Ziffern gehören zum Präfix${task.n % 16 === 0 ? ` = ${task.n / 16} Gruppen` : ` = ${Math.floor(task.n / 16)} Gruppen + ${(task.n % 16) / 4} Ziffern`}.</p>
      ${colorAddr(task.groups, task.n)}
      <h5>Schritt 3 – Subnetz-Bits</h5><p>Interface ID = 64 Bit fix → 64 − ${task.n} = <b>${bits}</b> Bit bleiben fürs Subnetting. ${S('IP6', 3)}</p>
      <h5>Schritt 4 – Anzahl Subnetze</h5><p>2<sup>${bits}</sup> = <b>${fmtNum(nets)}</b>${bits === 0 ? ' (also kein weiteres Subnetting möglich)' : ''}</p>`;
    c.focus = i1;
  }
},
{
  id: 'type', title: 'Adresstyp erkennen', src: [['IP6', 4], ['IP6', 5]],
  intro: 'Welcher Typ ist die Adresse? Schau auf die <b>erste Gruppe</b>.',
  random: () => {
    const iid = () => [randGroup(), randGroup(), randGroup(), randGroup()].map(IPV6.strip).join(':');
    const h2 = () => rnd(256).toString(16).padStart(2, '0');
    const t = pick(['gu', 'gu', 'll', 'll', 'ula', 'ula', 'ulp', 'sl', 'mc', 'mc', 'lo', 'un']);
    const m = {
      gu: () => `${pick(['2001:db8', '2a01:468', '2001:4860', '2a02:8388', '2003:e1', '2600:1f18'])}:${rnd(0xffff).toString(16)}::${IPV6.strip(randGroup())}`,
      ll: () => `fe80::${iid()}`,
      ula: () => `fd${h2()}:${rnd(0xffff).toString(16)}:${rnd(0xffff).toString(16)}::${IPV6.strip(randGroup())}`,
      ulp: () => `fc${h2()}:${rnd(0xffff).toString(16)}::${IPV6.strip(randGroup())}`,
      sl: () => `fec0::${iid()}`,
      mc: () => pick(['ff02::1', 'ff02::2', 'ff05::1:3', 'ff0e::101', 'ff02::1:ff00:1']),
      lo: () => '::1', un: () => '::'
    };
    return { t, addr: m[t]() };
  },
  render(task, c) {
    const TYPES = { gu: 'Global Unicast', ll: 'Link-Local', ula: 'Unique Local (selbst, FD)', ulp: 'Unique Local (Provider, FC)', sl: 'Site Local (veraltet)', mc: 'Multicast', lo: 'Loopback', un: 'Unspezifiziert' };
    const INFO = {
      gu: ['2000::/3', '001', 'normale, weltweit geroutete Adresse'], ll: ['FE80::/10', '1111111010', 'jedes Gerät hat eine, wie APIPA'],
      ula: ['FD00::/8', '11111101', 'private Adresse, selbst eingerichtet'], ulp: ['FC00::/8', '11111100', 'zentral verwaltet, vom Provider'],
      sl: ['FEC0::/10', '1111111011', 'veraltet (deprecated), ersetzt durch Unique Local'], mc: ['FF00::/8', '11111111', 'Gruppe – ersetzt Broadcast'],
      lo: ['::1', '–', 'der eigene Rechner'], un: ['::', '–', 'alles 0 = keine Adresse']
    };
    c.area.append(h('p', { class: 'q' }, h('code', { class: 'qaddr', html: wbr(task.addr) })));
    const btns = h('div', { class: 'opts' });
    let chosen = null;
    Object.entries(TYPES).forEach(([k, v]) => btns.append(h('button', { class: 'opt', onclick: e => { chosen = k; btns.querySelectorAll('.opt').forEach(b => b.classList.remove('sel')); e.currentTarget.classList.add('sel'); } }, v)));
    c.area.append(btns);
    c.onCheck = () => {
      if (!chosen) { feedback(c.fb, false, 'Bitte einen Typ auswählen.', []); return null; }
      const ok = chosen === task.t, i = INFO[chosen];
      feedback(c.fb, ok, ok ? `Richtig: ${TYPES[task.t]}` : `Falsch – es ist ${TYPES[task.t]}.`,
        ok ? [] : [`Du hast <b>${TYPES[chosen]}</b> gewählt – das wäre Präfix <code>${i[0]}</code>${i[1] !== '–' ? ` (beginnt mit Bits ${i[1]})` : ''}.`]);
      return ok;
    };
    c.solution = () => {
      const first = task.addr.split(':')[0] || '0';
      const bin = parseInt(first.padStart(4, '0'), 16).toString(2).padStart(16, '0').replace(/(.{4})/g, '$1 ').trim();
      const i = INFO[task.t];
      return `<h5>Schritt 1 – erste Gruppe anschauen</h5><p>${task.addr.startsWith('::') ? `Die Adresse beginnt mit <code>::</code> → die ersten Gruppen sind 0.` : `Erste Gruppe: <code>${first.padStart(4, '0')}</code> → binär <code>${bin}</code>`}</p>
      <h5>Schritt 2 – mit der Tabelle vergleichen</h5><p>Passt zu <b>${TYPES[task.t]}</b>: <code>${i[0]}</code>${i[1] !== '–' ? `, Anfangsbits <code>${i[1]}</code>` : ''} – ${i[2]}. ${S('IP6', task.t === 'gu' ? 4 : 5)}</p>
      <h5>Merkhilfe</h5><p>2000 = Global · FE80 = „Für Einen Link“ · FD = „Für Daheim“ · FC = „From Carrier“ · FF = „Für Freunde“ (Multicast) · FEC0 = „Früher Einmal Cool“ (veraltet)</p>`;
    };
  }
},
{
  id: 'ports', title: 'Portnummern', src: [['TCP', 5], ['PT', 5]],
  intro: 'Ordne Port und Anwendung zu.',
  random: () => {
    const P = [[20, 'FTP Datentransfer'], [21, 'FTP Steuerung'], [22, 'SSH'], [23, 'Telnet'], [25, 'SMTP'], [53, 'DNS'], [80, 'HTTP'], [110, 'POP3'], [520, 'RIP']];
    const it = pick(P);
    return { p: it[0], n: it[1], dir: Math.random() < .5 ? 'num' : 'name', opts: shuffle([it[1], ...shuffle(P.filter(x => x !== it).map(x => x[1])).slice(0, 3)]) };
  },
  render(task, c) {
    const MERK = { 20: '21 = Chef (Steuerung), 20 = Arbeiter (Daten)', 21: '21 = Chef (Steuerung), 20 = Arbeiter (Daten)', 22: '22 = zwei 2er, zwei S (SSH)', 23: 'Telnet ist der unsichere Bruder direkt nach SSH', 25: 'SMTP: Send Mail To People – 25', 53: 'D-N-S: 3 Buchstaben, 5 Sinne → 53', 80: 'In 80 Tagen um die Welt – WWW', 110: '110 – Post holen (POP3)', 520: 'RIP – Ruhe in Frieden um 5:20' };
    let get;
    if (task.dir === 'num') {
      c.area.append(h('p', { class: 'q' }, 'Welche Portnummer hat ', h('b', null, task.n), '?'));
      const inp = h('input', { class: 'inp', inputmode: 'numeric', placeholder: 'Port' });
      c.area.append(inp); c.focus = inp; get = () => parseNum(inp.value) === task.p;
    } else {
      c.area.append(h('p', { class: 'q' }, 'Welche Anwendung nutzt Port ', h('b', null, task.p), '?'));
      const btns = h('div', { class: 'opts' }); let ch = null;
      task.opts.forEach(o => btns.append(h('button', { class: 'opt', onclick: e => { ch = o; btns.querySelectorAll('.opt').forEach(b => b.classList.remove('sel')); e.currentTarget.classList.add('sel'); } }, o)));
      c.area.append(btns); get = () => ch === null ? null : ch === task.n;
    }
    c.onCheck = () => {
      const ok = get();
      if (ok === null) { feedback(c.fb, false, 'Bitte etwas auswählen.', []); return null; }
      feedback(c.fb, ok, ok ? `Richtig: Port ${task.p} = ${task.n}` : `Falsch: Port ${task.p} = ${task.n}`, ok ? [] : [`Merkhilfe: ${MERK[task.p]}`]);
      return ok;
    };
    c.solution = () => `<p>Port <b>${task.p}</b> = <b>${task.n}</b>. ${task.p === 110 ? S('PT', 5) : S('TCP', 5)}</p><p>Merkhilfe: ${MERK[task.p]}</p>
      <table class="tbl"><tr><th>Port</th><td>20</td><td>21</td><td>22</td><td>23</td><td>25</td><td>53</td><td>80</td><td>110</td><td>520</td></tr><tr><th>Dienst</th><td>FTP-Daten</td><td>FTP-Steuerung</td><td>SSH</td><td>Telnet</td><td>SMTP</td><td>DNS</td><td>HTTP</td><td>POP3</td><td>RIP</td></tr></table>`;
  }
},
{
  id: 'tcpudp', title: 'TCP oder UDP?', src: [['TCP', 1], ['TCP', 4], ['PT', 4]],
  intro: 'Entscheide, welches Transportprotokoll passt – und überlege, <b>warum</b>.',
  items: [
    ['Eine Webseite aufrufen (HTTP)', 'TCP', 'WWW läuft (fast) ausschließlich über TCP – die Seite muss vollständig und in richtiger Reihenfolge ankommen.', ['TCP', 1]],
    ['Eine E-Mail senden (SMTP)', 'TCP', 'E-Mail läuft über TCP; im Packet Tracer ist der letzte Abschnitt der Mail-PDU TCP.', ['TCP', 1]],
    ['Ein Live-Videostream', 'UDP', 'Konstanter Bild-/Tonstrom ist wichtiger als jedes Einzelbild → UDP.', ['TCP', 4]],
    ['Internet-Telefonie (VoIP)', 'UDP', 'VoIP braucht Tempo, ein verlorenes Paket stört weniger als Verzögerung.', ['TCP', 4]],
    ['Ein Online-Computerspiel', 'UDP', 'Schneller, schlanker Header, geringer Overhead.', ['TCP', 4]],
    ['DNS-Abfrage mit nslookup (Packet Tracer)', 'UDP', 'Die DNS-PDU zeigt im letzten Abschnitt UDP – ohne Seq-/Ack-Nummer.', ['PT', 4]],
    ['Datei per FTP übertragen', 'TCP', 'Im Packet Tracer: letzter Abschnitt TCP, zuverlässig.', ['PT', 4]],
    ['Mails abholen per POP3 (Port 110)', 'TCP', 'POP3 ist im Packet Tracer ein TCP-Port (110).', ['PT', 5]],
    ['Daten müssen garantiert und in richtiger Reihenfolge ankommen', 'TCP', 'Genau das stellt TCP sicher (ACK, Sequenznummern).', ['TCP', 1]],
    ['Vor dem Senden gibt es einen 3-Wege-Handshake', 'TCP', 'Handshake = verbindungsorientiert = TCP.', ['TCP', 1]],
    ['Der Header hat nur 4 Felder', 'UDP', 'Source Port, Destination Port, Segment Length, Checksum.', ['TCP', 4]],
    ['Der Header enthält eine Sequence Number', 'TCP', 'Nur TCP hat Sequence/Acknowledgement Number.', ['TCP', 3]],
    ['Beschrieben in RFC 768 (1980)', 'UDP', 'UDP: 1980, RFC 768. TCP: 1981, RFC 793.', ['TCP', 4]],
    ['Bei fehlendem ACK wird neu gesendet', 'TCP', 'Wiederholung bei fehlender Bestätigung gibt es nur bei TCP.', ['TCP', 2]]
  ],
  random() { return { it: pick(this.items) }; },
  render(task, c) {
    const [s, a, why, src] = task.it;
    c.area.append(h('p', { class: 'q' }, s));
    const btns = h('div', { class: 'opts two' }); let ch = null;
    ['TCP', 'UDP'].forEach(o => btns.append(h('button', { class: 'opt', onclick: e => { ch = o; btns.querySelectorAll('.opt').forEach(b => b.classList.remove('sel')); e.currentTarget.classList.add('sel'); } }, o)));
    c.area.append(btns);
    c.onCheck = () => {
      if (!ch) { feedback(c.fb, false, 'Bitte TCP oder UDP wählen.', []); return null; }
      const ok = ch === a;
      feedback(c.fb, ok, ok ? `Richtig: ${a}` : `Falsch – richtig ist ${a}.`, [why + ' ' + S(src[0], src[1])]);
      return ok;
    };
    c.solution = () => `<p><b>${a}</b> – ${why} ${S(src[0], src[1])}</p><p>Faustregel: <b>Zuverlässigkeit</b> nötig → TCP („Telefonat“). <b>Tempo</b> wichtiger → UDP („Radio“).</p>`;
  }
},
{
  id: 'order', title: 'Abläufe in die richtige Reihenfolge bringen', src: [['TCP', 1], ['TCP', 2], ['IP6', 3]],
  intro: 'Klicke die Bausteine in der richtigen Reihenfolge an. Bausteine können mehrfach vorkommen.',
  items: [
    { name: '3-Wege-Handshake (Port offen)', chips: ['SYN', 'SYN/ACK', 'ACK', 'FIN', 'RST'], want: ['SYN', 'SYN/ACK', 'ACK'], src: ['TCP', 1],
      why: 'Client SYN → Server SYN/ACK → Client ACK (Seq x+1).' },
    { name: 'Verbindungsversuch auf geschlossenen Port', chips: ['SYN', 'SYN/ACK', 'ACK', 'RST', 'FIN'], want: ['SYN', 'RST'], src: ['TCP', 1],
      why: 'Port geschlossen → der Server antwortet auf SYN mit RST.' },
    { name: 'Ordnungsgemäßer Verbindungsabbau', chips: ['FIN', 'ACK', 'SYN', 'RST'], want: ['FIN', 'ACK', 'FIN', 'ACK'], src: ['TCP', 2],
      why: 'FIN → ACK → FIN → ACK: jede Seite sagt „fertig“, die andere bestätigt.' },
    { name: 'SLAAC – Adresse automatisch bekommen', chips: ['Router teilt Network Prefix mit', 'Gerät erzeugt eine IPv6-Adresse', 'Gerät prüft, ob sie schon vergeben ist', 'DHCP-Server vergibt Adresse'], want: ['Router teilt Network Prefix mit', 'Gerät erzeugt eine IPv6-Adresse', 'Gerät prüft, ob sie schon vergeben ist'], src: ['IP6', 3],
      why: 'Router → Prefix; Gerät baut Adresse; prüft (DAD), ob vergeben – wiederholt, bis eine passt. Ein DHCP-Server ist bei SLAAC nicht nötig.' },
    { name: 'IPv6-Adresse kürzen', chips: ['voll ausschreiben', 'führende Nullen entfernen', 'Null-Kette durch :: ersetzen', 'hintere Nullen entfernen'], want: ['voll ausschreiben', 'führende Nullen entfernen', 'Null-Kette durch :: ersetzen'], src: ['IP6', 1],
      why: 'Die 3 Regeln aus dem Skript. Hintere Nullen werden NIE entfernt.' },
    { name: 'TCP-Datenübertragung mit Verlust', chips: ['Segment senden', 'kein ACK nach gewisser Zeit', 'Segment erneut senden', 'ACK empfangen', 'RST senden'], want: ['Segment senden', 'kein ACK nach gewisser Zeit', 'Segment erneut senden', 'ACK empfangen'], src: ['TCP', 2],
      why: 'Fehlt das ACK, wird das Segment erneut gesendet, bis es bestätigt wird.' }
  ],
  random() { return { it: pick(this.items) }; },
  render(task, c) {
    const it = task.it; let seq = [];
    c.area.append(h('p', { class: 'q' }, h('b', null, it.name)));
    const out = h('div', { class: 'seqout' });
    const draw = () => { out.innerHTML = ''; if (!seq.length) out.append(h('span', { class: 'small' }, '(noch leer – klicke unten Bausteine an)')); seq.forEach((s, i) => out.append(h('span', { class: 'chip on' }, `${i + 1}. ${s}`))); };
    draw();
    const pal = h('div', { class: 'opts' });
    shuffle(it.chips).forEach(ch => pal.append(h('button', { class: 'opt', onclick: () => { seq.push(ch); draw(); } }, ch)));
    c.area.append(out, pal, h('button', { class: 'btn ghost sm', onclick: () => { seq = []; draw(); } }, '↺ Zurücksetzen'));
    c.onCheck = () => {
      const ok = seq.length === it.want.length && seq.every((s, i) => s === it.want[i]);
      const msgs = [];
      if (!ok) {
        const firstBad = seq.findIndex((s, i) => s !== it.want[i]);
        if (seq.length < it.want.length && firstBad === -1) msgs.push(`Bis hierher richtig, aber es fehlen noch ${it.want.length - seq.length} Schritt(e).`);
        else if (firstBad >= 0) msgs.push(`Schritt ${firstBad + 1} ist falsch: du hast „${seq[firstBad]}“, richtig ist „${it.want[firstBad] || '— (kein weiterer Schritt)'}“.`);
        else msgs.push('Zu viele Schritte.');
      }
      msgs.push(it.why + ' ' + S(it.src[0], it.src[1]));
      feedback(c.fb, ok, ok ? 'Richtige Reihenfolge!' : 'Reihenfolge stimmt nicht.', msgs);
      return ok;
    };
    c.solution = () => `<ol>${it.want.map(w => `<li>${w}</li>`).join('')}</ol><p>${it.why} ${S(it.src[0], it.src[1])}</p>`;
  }
},
{
  id: 'bits', title: 'Header-Felder: wie viele Bit?', src: [['TCP', 3], ['TCP', 4], ['IP6', 7]],
  intro: 'Gib die Größe des Feldes in <b>Bit</b> an.',
  items: [
    ['TCP', 'Source Port', 16, ['TCP', 3]], ['TCP', 'Destination Port', 16, ['TCP', 3]], ['TCP', 'Sequence Number', 32, ['TCP', 3]], ['TCP', 'Acknowledgement Number', 32, ['TCP', 3]],
    ['TCP', 'Header Length', 4, ['TCP', 3]], ['TCP', 'Reserved', 4, ['TCP', 3]], ['TCP', 'Flags', 8, ['TCP', 3]], ['TCP', 'Window', 16, ['TCP', 3]], ['TCP', 'Checksum', 16, ['TCP', 3]], ['TCP', 'Urgent Pointer', 16, ['TCP', 3]],
    ['UDP', 'Source Port', 16, ['TCP', 4]], ['UDP', 'Segment Length', 16, ['TCP', 4]], ['UDP', 'Checksum', 16, ['TCP', 4]],
    ['IPv6', 'Version', 4, ['IP6', 7]], ['IPv6', 'Traffic Class', 8, ['IP6', 7]], ['IPv6', 'Flow Label', 20, ['IP6', 7]], ['IPv6', 'Payload Length', 16, ['IP6', 7]], ['IPv6', 'Next Header', 8, ['IP6', 7]], ['IPv6', 'Hop Limit', 8, ['IP6', 7]], ['IPv6', 'Source Address', 128, ['IP6', 7]], ['IPv6', 'gesamter Header (fest)', 320, ['IP6', 7]]
  ],
  random() { return { it: pick(this.items) }; },
  render(task, c) {
    const [hd, f, b, src] = task.it;
    const MERK = { TCP: 'TCP: „Ports 16, Nummern 32, Mitte 4-4-8, hinten alles 16“', UDP: 'UDP: 4 Felder × 16 Bit = 8 Byte', IPv6: 'IPv6: „4-8-20, 16-8-8, dann 2 × 128“ = 320 Bit = 40 Byte' };
    c.area.append(h('p', { class: 'q' }, `${hd}-Header: Feld „`, h('b', null, f), '“'));
    const inp = h('input', { class: 'inp', inputmode: 'numeric', placeholder: 'Bit' });
    c.area.append(inp); c.focus = inp;
    c.onCheck = () => {
      const v = parseNum(inp.value), ok = v === b, msgs = [];
      if (!ok && v === b / 8) msgs.push(`Du hast vermutlich in <b>Byte</b> gerechnet (${b / 8} Byte = ${b} Bit).`);
      msgs.push('Merkhilfe: ' + MERK[hd]);
      feedback(c.fb, ok, ok ? `Richtig: ${b} Bit` : `Falsch – ${f} hat ${b} Bit.`, ok ? [] : msgs);
      return ok;
    };
    c.solution = () => `<p><b>${f}</b> (${hd}) = <b>${b} Bit</b>. ${S(src[0], src[1])}</p><p>${MERK[hd]}</p>`;
  }
},
{
  id: 'pt', title: 'Packet-Tracer-Fragen (selbst beantworten)', src: [['PT', 1]],
  intro: 'Das sind die Fragen vom Packet-Tracer-Arbeitsblatt. Überlege deine Antwort (oder schreib sie auf), dann deck die Musterantwort auf und bewerte dich ehrlich.',
  items: [
    ['Teil 2/1b: Nach dem zweiten Klick auf Capture/Forward verschwinden einige PDUs. Was ist mit ihnen passiert?', 'Sie wurden vom Switch weitergeleitet bzw. im Switch zwischengespeichert, weil pro Leitung und Richtung nur eine PDU gleichzeitig unterwegs sein kann.', ['PT', 2]],
    ['Teil 2/1c: Nur eine PDU in jeder Richtung pro Leitung – wie wird das genannt?', 'Multiplexing – mehrere Datenströme teilen sich die Leitung; Portnummern ordnen sie wieder den Anwendungen zu.', ['PT', 3]],
    ['Teil 2/1d: Warum haben die PDUs in der Ereignisliste verschiedene Farben?', 'Jede Farbe steht für ein anderes Protokoll bzw. eine andere Anwendung (HTTP, FTP, DNS, E-Mail …).', ['PT', 3]],
    ['HTTP (2c): Wie heißt der letzte Abschnitt der ersten PDU? Ist die Kommunikation zuverlässig?', 'TCP – ja, zuverlässig (verbindungsorientiert, Bestätigungen per ACK).', ['PT', 3]],
    ['HTTP (2d): Was steht im Feld links vom Feld WINDOW?', 'Die Flags – bei der ersten PDU SYN (Schritt 1 des 3-Wege-Handshakes). Zielport 80, Quellport z. B. 1025, Seq 0, Ack 0.', ['PT', 3]],
    ['HTTP (2f): Wie unterscheiden sich Ports und Sequenznummern der zurückkommenden PDU?', 'Quell- und Zielport sind vertauscht (Quelle 80 → Ziel Client-Port). Flags SYN+ACK, die Ack-Nummer ist um 1 höher (1).', ['PT', 3]],
    ['FTP (3i): Wie lautet die Nachricht vom Server?', 'Die Begrüßung des FTP-Servers, z. B. „220- Welcome to PT Ftp server“.', ['PT', 4]],
    ['DNS (4c): Letzter Abschnitt? Zuverlässig?', 'UDP – nicht zuverlässig (verbindungslos).', ['PT', 4]],
    ['DNS (4d): Warum gibt es keine Sequenz- und Bestätigungsnummer?', 'Weil UDP verbindungslos ist und weder Reihenfolge noch Ankunft sichert – der UDP-Header hat diese Felder nicht. Zielport 53.', ['PT', 4]],
    ['E-Mail (5c): Welches Transportprotokoll verwendet der E-Mail-Verkehr?', 'TCP – zuverlässig. Zielport 25 (SMTP).', ['PT', 5]],
    ['E-Mail (5j): Welches Protokoll gehört zu TCP-Port 25, welches zu 110?', '25 = SMTP (senden), 110 = POP3 (abholen).', ['PT', 5]],
    ['netstat (6b): Welche Protokolle stehen in der linken Spalte, welche Ports nutzt der Server?', 'TCP; Server-Ports 21 (FTP), 25 (SMTP), 80 (HTTP), 110 (POP3).', ['PT', 6]],
    ['netstat (6c): In welchem Zustand sind die Sitzungen?', 'ESTABLISHED (aufgebaut) – sie werden nach und nach geschlossen.', ['PT', 6]],
    ['netstat (6d): Welche Sitzung bleibt offen und warum?', 'Die FTP-Sitzung – der FTP-Client ist noch angemeldet/verbunden und hat die Verbindung nicht beendet (kein FIN).', ['PT', 6]]
  ],
  fixedFromItems: true,
  render(task, c) {
    const [q, a, src] = task.it;
    c.area.append(h('p', { class: 'q' }, q), h('textarea', { class: 'inp', rows: 2, placeholder: 'Deine Antwort (optional, nur für dich)' }));
    const box = h('div', { class: 'fb hidden' });
    c.area.append(box);
    c.selfAssess = { answer: `<b>Musterantwort:</b> ${a} ${S(src[0], src[1])}<p class="small">Konkrete Zahlen (z. B. Client-Port 1025) können in deiner Simulation abweichen.</p>` };
  }
}
];
['short','full','prefix','type','ports','tcpudp','order'].forEach(id => { const e = EXERCISES.find(x => x.id === id); if (e) e.imp = true; });
