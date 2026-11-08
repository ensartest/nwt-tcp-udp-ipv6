/* IPv6-Werkzeuge: Ausschreiben, Kürzen, Fehlerdiagnose (für die Übungen) */
const IPV6 = (() => {
  const HEX = /^[0-9a-f]{1,4}$/;

  function pad(g) { return g.padStart(4, '0'); }
  function strip(g) { return g.replace(/^0+(?=.)/, ''); }

  /* Text → {ok, groups[8] (4-stellig), left[], right[], hasDC, err} */
  function parse(raw) {
    const s = String(raw || '').trim().toLowerCase().replace(/\s+/g, '');
    if (!s) return { ok: false, err: 'Du hast nichts eingegeben.' };
    if (/[^0-9a-f:]/.test(s)) {
      const bad = [...new Set(s.replace(/[0-9a-f:]/g, '').split(''))].join(' ');
      let hint = '';
      if (/o/.test(s)) hint = ' (Tipp: Hast du den Buchstaben „o“ statt der Ziffer „0“ getippt?)';
      return { ok: false, err: `Ungültige Zeichen: ${bad}. Erlaubt sind nur 0–9, a–f und Doppelpunkte.${hint}` };
    }
    if (s.includes(':::')) return { ok: false, err: 'Drei Doppelpunkte hintereinander gibt es nicht – entweder „:“ (Trennzeichen) oder „::“ (Null-Kette).' };
    const dc = s.split('::').length - 1;
    if (dc > 1) return { ok: false, err: '„::“ kommt mehrmals vor. Es darf nur EINMAL pro Adresse verwendet werden – sonst weiß niemand, wie viele Null-Gruppen an welcher Stelle fehlen.' };
    let left = [], right = [];
    if (dc === 1) {
      const [l, r] = s.split('::');
      left = l ? l.split(':') : [];
      right = r ? r.split(':') : [];
    } else {
      left = s.split(':');
    }
    const all = left.concat(right);
    if (all.some(g => g === '')) return { ok: false, err: 'Da ist ein einzelner Doppelpunkt am Anfang/Ende oder eine leere Gruppe. Jede Gruppe braucht mindestens eine Ziffer (Null-Ketten nur mit „::“).' };
    const long = all.find(g => g.length > 4);
    if (long) return { ok: false, err: `Die Gruppe „${long}“ hat mehr als 4 Ziffern. Eine Gruppe hat höchstens 4 Hex-Ziffern.` };
    if (!all.every(g => HEX.test(g))) return { ok: false, err: 'Mindestens eine Gruppe ist keine gültige Hex-Zahl.' };
    if (dc === 0 && all.length !== 8) return { ok: false, err: `Ohne „::“ müssen genau 8 Gruppen dastehen – bei dir sind es ${all.length}.` };
    if (dc === 1 && all.length > 7) return { ok: false, err: `Mit „::“ dürfen höchstens 7 Gruppen dastehen (mindestens eine wird ja ersetzt) – bei dir sind es ${all.length}.` };
    const missing = 8 - all.length;
    const groups = left.map(pad).concat(Array(dc ? missing : 0).fill('0000'), right.map(pad));
    return { ok: true, groups, left, right, hasDC: dc === 1, missing, norm: s };
  }

  /* längste Null-Kette (≥2), bei Gleichstand die erste */
  function bestRun(groups) {
    let best = { start: -1, len: 0 }, cur = -1, len = 0;
    groups.forEach((g, i) => {
      if (parseInt(g, 16) === 0) { if (cur < 0) { cur = i; len = 0; } len++; if (len > best.len) best = { start: cur, len }; }
      else { cur = -1; len = 0; }
    });
    return best.len >= 2 ? best : { start: -1, len: 0 };
  }

  function zeroRuns(groups) {
    const runs = []; let cur = -1;
    groups.forEach((g, i) => {
      const z = parseInt(g, 16) === 0;
      if (z && cur < 0) cur = i;
      if ((!z || i === 7) && cur >= 0) { const end = z ? i : i - 1; runs.push({ start: cur, len: end - cur + 1 }); cur = -1; }
    });
    return runs;
  }

  function shortest(groups) {
    const s = groups.map(strip);
    const b = bestRun(groups);
    if (b.len < 2) return s.join(':');
    const l = s.slice(0, b.start).join(':');
    const r = s.slice(b.start + b.len).join(':');
    return l + '::' + r;
  }

  function full(groups) { return groups.map(pad).join(':'); }

  /* Fehlerkorrektur für Kürzen-Aufgabe */
  function diagnoseShort(input, target) {
    const sol = shortest(target);
    const p = parse(input);
    if (!p.ok) return { ok: false, msgs: [p.err] };
    const msgs = [];
    const same = p.groups.every((g, i) => parseInt(g, 16) === parseInt(target[i], 16));
    if (!same) {
      p.groups.forEach((g, i) => {
        if (parseInt(g, 16) !== parseInt(target[i], 16)) {
          const t = target[i];
          let m = `Gruppe ${i + 1}: deine Eingabe bedeutet <code>${g}</code>, richtig ist <code>${t}</code>.`;
          const tStrip = strip(t);
          if (tStrip.replace(/0+$/, '') === strip(g) && /0$/.test(t)) m += ' → Du hast <b>hintere</b> Nullen weggelassen. Weg dürfen nur <b>führende</b> (vordere) Nullen!';
          msgs.push(m);
        }
      });
      if (p.hasDC) msgs.push(`Dein „::“ steht für <b>${p.missing}</b> Null-Gruppe(n). Zähle nach: Insgesamt müssen es 8 Gruppen sein – stimmt die Position deines „::“?`);
      msgs.unshift('Deine Adresse ist <b>nicht mehr dieselbe</b> Adresse wie die Aufgabe:');
      return { ok: false, msgs };
    }
    if (p.norm === sol) return { ok: true, msgs: [] };
    // gleiche Adresse, aber nicht kürzeste Form
    const tokens = p.left.concat(p.right);
    const lz = tokens.filter(g => g.length > 1 && g[0] === '0');
    if (lz.length) msgs.push(`Führende Nullen stehen noch da: ${[...new Set(lz)].map(g => `<code>${g}</code> → <code>${strip(g)}</code>`).join(', ')}. (Regel 2: führende Nullen entfernen)`);
    const b = bestRun(target);
    if (!p.hasDC && b.len >= 2) msgs.push(`Du hast kein „::“ verwendet, obwohl eine Null-Kette da ist (Gruppen ${b.start + 1}–${b.start + b.len}). (Regel 3)`);
    if (p.hasDC) {
      const cs = p.left.length, cl = p.missing;
      const inLonger = b.len > cl && cs >= b.start && cs + cl <= b.start + b.len;
      if (cl === 1 && !inLonger) msgs.push('Du hast mit „::“ nur <b>eine einzelne</b> Null-Gruppe ersetzt. Das Skript erlaubt :: für <b>aufeinanderfolgende</b> Null-Gruppen; eine einzelne bleibt <code>0</code> (RFC 5952).');
      if (cs !== b.start || cl !== b.len) {
        if (cs >= b.start && cs + cl <= b.start + b.len) msgs.push(`Dein „::“ ersetzt nur einen Teil der Null-Kette – die ganze Kette (Gruppen ${b.start + 1}–${b.start + b.len}) gehört ins „::“.`);
        else if (b.len > 0) msgs.push(`Du hast die falsche Null-Kette gekürzt. Am kürzesten wird es mit der <b>längsten</b> Kette (Gruppen ${b.start + 1}–${b.start + b.len}, ${b.len} Stück)${zeroRuns(target).filter(r => r.len === b.len).length > 1 ? ' – bei gleich langen Ketten nimmt man die erste (RFC 5952)' : ''}.`);
      }
    }
    if (!msgs.length) msgs.push('Gleiche Adresse, aber noch nicht die kürzeste Schreibweise.');
    msgs.unshift('Die Adresse stimmt inhaltlich ✔, ist aber <b>nicht die kürzeste</b> Schreibweise:');
    return { ok: false, partial: true, msgs };
  }

  /* Fehlerkorrektur für Ausschreiben-Aufgabe */
  function diagnoseFull(input, target) {
    const s = String(input || '').trim().toLowerCase().replace(/\s+/g, '');
    const want = full(target);
    if (s === want) return { ok: true, msgs: [] };
    const p = parse(s);
    if (!p.ok) return { ok: false, msgs: [p.err] };
    const msgs = [];
    const same = p.groups.every((g, i) => g === target[i]);
    if (same) {
      if (p.hasDC) msgs.push('Inhaltlich richtig, aber du hast noch „::“ verwendet. Voll ausgeschrieben heißt: <b>alle 8 Gruppen</b> hinschreiben.');
      const short = (p.left.concat(p.right)).filter(g => g.length < 4);
      if (short.length) msgs.push(`Jede Gruppe braucht <b>4 Ziffern</b> – auffüllen mit führenden Nullen: ${[...new Set(short)].map(g => `<code>${g}</code> → <code>${pad(g)}</code>`).join(', ')}.`);
      msgs.unshift('Die Adresse stimmt inhaltlich ✔, ist aber nicht <b>voll</b> ausgeschrieben:');
      return { ok: false, partial: true, msgs };
    }
    msgs.push('Deine Adresse ist eine <b>andere</b> Adresse:');
    p.groups.forEach((g, i) => { if (g !== target[i]) msgs.push(`Gruppe ${i + 1}: du <code>${g}</code>, richtig <code>${target[i]}</code>`); });
    const cnt = (p.left.concat(p.right)).length;
    if (!p.hasDC && cnt === 8) msgs.push('Tipp: Zähle die Null-Gruppen, die „::“ ersetzt: 8 minus Anzahl der vorhandenen Gruppen.');
    msgs.push('Häufiger Fehler: Nullen <b>hinten</b> statt vorne aufgefüllt (<code>aa</code> wird <code>00aa</code>, nicht <code>aa00</code>).');
    return { ok: false, msgs };
  }

  return { parse, shortest, full, strip, pad, bestRun, zeroRuns, diagnoseShort, diagnoseFull };
})();
