/* Lerninhalte – aufbauend (roter Faden). Quellen:
   TCP = "NWT 2 – TCP & UDP" (L. Singer, 5 Seiten)
   IP6 = "NWT 2 – IPv6" (L. Singer, 7 Seiten)
   PT  = "Packet Tracer Simulation – TCP- und UDP-Kommunikation" (Cisco, 6 Seiten) */

const SKRIPT = {
  TCP: 'Skript „TCP & UDP“',
  IP6: 'Skript „IPv6“',
  PT: 'Packet-Tracer-Blatt'
};
function S(k, p) {
  return `<span class="src" title="Quelle: ${SKRIPT[k]}, Seite ${p}">📄 ${SKRIPT[k]} · S. ${p}</span>`;
}

const HANDSHAKE_SVG = `
<svg class="seq" viewBox="0 0 420 230" role="img" aria-label="3-Wege-Handshake: SYN, SYN/ACK, ACK">
  <text x="60" y="20" text-anchor="middle" class="seq-h">Client</text>
  <text x="360" y="20" text-anchor="middle" class="seq-h">Server</text>
  <line x1="60" y1="30" x2="60" y2="220" class="seq-life"/>
  <line x1="360" y1="30" x2="360" y2="220" class="seq-life"/>
  <line x1="60" y1="55" x2="355" y2="95" class="seq-a a1"/><polygon points="355,95 343,86 341,98" class="seq-p a1"/>
  <text x="210" y="62" text-anchor="middle" class="seq-t">① SYN  („Hallo, darf ich?“)</text>
  <line x1="360" y1="115" x2="65" y2="155" class="seq-a a2"/><polygon points="65,155 79,145 77,157" class="seq-p a2"/>
  <text x="210" y="122" text-anchor="middle" class="seq-t">② SYN/ACK  („Ja, gehört – du auch?“)</text>
  <line x1="60" y1="175" x2="355" y2="210" class="seq-a a3"/><polygon points="355,210 343,201 341,213" class="seq-p a3"/>
  <text x="210" y="182" text-anchor="middle" class="seq-t">③ ACK  („Passt, los geht's!“)</text>
</svg>`;

const ABBAU_SVG = `
<svg class="seq" viewBox="0 0 420 270" role="img" aria-label="TCP-Verbindungsabbau: FIN, ACK, FIN, ACK">
  <text x="60" y="20" text-anchor="middle" class="seq-h">A (will beenden)</text>
  <text x="360" y="20" text-anchor="middle" class="seq-h">B</text>
  <line x1="60" y1="30" x2="60" y2="260" class="seq-life"/>
  <line x1="360" y1="30" x2="360" y2="260" class="seq-life"/>
  <line x1="60" y1="55" x2="355" y2="85" class="seq-a a4"/><polygon points="355,85 343,76 341,88" class="seq-p a4"/>
  <text x="210" y="60" text-anchor="middle" class="seq-t">① FIN („Ich bin fertig.“)</text>
  <line x1="360" y1="110" x2="65" y2="140" class="seq-a a3"/><polygon points="65,140 79,130 77,142" class="seq-p a3"/>
  <text x="210" y="115" text-anchor="middle" class="seq-t">② ACK („Verstanden.“)</text>
  <line x1="360" y1="165" x2="65" y2="195" class="seq-a a4"/><polygon points="65,195 79,185 77,197" class="seq-p a4"/>
  <text x="210" y="170" text-anchor="middle" class="seq-t">③ FIN („Ich bin auch fertig.“)</text>
  <line x1="60" y1="220" x2="355" y2="250" class="seq-a a3"/><polygon points="355,250 343,241 341,253" class="seq-p a3"/>
  <text x="210" y="225" text-anchor="middle" class="seq-t">④ ACK („Verstanden – Tschüss.“)</text>
</svg>`;

const MODULES = [
/* ───────────────────────── 0 ───────────────────────── */
{
  id: 'm0', part: 'Start', title: 'Der rote Faden: Wie kommen Daten ans Ziel?',
  html: `
<p class="lead">Alle drei Skripten erzählen zusammen <b>eine</b> Geschichte: Ein Datenpaket soll von einem Programm auf deinem PC zu einem Programm auf einem anderen Rechner. Dafür braucht es zwei Dinge:</p>
<ol class="steps">
  <li><b>Welcher Rechner?</b> → das regelt die <b>Schicht 3 (Netzwerk)</b>, also das Internet Protocol. Wir lernen die neue Version <b>IPv6</b>. ${S('IP6',1)}</li>
  <li><b>Welches Programm auf dem Rechner – und wie zuverlässig?</b> → das regelt die <b>Schicht 4 (Transport)</b> mit <b>TCP</b> oder <b>UDP</b> und den <b>Portnummern</b>. ${S('TCP',1)} ${S('TCP',4)}</li>
  <li><b>Live anschauen:</b> Im <b>Packet Tracer</b> siehst du HTTP, FTP, DNS und E-Mail gleichzeitig durchs Netz laufen und kannst Ports, Sequenznummern und Flags ablesen. ${S('PT',1)}</li>
</ol>
<div class="box faden"><b>Das Bild für den ganzen Stoff – der Brief:</b>
<ul>
<li><b>IPv6-Adresse</b> = Hausadresse (welches Haus = welcher Rechner)</li>
<li><b>Portnummer</b> = Name am Briefkasten (welche Person = welches Programm)</li>
<li><b>TCP</b> = Einschreiben mit Rückschein (Zustellung wird bestätigt, Reihenfolge stimmt)</li>
<li><b>UDP</b> = Postwurf/Postkarte (schnell und billig, aber ohne Garantie)</li>
</ul></div>
<p>So ist die Seite aufgebaut – arbeite die Kapitel <b>der Reihe nach</b> durch, jedes baut auf dem vorherigen auf:</p>
<table class="tbl"><tr><th>Teil</th><th>Inhalt</th><th>Skript</th></tr>
<tr><td>A · Schicht 3</td><td>IPv6: warum, Schreibweise, Präfix, Konfiguration, NDP, Adresstypen, Header</td><td>IPv6 S. 1–7</td></tr>
<tr><td>B · Schicht 4</td><td>TCP (Handshake, Header), UDP, Ports</td><td>TCP & UDP S. 1–5</td></tr>
<tr><td>C · Praxis</td><td>Packet Tracer: alles live beobachten</td><td>Packet Tracer S. 1–6</td></tr></table>
<div class="box tipp"><b>Tipp zum Lernen:</b> Lies ein Kapitel, mach den <b>Mini-Check</b> am Ende, hake „Verstanden“ ab. Danach im Tab <b>Übungen</b> rechnen, dann im Tab <b>Test</b> prüfen. Falsche Fragen landen automatisch bei den <b>Karteikarten</b>.</div>
<div class="box merk"><b>Merkhilfe – Schichten:</b> „<b>3 = wer</b> (Rechner), <b>4 = wem</b> (Programm)“. IPv6 ist Schicht 3, TCP/UDP sind Schicht 4.</div>`,
  mini: [
    { q: 'Auf welcher OSI-Schicht arbeiten TCP und UDP?', o: ['Schicht 2', 'Schicht 3', 'Schicht 4', 'Schicht 7'], a: 2, why: 'TCP und UDP sind Protokolle der OSI-Schicht 4 (Transport). IPv6 ist Schicht 3.', src: ['TCP', 1] }
  ]
},
/* ───────────────────────── 1 ───────────────────────── */
{
  id: 'm1', part: 'A · IPv6', title: '1 · Warum überhaupt IPv6?',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Bevor ein Programm angesprochen werden kann, muss erst der <b>Rechner</b> gefunden werden. Dafür braucht jeder Rechner eine IP-Adresse – und genau da liegt das Problem von IPv4.</div>
<p><b>IPv6</b> (Internet Protocol Version 6) ist seit <b>1998</b> standardisiert und überträgt Daten in Rechnernetzen, vor allem im Internet. Es ist – genau wie der Vorgänger IPv4 – ein Protokoll der <b>OSI-Schicht 3 (Netzwerk)</b>. ${S('IP6',1)}</p>
<p>Der <b>Hauptgrund</b> für ein neues Protokoll: Bei IPv4 werden die <b>Adressen knapp</b> (Adressknappheit). ${S('IP6',1)}</p>
<h4>Die 4 Vorteile von IPv6 gegenüber IPv4 ${S('IP6',1)}</h4>
<ol>
<li>Deutlich <b>größerer Adressraum</b></li>
<li><b>Vereinfachter Header</b></li>
<li><b>Automatische Konfiguration</b></li>
<li><b>IPsec</b> ist fester Bestandteil (Sicherheit eingebaut)</li>
</ol>
<div class="box merk"><b>Merkhilfe – 4 Vorteile = „G-V-A-S“:</b> „<b>G</b>roß, <b>V</b>ereinfacht, <b>A</b>utomatisch, <b>S</b>icher“ – oder als Satz: „<b>G</b>anz <b>V</b>iele <b>A</b>dressen, <b>S</b>uper!“</div>
<div class="box merk"><b>Merkhilfe – Jahreszahlen:</b> IPv6 kam <b>1998</b> („kurz vor 2000 kam die neue Adresse“).</div>
<div class="box achtung"><b>Prüfungsfalle:</b> „Schneller“ ist <b>nicht</b> der Hauptgrund. Der Hauptgrund ist die <b>Adressknappheit</b> bei IPv4.</div>`,
  mini: [
    { q: 'Was ist laut Skript der Hauptgrund für IPv6?', o: ['Höhere Geschwindigkeit', 'Adressknappheit bei IPv4', 'Bessere WLAN-Reichweite', 'Kleinere Pakete'], a: 1, why: 'Das Skript nennt ausdrücklich die Adressknappheit bei IPv4 als Hauptgrund.', src: ['IP6', 1] },
    { q: 'Welcher Punkt ist KEIN Vorteil von IPv6 laut Skript?', o: ['IPsec fester Bestandteil', 'Vereinfachter Header', 'Kürzere Adressen', 'Automatische Konfiguration'], a: 2, why: 'IPv6-Adressen sind sogar viel LÄNGER (128 statt 32 Bit) – dadurch gibt es mehr Adressen.', src: ['IP6', 1] }
  ]
},
/* ───────────────────────── 2 ───────────────────────── */
{
  id: 'm2', part: 'A · IPv6', title: '2 · Aufbau & Kurzschreibweise einer IPv6-Adresse',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> IPv6 löst die Adressknappheit mit <b>langen</b> Adressen. Lange Adressen sind mühsam zu schreiben – deshalb gibt es Kürzungsregeln.</div>
<p>Eine IPv6-Adresse ist <b>128 Bit</b> lang. Sie wird in <b>8 Gruppen</b> zu je <b>4 Hexadezimalziffern</b> geschrieben, getrennt durch Doppelpunkte. ${S('IP6',1)}</p>
<div class="addr big"><span class="g">2a01</span>:<span class="g">0468</span>:<span class="g">1000</span>:<span class="g">0009</span>:<span class="g">0000</span>:<span class="g">0000</span>:<span class="g">0000</span>:<span class="g">0004</span></div>
<h4>Für Dummies: Was ist Hexadezimal?</h4>
<p>Wir zählen normal mit 10 Ziffern (0–9). Hexadezimal hat <b>16 Ziffern</b>: <code>0 1 2 3 4 5 6 7 8 9 a b c d e f</code> (a = 10, b = 11 … f = 15).</p>
<ul>
<li>1 Hex-Ziffer kann 16 Werte haben = 2<sup>4</sup> → <b>1 Hex-Ziffer = 4 Bit</b></li>
<li>1 Gruppe = 4 Hex-Ziffern = 4 · 4 = <b>16 Bit</b></li>
<li>8 Gruppen · 16 Bit = <b>128 Bit</b> ✔</li>
</ul>
<div class="box merk"><b>Merkhilfe – „8 · 4 · 4 = 128“:</b> <b>8</b> Gruppen · <b>4</b> Ziffern · <b>4</b> Bit = 128 Bit.</div>
<h4>Die 3 Schritte der Kurzschreibweise ${S('IP6',1)} ${S('IP6',2)}</h4>
<table class="tbl">
<tr><th>Schritt</th><th>Regel</th><th>Beispiel</th></tr>
<tr><td>1</td><td>Adresse <b>voll ausgeschrieben</b> hinschreiben</td><td><code>2a01:0468:1000:0009:0000:0000:0000:0004</code></td></tr>
<tr><td>2</td><td><b>Führende Nullen</b> jeder Gruppe weglassen (aus <code>0000</code> wird <code>0</code>)</td><td><code>2a01:468:1000:9:0:0:0:4</code></td></tr>
<tr><td>3</td><td>Direkt aufeinanderfolgende <b>Null-Gruppen</b> durch <code>::</code> ersetzen – <b>nur EINMAL pro Adresse</b></td><td><code>2a01:468:1000:9::4</code></td></tr>
</table>
<p>Die Schreibweise ist in <b>RFC 5952</b> geregelt. Wichtig: Die Adresse muss trotz Kürzung <b>eindeutig</b> bleiben. ${S('IP6',2)}</p>
<div class="box merk"><b>Merkhilfe – Kürzen:</b> „<b>Vorne Null – fällt raus. Null-Kette – Doppelpunkt-Doppelpunkt. Aber nur EIN Mal!</b>“</div>
<div class="box achtung"><b>Prüfungsfallen:</b>
<ul>
<li>Nur <b>führende</b> Nullen fallen weg, <b>nie</b> hintere: <code>1000</code> bleibt <code>1000</code>, <code>aa00</code> bleibt <code>aa00</code>! <code>00bb</code> wird zu <code>bb</code>.</li>
<li><code>::</code> darf nur <b>einmal</b> vorkommen. Warum? Bei <code>2001::aa::1</code> weiß niemand, wie viele Nullgruppen links und wie viele rechts fehlen → nicht eindeutig.</li>
<li>Das Skript spricht von „aufeinander folgenden Gruppen“ – eine <b>einzelne</b> Nullgruppe bleibt also <code>0</code> (so steht es auch in RFC 5952).</li>
<li>Gibt es mehrere Null-Ketten, kürze die <b>längste</b> mit <code>::</code> – dann ist die Adresse am kürzesten. Sind sie gleich lang, nimm die erste (RFC 5952).</li>
</ul></div>
<h4>Rückwärts: Kurzform → Langform</h4>
<ol class="steps">
<li>Zähle die Gruppen, die dastehen. Beispiel <code>2001::aa:0:1</code> → 2001, aa, 0, 1 = <b>4 Gruppen</b>.</li>
<li>Es müssen 8 sein → <b>8 − 4 = 4</b> Gruppen <code>0000</code> stehen an der Stelle von <code>::</code>.</li>
<li>Jede Gruppe vorne mit Nullen auf 4 Ziffern auffüllen: <code>aa → 00aa</code>, <code>1 → 0001</code>.</li>
<li>Ergebnis: <code>2001:0000:0000:0000:0000:00aa:0000:0001</code></li>
</ol>
<div class="box tipp"><b>Tipp:</b> Beim Ausschreiben IMMER am Schluss die Gruppen zählen. Sind es nicht genau 8, hast du dich verzählt.</div>`,
  mini: [
    { q: 'Wie lautet 2001:0db8:aa00:00bb:0000:0000:0000:0001 in kürzester Form?', o: ['2001:db8:aa:bb::1', '2001:db8:aa00:bb::1', '2001:db8:aa00:00bb::1', '2001:db8:aa00:bb:0:0:0:1'], a: 1, why: 'Nur FÜHRENDE Nullen fallen weg: 0db8→db8, aa00 bleibt aa00 (Nullen hinten!), 00bb→bb. Die drei Null-Gruppen werden zu ::.', src: ['IP6', 2] },
    { q: 'Wie oft darf :: in einer Adresse vorkommen?', o: ['beliebig oft', 'höchstens einmal', 'genau zweimal', 'nur am Anfang'], a: 1, why: 'Sonst wäre nicht eindeutig, wie viele Nullgruppen wo fehlen.', src: ['IP6', 2] }
  ]
},
/* ───────────────────────── 3 ───────────────────────── */
{
  id: 'm3', part: 'A · IPv6', title: '3 · Network Prefix, Interface Identifier & Subnetze',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Du kannst Adressen jetzt lesen und kürzen. Aber was <b>bedeuten</b> die Teile? Wie bei IPv4 gibt es einen Netzanteil und einen Geräteanteil.</div>
<p>IPv6-Adressen sind <b>hierarchisch</b> aufgebaut: Teile der Adresse gelten für unterschiedliche Netze – ähnlich dem Netzwerkteil bei IPv4. ${S('IP6',2)}</p>
<p><b>Standard:</b> Die Adresse wird in <b>zwei gleich große Hälften zu je 64 Bit</b> geteilt: ${S('IP6',2)}</p>
<div class="addr big"><span class="np">2001:0db8:00aa:bbbb</span>:<span class="iid">0000:dddd:eeee:0001</span></div>
<p class="legend"><span class="np">Network Prefix (Global Prefix) – erste 64 Bit</span> <span class="iid">Interface Identifier – letzte 64 Bit</span></p>
<ul>
<li>Die Trennstelle kann auch woanders liegen. Sie wird – wie beim IPv4-Subnetting – mit <b>/ (Slash)</b> hinter der Adresse angegeben. ${S('IP6',2)}</li>
<li>Der <b>Interface Identifier</b> ist in automatisch konfigurierten Netzen <b>immer 64 Bit</b> lang. ${S('IP6',2)}</li>
<li>Typische Präfixlängen: <b>/32, /48, /56</b>. ${S('IP6',2)}</li>
<li>Nutzt der Network Prefix die 64 Bit nicht ganz aus, können die <b>übrigen Bits zum Subnetting</b> verwendet werden. ${S('IP6',3)}</li>
</ul>
<h4>Subnetze ausrechnen – Schritt für Schritt (für Dummies)</h4>
<ol class="steps">
<li>Der Interface Identifier ist fix <b>64 Bit</b> → die ersten 64 Bit gehören dem Netz.</li>
<li>Davon gibt der <b>/-Wert</b> den vorgegebenen Teil an (z. B. /48).</li>
<li><b>Subnetz-Bits = 64 − Präfixlänge</b> (z. B. 64 − 48 = 16).</li>
<li><b>Anzahl Subnetze = 2<sup>Subnetz-Bits</sup></b> (z. B. 2<sup>16</sup> = 65 536).</li>
</ol>
<div class="addr big"><span class="np">2001:0db8:00aa</span>:<span class="sn">bbbb</span>:<span class="iid">0000:dddd:eeee:0001</span>/48</div>
<p class="legend"><span class="np">Präfix 48 Bit</span> <span class="sn">Subnetz 16 Bit</span> <span class="iid">Interface ID 64 Bit</span></p>
<table class="tbl"><tr><th>Präfix</th><th>Subnetz-Bits</th><th>Subnetze</th><th>Wo trennt man? (1 Hex-Ziffer = 4 Bit)</th></tr>
<tr><td>/64 (Standard)</td><td>0</td><td>2<sup>0</sup> = 1</td><td>nach 16 Ziffern = 4 Gruppen</td></tr>
<tr><td>/56</td><td>8</td><td>2<sup>8</sup> = 256</td><td>nach 14 Ziffern = 3 Gruppen + 2 Ziffern</td></tr>
<tr><td>/48</td><td>16</td><td>2<sup>16</sup> = 65 536</td><td>nach 12 Ziffern = 3 Gruppen</td></tr>
<tr><td>/32</td><td>32</td><td>2<sup>32</sup> = 4 294 967 296</td><td>nach 8 Ziffern = 2 Gruppen</td></tr></table>
<p class="small">Diese Tabelle löst die Übungsbeispiele aus dem Skript ${S('IP6',3)} – die Rechnung (64 − Präfix) ergibt sich aus „Interface ID = 64 Bit“ ${S('IP6',2)}.</p>
<div class="box merk"><b>Merkhilfe – Subnetze:</b> „<b>64 minus Slash, dann 2 hoch.</b>“ &nbsp;/48 → 16 → 65 536 · /56 → 8 → 256 · /32 → 32 → ~4,3 Mrd.</div>
<div class="box merk"><b>Merkhilfe – Wo ist die Grenze?</b> „<b>Slash durch 4 = Hex-Ziffern</b>, Slash durch 16 = Gruppen.“ /48 : 16 = 3 Gruppen.</div>
<div class="box achtung"><b>Prüfungsfalle:</b> Steht <b>kein</b> Slash dabei, gilt der Standard <b>/64</b>: Network Prefix = die ersten 4 Gruppen, Interface ID = die letzten 4 Gruppen.</div>`,
  mini: [
    { q: 'Wie viele Subnetze sind bei /56 möglich (Interface ID 64 Bit)?', o: ['56', '8', '256', '65 536'], a: 2, why: '64 − 56 = 8 Subnetz-Bits → 2⁸ = 256 Subnetze.', src: ['IP6', 3] },
    { q: 'Wie lang ist der Interface Identifier in automatisch konfigurierten Netzen?', o: ['32 Bit', '48 Bit', '64 Bit', '128 Bit'], a: 2, why: 'Laut Skript immer 64 Bit.', src: ['IP6', 2] }
  ]
},
/* ───────────────────────── 4 ───────────────────────── */
{
  id: 'm4', part: 'A · IPv6', title: '4 · Wie bekommt ein Gerät seine Adresse? (Konfiguration)',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Wir wissen, wie eine Adresse aussieht (Präfix + Interface ID). Jetzt: <b>Wie kommt sie aufs Gerät?</b> Es gibt <b>3 Möglichkeiten</b>. ${S('IP6',3)}</div>
<table class="tbl"><tr><th>Methode</th><th>Was passiert?</th><th>Quelle</th></tr>
<tr><td><b>1. Manuell</b></td><td>Nichts automatisch – Adresse, Präfix usw. werden <b>für jedes Gerät einzeln</b> eingetragen.</td><td>${S('IP6',3)}</td></tr>
<tr><td><b>2. SLAAC</b><br><small>Stateless Address Autoconfiguration</small></td><td>Ein <b>Router</b> teilt regelmäßig (oder auf Anfrage) den <b>Network Prefix</b> mit. Das Gerät <b>baut sich selbst</b> eine Adresse und <b>prüft, ob sie schon vergeben ist</b> – so lange, bis eine passt. Auch <b>DNS-Adressen</b> können übermittelt werden → vollwertige Netzwerkkonfiguration.</td><td>${S('IP6',3)}</td></tr>
<tr><td><b>3a. Stateless DHCP</b><br><small>zustandslos</small></td><td>Adresse per <b>SLAAC</b>, <b>weitere Infos</b> vom DHCP-Server. Der Server muss <b>keine Adresszuordnungen verwalten</b> → geringe Ansprüche an Leistung und Verfügbarkeit.</td><td>${S('IP6',4)}</td></tr>
<tr><td><b>3b. Stateful DHCP</b><br><small>zustandsbehaftet</small></td><td>Funktioniert <b>wie DHCP bei IPv4</b>: der Server vergibt und merkt sich die Adressen. Für Netze mit <b>enger administrativer Kontrolle</b>.</td><td>${S('IP6',4)}</td></tr></table>
<p>DHCP = <b>Dynamic Host Configuration Protocol</b>. ${S('IP6',3)}</p>
<div class="box merk"><b>Merkhilfe – stateful vs. stateless:</b> „<b>State</b> = Zustand = <b>Liste</b>.“ Stateful-Server <b>führt Buch</b>, wer welche Adresse hat. Stateless-Server führt <b>kein</b> Buch – er gibt nur Zusatzinfos, die Adresse macht sich das Gerät selbst (SLAAC).</div>
<div class="box merk"><b>Merkhilfe – SLAAC:</b> „<b>S</b>elbst <b>L</b>osgelegt, <b>A</b>dresse <b>A</b>utomatisch <b>C</b>onfiguriert“ – der Router sagt nur den Präfix, das Gerät macht den Rest.</div>
<div class="box achtung"><b>Prüfungsfalle:</b> Bei SLAAC kommt der Präfix vom <b>Router</b>, <b>nicht</b> von einem DHCP-Server!</div>`,
  mini: [
    { q: 'Wer teilt bei SLAAC den Network Prefix mit?', o: ['DHCP-Server', 'Router', 'DNS-Server', 'Switch'], a: 1, why: 'Ein entsprechend konfigurierter Router verteilt den Präfix regelmäßig oder auf Anfrage.', src: ['IP6', 3] },
    { q: 'Bei welcher Variante verwaltet der DHCP-Server die Adresszuordnungen?', o: ['Stateless DHCP', 'Stateful DHCP', 'SLAAC', 'Manuell'], a: 1, why: 'Stateful = zustandsbehaftet = der Server führt Buch, wie bei IPv4-DHCP.', src: ['IP6', 4] }
  ]
},
/* ───────────────────────── 5 ───────────────────────── */
{
  id: 'm5', part: 'A · IPv6', title: '5 · NDP – Neighbor Discovery Protocol',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Bei SLAAC muss das Gerät den Router finden und prüfen, ob seine Adresse schon vergeben ist. <b>Wer macht das eigentlich?</b> → NDP.</div>
<p><b>NDP</b> ist ein IPv6-Protokoll zum Austausch <b>link-lokaler Nachrichten</b> (also mit den direkten Nachbarn). Es basiert auf <b>ICMPv6</b>, das bei IPv6 viel wichtiger ist als ICMP bei IPv4. ${S('IP6',4)}</p>
<p>NDP <b>ersetzt ARP, RARP und IGMP</b> aus IPv4 und macht noch mehr: ${S('IP6',4)}</p>
<ul class="cols">
<li><b>Router Discovery & Prefix Discovery</b> – Router und Präfix finden</li>
<li><b>Parameter Discovery</b> – z. B. MTU und Hop Limit</li>
<li><b>SLAAC</b> – Adress-Autokonfiguration</li>
<li><b>Address Resolution</b> – Adressauflösung (früher ARP)</li>
<li><b>Nächsten Hop</b> bestimmen</li>
<li><b>NUD</b> – Neighbor Unreachability Detection (Nachbar nicht erreichbar?)</li>
<li><b>DAD</b> – Duplicate Address Detection (doppelte Adresse?)</li>
<li><b>Redirect</b> – Umleitung</li>
</ul>
<div class="box merk"><b>Merkhilfe – NDP ersetzt „ARI“:</b> <b>A</b>RP, <b>R</b>ARP, <b>I</b>GMP. Und NDP läuft über <b>ICMPv6</b>.</div>
<div class="box merk"><b>Merkhilfe – NDP ist der neugierige Nachbar:</b> Er fragt: „Wo ist der Router?“ (Router Discovery) – „Wer bist du?“ (Address Resolution) – „Lebst du noch?“ (NUD) – „Gibt's die Adresse schon?“ (DAD) – „Geh lieber da lang!“ (Redirect).</div>
<div class="box tipp"><b>Verbindung zu Kapitel 4:</b> Das „Prüfen, ob die Adresse schon vergeben ist“ bei SLAAC ist genau die <b>DAD</b> von NDP.</div>`,
  mini: [
    { q: 'Welches IPv4-Protokoll wird u. a. durch NDP ersetzt?', o: ['DNS', 'ARP', 'TCP', 'DHCP'], a: 1, why: 'NDP löst ARP, RARP und IGMP ab.', src: ['IP6', 4] },
    { q: 'Wofür steht DAD?', o: ['Dynamic Address Distribution', 'Duplicate Address Detection', 'Default Address Domain', 'Direct Access Device'], a: 1, why: 'DAD = Duplicate Address Detection = Erkennung doppelter Adressen.', src: ['IP6', 4] }
  ]
},
/* ───────────────────────── 6 ───────────────────────── */
{
  id: 'm6', part: 'A · IPv6', title: '6 · IPv6-Adresstypen',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Geräte haben jetzt Adressen. Aber nicht jede Adresse ist gleich: Manche gelten weltweit, manche nur im eigenen Netz, manche sprechen eine ganze Gruppe an. Den Typ erkennst du an den <b>ersten Zeichen</b>.</div>
<h4>Unicast – ein Empfänger ${S('IP6',4)} ${S('IP6',5)}</h4>
<table class="tbl"><tr><th>Typ</th><th>Präfix</th><th>Erste Bits</th><th>Bedeutung</th></tr>
<tr><td><b>Global Unicast</b></td><td><code>2000::/3</code></td><td>001</td><td>„normale“ Adressen im Internet. Derzeit soll vorzugsweise <code>2001::</code> verwendet werden. ${S('IP6',4)} ${S('IP6',5)}</td></tr>
<tr><td><b>Site Local</b> <span class="tag">veraltet</span></td><td><code>FEC0::/10</code></td><td>1111111011</td><td>wie private IPv4-Adressen – soll <b>nicht mehr</b> verwendet werden (deprecated), Ersatz: Unique Local. ${S('IP6',5)}</td></tr>
<tr><td><b>Link-Local</b></td><td><code>FE80::/10</code></td><td>1111111010</td><td>wie APIPA/Zeroconf bei IPv4 (169.254.x.x). <b>Jedes Gerät</b> wählt sich eine und <b>behält</b> sie. ${S('IP6',5)}</td></tr>
<tr><td><b>Unique Local</b></td><td><code>FD00::/8</code></td><td>11111101</td><td>aktueller Standard für <b>private</b> Adressen, werden im Internet nicht geroutet. 40 Bit Global ID per <b>Zufall</b> → nicht garantiert weltweit eindeutig. ${S('IP6',5)}</td></tr>
<tr><td><b>Unique Local (Provider)</b></td><td><code>FC00::/8</code></td><td>11111100</td><td><b>zentral verwaltet</b>, vom <b>Provider</b> vergeben. ${S('IP6',5)}</td></tr></table>
<p>Regel: Lokales Netz selbst einrichten → <b>FD00::/8</b>. Suffix vom Provider bekommen → <b>FC00::/8</b>. ${S('IP6',5)}</p>
<h4>Spezielle Adressen ${S('IP6',5)}</h4>
<ul><li><b>Unspezifizierte Adresse:</b> <code>::</code> (= 0:0:0:0:0:0:0:0)</li><li><b>Loopback:</b> <code>::1</code> (= 0:0:0:0:0:0:0:1)</li></ul>
<h4>Multicast – eine Gruppe ${S('IP6',5)}</h4>
<p>Präfix <code>FF00::/8</code>. Wird viel häufiger als bei IPv4 verwendet, weil es den <b>Broadcast ersetzt</b> (IPv6 hat keinen Broadcast!). Man kann Gruppen bilden, z. B. alle Geräte, die einen bestimmten Dienst anbieten.</p>
<h4>Anycast – der Nächste aus einer Gruppe ${S('IP6',6)}</h4>
<p>Eine Adresse spricht <b>einen</b> Rechner aus einer Gruppe an – es antwortet der mit der <b>kürzesten Route</b> bzw. der am <b>schnellsten erreichbare</b>. Verwendet Adressen aus dem <b>Unicast-Bereich</b>. Gab's schon bei IPv4 (dort fehleranfällig), bei IPv6 ist es von Anfang an eingeplant.</p>
<h4>Für Dummies: Wie erkenne ich den Typ?</h4>
<ol class="steps"><li>Schau auf die <b>erste Gruppe</b>.</li>
<li><code>2…</code> oder <code>3…</code> → Global Unicast (beginnt mit Bits 001: 0010 = 2, 0011 = 3).</li>
<li><code>fe8…</code>–<code>feb…</code> → Link-Local · <code>fec…</code>–<code>fef…</code> → Site Local</li>
<li><code>fd…</code> → Unique Local (selbst) · <code>fc…</code> → Unique Local (Provider)</li>
<li><code>ff…</code> → Multicast · <code>::1</code> → Loopback · <code>::</code> → unspezifiziert</li></ol>
<div class="box merk"><b>Merkhilfe – Präfixe:</b><br>
<b>2</b>000 = „<b>2</b>u allen in der Welt“ (Global) ·
<b>FE80</b> = „<b>F</b>ür <b>E</b>inen Link“ (Link-Local) ·
<b>FD</b> = „<b>F</b>ür <b>D</b>aheim“ (privat, selbst) ·
<b>FC</b> = „<b>F</b>rom <b>C</b>arrier“ (vom Provider) ·
<b>FF</b> = „<b>F</b>ür <b>F</b>reunde“ (Gruppe = Multicast) ·
<b>FEC0</b> = „<b>F</b>rüher <b>E</b>inmal <b>C</b>ool“ (veraltet)</div>
<div class="box merk"><b>Merkhilfe – Cast-Arten:</b> <b>Uni</b> = einer · <b>Multi</b> = viele (Gruppe) · <b>Any</b> = irgendeiner (der Nächste).</div>
<div class="box achtung"><b>Prüfungsfalle:</b> IPv6 kennt <b>keinen Broadcast</b> – Multicast ersetzt ihn.</div>`,
  mini: [
    { q: 'Welcher Typ ist fe80::1a2b:3c4d?', o: ['Global Unicast', 'Link-Local', 'Multicast', 'Unique Local'], a: 1, why: 'fe80 = FE80::/10 = Link-Local.', src: ['IP6', 5] },
    { q: 'Was ersetzt bei IPv6 den Broadcast?', o: ['Anycast', 'Multicast', 'Loopback', 'Unicast'], a: 1, why: 'Multicast (FF00::/8) ersetzt den Broadcast.', src: ['IP6', 5] }
  ]
},
/* ───────────────────────── 7 ───────────────────────── */
{
  id: 'm7', part: 'A · IPv6', title: '7 · IPv6-Header & Übergangsmechanismen',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Die Adressen stehen im <b>Header</b> – dem „Briefumschlag“ des Pakets. Der IPv6-Header ist bewusst einfach gehalten.</div>
<p>Der IPv6-Header ist <b>bedeutend einfacher</b> als der IPv4-Header: Er enthält nur noch für das <b>Routing</b> relevante Infos → weniger Rechenaufwand für Router. ${S('IP6',6)}</p>
<p><b>Fragmentierung</b> macht nicht mehr der Router, sondern der <b>Host</b>: Ist ein Paket zu groß, schickt der Router eine <b>Fehlermeldung</b> zurück, der Host fragmentiert und sendet die Teile neu. ${S('IP6',6)}</p>
<p>Manche Felder sind von IPv4 übernommen, manche umbenannt/verschoben, manche ganz weggelassen. Der Header hat eine <b>feste Länge von 40 Byte (320 Bit)</b>. ${S('IP6',7)}</p>
<h4>Felder des IPv6-Headers ${S('IP6',7)}</h4>
<div class="hdr">
 <div class="hrow"><span style="flex:4">Version 4</span><span style="flex:8">Traffic Class 8</span><span style="flex:20">Flow Label 20</span></div>
 <div class="hrow"><span style="flex:16">Payload Length 16</span><span style="flex:8">Next Header 8</span><span style="flex:8">Hop Limit 8</span></div>
 <div class="hrow"><span style="flex:32">Source Address 128</span></div>
 <div class="hrow"><span style="flex:32">Destination Address 128</span></div>
</div>
<table class="tbl"><tr><th>Feld</th><th>Bit</th><th>Bedeutung</th></tr>
<tr><td>Version</td><td>4</td><td>Version des IP-Protokolls</td></tr>
<tr><td>Traffic Class</td><td>8</td><td>Priorität des Pakets</td></tr>
<tr><td>Flow Label</td><td>20</td><td>Reihenfolge im Datenstrom – für Echtzeit & Streaming</td></tr>
<tr><td>Payload Length</td><td>16</td><td>Anzahl Bytes (Daten) nach dem Header</td></tr>
<tr><td>Next Header</td><td>8</td><td>Verweis auf übergeordnetes Protokoll oder Header Extension</td></tr>
<tr><td>Hop Limit</td><td>8</td><td>verbleibende Weiterleitungen – entspricht <b>TTL</b> bei IPv4</td></tr>
<tr><td>Source Address</td><td>128</td><td>Absender-Adresse</td></tr>
<tr><td>Destination Address</td><td>128</td><td>Ziel-Adresse</td></tr></table>
<p class="small">Kontrolle: 4+8+20 = 32 · 16+8+8 = 32 · 128+128 = 256 → 32+32+256 = <b>320 Bit = 40 Byte</b> ✔</p>
<div class="box merk"><b>Merkhilfe – Header-Zeilen:</b> „<b>4-8-20</b>, <b>16-8-8</b>, dann <b>2 × 128</b>“ – jede der ersten zwei Zeilen ergibt 32 Bit.</div>
<div class="box merk"><b>Merkhilfe – Hop Limit:</b> „<b>Hop</b>-Limit = wie oft das Paket noch <b>hüpfen</b> darf“ = TTL.</div>
<h4>Übergangsmechanismen (IPv4 & IPv6 gleichzeitig) ${S('IP6',7)}</h4>
<table class="tbl"><tr><th>Ansatz</th><th>Idee</th></tr>
<tr><td><b>Dual Stack</b> (Parallelbetrieb)</td><td>Hosts haben <b>beide</b> Protokolle voll implementiert.</td></tr>
<tr><td><b>Tunneling</b></td><td>IPv6-Pakete werden von Relays <b>in IPv4-Pakete verpackt</b>, durchs IPv4-Netz geschickt und am anderen Ende ausgepackt. Verfahren: <b>6to4, 6over4, ISATAP</b>.</td></tr>
<tr><td><b>Übersetzung</b></td><td>Verfahren, die im Prinzip ein <b>NAT</b> machen.</td></tr></table>
<div class="box merk"><b>Merkhilfe – Übergang „D-T-Ü“:</b> „<b>D</b>oppelt, <b>T</b>unnel, <b>Ü</b>bersetzen“ – wie bei einer Sprache: beide sprechen (Dual Stack), Brief im Brief (Tunnel), Dolmetscher (NAT).</div>
<div class="box faden"><b>Übergang zu Teil B:</b> Jetzt kommt das Paket beim richtigen <b>Rechner</b> an. Das Feld <b>Next Header</b> verweist auf das übergeordnete Protokoll – z. B. <b>TCP oder UDP</b> auf Schicht 4. Dort geht's weiter!</div>`,
  mini: [
    { q: 'Wie lang ist der IPv6-Header?', o: ['20 Byte', '40 Byte, fest', '60 Byte', 'variabel'], a: 1, why: 'Fest 40 Byte = 320 Bit.', src: ['IP6', 7] },
    { q: 'Wer fragmentiert bei IPv6 zu große Pakete?', o: ['der Router', 'der Host (Sender)', 'der Switch', 'niemand'], a: 1, why: 'Der Router schickt eine Fehlermeldung, der Host fragmentiert neu.', src: ['IP6', 6] }
  ]
},
/* ───────────────────────── 8 ───────────────────────── */
{
  id: 'm8', part: 'B · TCP & UDP', title: '8 · TCP: Grundidee & 3-Wege-Handshake',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Das Paket ist beim richtigen Rechner. Jetzt Schicht 4: <b>Wie kommen die Daten sicher und in der richtigen Reihenfolge beim richtigen Programm an?</b> → TCP. TCP und UDP sind die zwei wichtigen Protokolle der <b>OSI-Schicht 4</b>. ${S('TCP',1)}</div>
<p><b>TCP</b> = Transmission Control Protocol. Es ist <b>verbindungsorientiert</b> – Daten werden <b>sicher</b> ausgetauscht. TCP stellt sicher, dass Daten <b>ankommen</b> und in der <b>richtigen Reihenfolge</b> an die oberen Schichten gehen. ${S('TCP',1)}</p>
<ul><li>Standardisiert <b>1981</b>, beschrieben in <b>RFC 793</b>. ${S('TCP',1)}</li>
<li>(Fast) ausschließliches Transportprotokoll für <b>WWW, E-Mail</b> und viele andere Dienste. ${S('TCP',1)}</li></ul>
<h4>Verbindungsaufbau: der 3-Wege-Handshake ${S('TCP',1)}</h4>
${HANDSHAKE_SVG}
<ol class="steps">
<li><b>Client → Server: SYN</b> (synchronize). Ein Paket, bei dem im TCP-Header das <b>SYN-Bit gesetzt</b> ist.</li>
<li><b>Server → Client:</b><br>– Port <b>geschlossen</b> → Antwort <b>RST</b> (Reset = „keine Verbindung möglich“).<br>– Port <b>offen</b> → Antwort <b>SYN/ACK</b> (bestätigt das SYN und stimmt zu; ACK = Acknowledgement = Bestätigung).</li>
<li><b>Client → Server: ACK</b> mit der Sequenznummer <b>x+1</b>. Die Verbindung steht.</li></ol>
<div class="box merk"><b>Merkhilfe – Handshake = Telefonat:</b> „<b>Hallo?</b>“ (SYN) – „<b>Hallo, ich hör dich – hörst du mich?</b>“ (SYN/ACK) – „<b>Ja!</b>“ (ACK). <br>Kurz: <b>„SYN – SYN-ACK – ACK“</b>, 3 Schritte = 3 Wege.</div>
<div class="box merk"><b>Merkhilfe – RST:</b> „<b>R</b>e<b>S</b>e<b>T</b> = Tür zu.“ Geschlossener Port → RST statt SYN/ACK.</div>
<div class="box achtung"><b>Prüfungsfalle:</b> Der Client antwortet im 3. Schritt nur mit <b>ACK</b> – nicht nochmal mit SYN. Und ein <b>geschlossener</b> Port antwortet mit <b>RST</b>, nicht mit FIN!</div>`,
  mini: [
    { q: 'Was ist die richtige Reihenfolge beim Verbindungsaufbau?', o: ['ACK → SYN → SYN/ACK', 'SYN → SYN/ACK → ACK', 'SYN → ACK → FIN', 'FIN → ACK → SYN'], a: 1, why: 'Client SYN, Server SYN/ACK, Client ACK.', src: ['TCP', 1] },
    { q: 'Was sendet der Server, wenn der gewünschte Port geschlossen ist?', o: ['SYN/ACK', 'FIN', 'RST', 'nichts'], a: 2, why: 'TCP-RST signalisiert, dass keine Verbindung aufgebaut werden kann.', src: ['TCP', 1] }
  ]
},
/* ───────────────────────── 9 ───────────────────────── */
{
  id: 'm9', part: 'B · TCP & UDP', title: '9 · TCP: Daten senden & Verbindung beenden',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Die Verbindung steht (Handshake). Jetzt fließen Daten – und am Ende wird ordentlich aufgelegt.</div>
<h4>Datenübertragung ${S('TCP',2)}</h4>
<ul>
<li>Jetzt können <b>beide</b> Seiten Daten senden und empfangen.</li>
<li>Ein Datenpaket auf <b>Layer 4</b> heißt <b>Segment</b>.</li>
<li>Die Segmente sind <b>nummeriert</b> (Sequenznummer).</li>
<li>Jedes empfangene Segment wird vom Empfänger mit <b>ACK</b> bestätigt.</li>
<li>Kommt nach einer gewissen Zeit <b>kein ACK</b>, sendet der Sender das Segment <b>erneut</b>.</li>
</ul>
<div class="box merk"><b>Merkhilfe – PDU-Namen:</b> Schicht 4 = „<b>S</b>egment“ – „<b>4 S</b>eiten hat ein <b>S</b>egment-Brief“. (Im Packet Tracer heißen alle Pakete allgemein <b>PDU</b> = Protokolldateneinheit ${S('PT',1)}.)</div>
<h4>Verbindungsabbau ${S('TCP',2)}</h4>
<p>Eine Verbindung kann <b>sowohl vom Client als auch vom Server</b> ordnungsgemäß beendet werden.</p>
${ABBAU_SVG}
<ol class="steps"><li>Wer beenden will, schickt <b>FIN</b>.</li><li>Die andere Seite bestätigt mit <b>ACK</b>.</li><li>Dann folgt von dort ein eigenes <b>FIN</b>.</li><li>Ein abschließendes <b>ACK</b> → Verbindung ordnungsgemäß geschlossen.</li></ol>
<div class="box merk"><b>Merkhilfe – Abbau = „FIN-ACK, FIN-ACK“</b> (4 Schritte): Jede Seite sagt „Ich bin <b>fertig</b>“ (FIN = finish) und die andere sagt „<b>OK</b>“ (ACK). Aufbau 3 Wege, Abbau 4 Wege.</div>
<div class="box achtung"><b>Prüfungsfalle:</b> Nicht nur der Client darf beenden – <b>beide</b> dürfen. Und: kein ACK erhalten → <b>erneut senden</b> (nicht Verbindung abbrechen).</div>`,
  mini: [
    { q: 'Wie heißt ein Datenpaket auf Layer 4?', o: ['Frame', 'Segment', 'Bit', 'Paket'], a: 1, why: 'Auf Schicht 4 spricht man von Segmenten.', src: ['TCP', 2] },
    { q: 'Was macht der Sender, wenn er kein ACK bekommt?', o: ['Verbindung abbrechen', 'Segment erneut senden', 'auf UDP wechseln', 'RST senden'], a: 1, why: 'Nach einer gewissen Zeit ohne ACK wird erneut gesendet.', src: ['TCP', 2] }
  ]
},
/* ───────────────────────── 10 ───────────────────────── */
{
  id: 'm10', part: 'B · TCP & UDP', title: '10 · Der TCP-Header',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> SYN, ACK, FIN, Sequenznummern – all das steht im <b>TCP-Header</b>. Hier siehst du, wo genau.</div>
<div class="hdr">
 <div class="hrow"><span style="flex:16">Source Port 16</span><span style="flex:16">Destination Port 16</span></div>
 <div class="hrow"><span style="flex:32">Sequence Number 32</span></div>
 <div class="hrow"><span style="flex:32">Acknowledgement Number 32</span></div>
 <div class="hrow"><span style="flex:4">HL 4</span><span style="flex:4">Res. 4</span><span style="flex:8">Flags 8</span><span style="flex:16">Window 16</span></div>
 <div class="hrow"><span style="flex:16">Checksum 16</span><span style="flex:16">Urgent Pointer 16</span></div>
 <div class="hrow opt"><span style="flex:32">Options 0–320 (Vielfaches von 32)</span></div>
</div>
<table class="tbl"><tr><th>Feld</th><th>Bit</th><th>Bedeutung ${S('TCP',3)}</th></tr>
<tr><td>Source Port</td><td>16</td><td>Port des <b>Senders</b>; ordnet die Verbindung einer <b>Anwendung</b> zu</td></tr>
<tr><td>Destination Port</td><td>16</td><td>Port des <b>Empfängers</b></td></tr>
<tr><td>Sequence Number</td><td>32</td><td>bei SYN: Start-Nummer; bei Daten: Nummer des Segments → richtige <b>Reihenfolge</b></td></tr>
<tr><td>Acknowledgement Number</td><td>32</td><td>nur gültig mit <b>ACK-Flag</b>: welche Sequenznummer als <b>nächstes erwartet</b> wird</td></tr>
<tr><td>Header Length</td><td>4</td><td>Länge des Headers in <b>32-Bit-Blöcken</b> inkl. Optionen (= Start der Nutzdaten), auch <b>Data Offset</b></td></tr>
<tr><td>Reserved</td><td>4</td><td>ungenutzt, für Zukunft reserviert</td></tr>
<tr><td>Flags</td><td>8</td><td>steuern die Verbindung (Öffnen, Schließen, Fehler …) – z. B. SYN, ACK, FIN, RST, URG</td></tr>
<tr><td>Window</td><td>16</td><td>wie viele <b>Bytes</b> der Empfänger bereit ist zu empfangen</td></tr>
<tr><td>Checksum</td><td>16</td><td>Prüfsumme – erkennt Übertragungsfehler</td></tr>
<tr><td>Urgent Pointer</td><td>16</td><td>ähnlich Data Offset, nur gültig mit <b>URG-Flag</b></td></tr>
<tr><td>Options</td><td>0–320</td><td>für obere Schichten; Vielfaches von 32 Bit</td></tr></table>
<p class="small">Selbst nachgerechnet aus den Bit-Angaben (ohne Options): 16+16+32+32+4+4+8+16+16+16 = <b>160 Bit = 20 Byte</b> Mindestgröße.</p>
<div class="box merk"><b>Merkhilfe – Bit-Größen:</b> „<b>Ports 16, Nummern 32</b>, alles andere hinten 16 – nur die Mitte ist <b>4-4-8</b>.“</div>
<div class="box merk"><b>Merkhilfe – Seq vs. Ack:</b> <b>Seq</b> = „<b>Das</b> ist Stück Nr. x.“ · <b>Ack</b> = „Danke, ich will als <b>Nächstes</b> Nr. y.“</div>
<div class="box merk"><b>Merkhilfe – Window:</b> „Das <b>Fenster</b> zeigt, wie viel noch <b>reinpasst</b>.“ (Bytes, die der Empfänger aufnehmen kann)</div>
<div class="box achtung"><b>Prüfungsfalle:</b> Header Length zählt in <b>32-Bit-Blöcken</b>, nicht in Byte! Und die Ack-Nummer ist die <b>nächste erwartete</b> Nummer, nicht die zuletzt empfangene.</div>`,
  mini: [
    { q: 'Wie viele Bit hat die Sequence Number?', o: ['8', '16', '32', '64'], a: 2, why: 'Sequence- und Acknowledgement Number haben je 32 Bit.', src: ['TCP', 3] },
    { q: 'Was gibt das Window-Feld an?', o: ['die Fenstergröße am Bildschirm', 'wie viele Bytes der Empfänger bereit ist zu empfangen', 'die Anzahl der Segmente', 'die Portnummer'], a: 1, why: 'Window = Empfangsbereitschaft in Bytes.', src: ['TCP', 3] }
  ]
},
/* ───────────────────────── 11 ───────────────────────── */
{
  id: 'm11', part: 'B · TCP & UDP', title: '11 · UDP & der Vergleich mit TCP',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> TCP ist zuverlässig, aber aufwendig (Handshake, ACKs, großer Header). Für manche Anwendungen ist <b>Tempo wichtiger als Perfektion</b> → UDP.</div>
<p><b>UDP</b> = User Datagram Protocol. <b>Verbindungslos</b> – Daten werden einfach losgeschickt. ${S('TCP',4)}</p>
<ul>
<li>Es wird <b>nicht</b> sichergestellt, dass Pakete ankommen → Datenverlust möglich.</li>
<li><b>Kein</b> Mechanismus für die richtige Reihenfolge.</li>
<li>Auch UDP nutzt <b>Portnummern</b> zur Zuordnung zur Anwendung.</li>
<li>Standardisiert <b>1980</b>, <b>RFC 768</b>.</li>
<li><b>Schlanker Header</b>, geringer Overhead → ideal für <b>schnelle</b> Anwendungen, bei denen Genauigkeit nicht so wichtig ist: <b>Videostreams, VoIP, Computerspiele</b>.</li>
<li>Videostream: Ein <b>konstanter</b> Bild-/Tonstrom ist wichtiger, als dass jedes Einzelbild ankommt.</li></ul>
<h4>UDP-Header ${S('TCP',4)}</h4>
<div class="hdr">
 <div class="hrow"><span style="flex:16">Source Port 16</span><span style="flex:16">Destination Port 16</span></div>
 <div class="hrow"><span style="flex:16">Segment Length 16</span><span style="flex:16">Checksum 16</span></div>
</div>
<ul><li><b>Segment Length</b>: Länge der Daten <b>inkl. UDP-Header</b> in <b>Bytes</b>.</li><li><b>Checksum</b>: erkennt fehlerhafte Daten.</li></ul>
<p class="small">Selbst nachgerechnet: 4 Felder × 16 Bit = 64 Bit = <b>8 Byte</b> (TCP mind. 20 Byte).</p>
<h4>TCP vs. UDP auf einen Blick</h4>
<table class="tbl"><tr><th></th><th>TCP</th><th>UDP</th></tr>
<tr><td>Verbindung</td><td>verbindungsorientiert (Handshake)</td><td>verbindungslos</td></tr>
<tr><td>Ankunft garantiert?</td><td>ja (ACK, Neusenden)</td><td>nein</td></tr>
<tr><td>Reihenfolge</td><td>ja (Sequenznummern)</td><td>nein</td></tr>
<tr><td>Seq/Ack-Nummern</td><td>ja</td><td>nein</td></tr>
<tr><td>Header</td><td>10 Felder + Options</td><td>4 Felder, schlank</td></tr>
<tr><td>Beispiele</td><td>WWW (HTTP), E-Mail, FTP</td><td>Video, VoIP, Spiele, DNS ${S('PT',4)}</td></tr>
<tr><td>Jahr / RFC</td><td>1981 / RFC 793</td><td>1980 / RFC 768</td></tr></table>
<div class="box merk"><b>Merkhilfe – TCP vs. UDP:</b> <b>TCP = Telefonat</b> (man verbindet sich, bestätigt, legt auf). <b>UDP = Radio</b> (einfach senden, egal ob jemand zuhört). Oder: „<b>U</b>DP = <b>U</b>nzuverlässig, aber <b>U</b>ltraschnell.“</div>
<div class="box merk"><b>Merkhilfe – Jahre & RFCs:</b> „<b>U</b>DP war <b>zuerst</b> (1980), TCP ein Jahr später (1981). Die <b>kleinere RFC-Nummer</b> (768) gehört dem <b>kleineren Protokoll</b> (UDP), die größere (793) dem größeren (TCP).“</div>
<div class="box achtung"><b>Prüfungsfalle:</b> UDP hat <b>auch</b> Ports und eine Checksum! Was UDP fehlt: Sequenz-/Bestätigungsnummern, Flags, Window – also alles für Zuverlässigkeit.</div>`,
  mini: [
    { q: 'Welches Feld hat der UDP-Header NICHT?', o: ['Source Port', 'Checksum', 'Sequence Number', 'Segment Length'], a: 2, why: 'UDP hat nur Source Port, Destination Port, Segment Length und Checksum.', src: ['TCP', 4] },
    { q: 'Für welche Anwendung eignet sich UDP laut Skript besonders?', o: ['E-Mail', 'Webseiten (WWW)', 'Videostreams', 'Dateidownload per FTP'], a: 2, why: 'Videostreams, VoIP und Spiele – Tempo/konstanter Strom ist wichtiger als jedes Einzelbild.', src: ['TCP', 4] }
  ]
},
/* ───────────────────────── 12 ───────────────────────── */
{
  id: 'm12', part: 'B · TCP & UDP', title: '12 · Portnummern',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Sowohl TCP als auch UDP haben Source- und Destination-Port im Header. Der Port sagt, <b>welches Programm</b> gemeint ist – das ist der „Name am Briefkasten“.</div>
<p>Die Portnummer dient der <b>Zuordnung einer Verbindung zu einer Anwendung</b>. ${S('TCP',3)} Portnummern können offiziell bei der <b>IANA</b> registriert sein – grundsätzlich darf aber jeder Entwickler eine <b>beliebige</b> Portnummer verwenden. ${S('TCP',5)}</p>
<table class="tbl"><tr><th>Port</th><th>Anwendung</th><th>Merkhilfe</th></tr>
<tr><td><b>20</b></td><td>FTP Datentransfer</td><td rowspan="2">FTP hat <b>zwei</b> Ports: <b>21 = Chef</b> (Steuerung, Befehle), <b>20 = Arbeiter</b> (trägt die Daten). „Erst kommt der Chef (21 ist die Tür), dann die Daten (20).“</td></tr>
<tr><td><b>21</b></td><td>FTP Steuerung</td></tr>
<tr><td><b>22</b></td><td>SSH (Secure Shell, scp, sFTP)</td><td>„<b>22</b> = <b>S</b>icher <b>S</b>H“ – zwei 2er, zwei S</td></tr>
<tr><td><b>23</b></td><td>Telnet</td><td>„Telnet ist der unsichere Bruder direkt nach SSH“</td></tr>
<tr><td><b>25</b></td><td>SMTP (Mail senden)</td><td>„<b>S</b>end <b>M</b>ail <b>T</b>o <b>P</b>eople – mit <b>25</b> verschickt man Post“</td></tr>
<tr><td><b>53</b></td><td>DNS</td><td>„<b>D-N-S</b> hat <b>3</b> Buchstaben, und gesucht wird mit allen <b>5</b> Sinnen → <b>5-3</b>“ → Namensauflösung (läuft im PT über UDP)</td></tr>
<tr><td><b>80</b></td><td>HTTP (Web)</td><td>„In <b>80</b> Tagen um die Welt – mit dem <b>W</b>orld <b>W</b>ide Web“</td></tr>
<tr><td><b>110</b></td><td>POP3 (Mail abholen) ${S('PT',5)}</td><td>„<b>110</b> – Post <b>holen</b>“; SMTP <b>senden</b> (25), POP3 <b>abholen</b> (110)</td></tr>
<tr><td><b>520</b></td><td>RIP (Routing)</td><td>„<b>RIP</b> = Ruhe in Frieden um <b>5:20</b>“</td></tr></table>
<p class="small">Ports 20–80 und 520: ${S('TCP',5)} · Port 25 = SMTP und 110 = POP3 werden im Packet Tracer abgefragt: ${S('PT',5)}</p>
<div class="box merk"><b>Merkhilfe – Reihe 20–23:</b> „<b>F</b>TP, <b>F</b>TP, <b>S</b>SH, <b>T</b>elnet“ → „<b>F</b>ertig? <b>F</b>ertig! <b>S</b>icher? <b>T</b>schüss!“</div>
<div class="box tipp"><b>Tipp:</b> Der <b>Client</b> benutzt meistens eine beliebige höhere Portnummer (im Packet Tracer z. B. 1025), der <b>Server</b> die bekannte Nummer (z. B. 80). In der Antwort sind Quell- und Zielport <b>vertauscht</b>. ${S('PT',3)}</div>`,
  mini: [
    { q: 'Welcher Port gehört zu DNS?', o: ['25', '53', '80', '110'], a: 1, why: 'DNS = 53.', src: ['TCP', 5] },
    { q: 'Wofür ist Port 21?', o: ['FTP Datentransfer', 'FTP Steuerung', 'SSH', 'Telnet'], a: 1, why: '21 = FTP Steuerung, 20 = FTP Datentransfer.', src: ['TCP', 5] }
  ]
},
/* ───────────────────────── 13 ───────────────────────── */
{
  id: 'm13', part: 'C · Praxis', title: '13 · Packet Tracer: TCP & UDP live beobachten',
  html: `
<div class="box faden"><b>Wo stehen wir?</b> Jetzt kommt alles zusammen: IP-Adressen, TCP-Handshake, UDP, Ports. Im Packet Tracer siehst du es in Zeitlupe.</div>
<h4>Topologie & Ziel ${S('PT',1)}</h4>
<p>Ein <b>MultiServer</b> hängt an einem <b>Switch</b>, daran 4 Clients: <b>HTTP-, FTP-, DNS- und E-Mail-Client</b>. Lernziele: (1) Netzwerkverkehr im Simulationsmodus erzeugen, (2) Funktion von TCP und UDP überprüfen – inkl. <b>Multiplexing</b> und Portnummern.</p>
<p>Daten werden in kleinere Stücke geteilt und gekennzeichnet, damit man sie wieder zusammensetzen kann. Jedes Stück heißt <b>PDU</b> (Protokolldateneinheit) und gehört zu einer Schicht. ${S('PT',1)}</p>
<h4>Teil 1 – Verkehr erzeugen ${S('PT',1)} ${S('PT',2)}</h4>
<table class="tbl"><tr><th>Schritt</th><th>Was tun?</th><th>Protokoll</th></tr>
<tr><td>1</td><td>MultiServer → <code>ping 192.168.1.255</code> (füllt die ARP-Tabellen, damit später weniger Verkehr stört)</td><td>ARP/ICMP</td></tr>
<tr><td>2</td><td>Simulationsmodus; HTTP-Client → Web Browser → <code>192.168.1.254</code></td><td>HTTP → TCP</td></tr>
<tr><td>3</td><td>FTP-Client → <code>ftp 192.168.1.254</code></td><td>FTP → TCP</td></tr>
<tr><td>4</td><td>DNS-Client → <code>nslookup multiserver.pt.ptu</code></td><td>DNS → UDP</td></tr>
<tr><td>5</td><td>E-Mail-Client → Mail an user@multiserver.pt.ptu senden</td><td>SMTP/POP3 → TCP</td></tr></table>
<div class="box achtung"><b>Hinweis aus dem Blatt:</b> Fenster nur <b>minimieren</b>, nicht schließen – und <b>nie</b> „Reset Simulation“ klicken, sonst Teil 1 wiederholen. ${S('PT',2)} ${S('PT',3)}</div>
<h4>Teil 2 – Was man beobachtet (Musterantworten)</h4>
<p class="small">Die konkreten Zahlen (z. B. Client-Port 1025) können in deiner Simulation abweichen – entscheidend ist das Prinzip. Die Prinzipien stammen aus dem TCP/UDP-Skript.</p>
<table class="tbl">
<tr><th>Frage</th><th>Antwort & Begründung</th></tr>
<tr><td>PDUs verschwinden nach dem 2. Capture/Forward – warum? ${S('PT',2)}</td><td>Sie werden im <b>Switch zwischengespeichert</b> und warten, bis die Leitung frei ist bzw. werden zum Ziel weitergeleitet.</td></tr>
<tr><td>Nur eine PDU je Richtung pro Leitung – wie heißt das? ${S('PT',3)}</td><td><b>Multiplexing</b>: Viele Datenströme (HTTP, FTP, DNS, Mail) teilen sich nacheinander dieselbe Leitung; die <b>Ports</b> ordnen sie wieder den Anwendungen zu.</td></tr>
<tr><td>Warum verschiedene Farben? ${S('PT',3)}</td><td>Jede Farbe steht für ein anderes <b>Protokoll/eine andere Anwendung</b>.</td></tr>
<tr><td>HTTP: letzter Abschnitt der ersten PDU? Zuverlässig? ${S('PT',3)}</td><td><b>TCP</b> – ja, <b>zuverlässig</b> (verbindungsorientiert, ACKs). ${S('TCP',1)}</td></tr>
<tr><td>HTTP: Werte & Feld links von WINDOW ${S('PT',3)}</td><td>Quellport = Client-Port (z. B. 1025), Zielport <b>80</b>, Seq 0, Ack 0. Links von Window stehen die <b>Flags</b>: <b>SYN</b> → Schritt 1 des Handshakes. ${S('TCP',1)} ${S('TCP',3)}</td></tr>
<tr><td>HTTP: Antwort-PDU (zurück mit Häkchen) ${S('PT',3)}</td><td>Ports <b>vertauscht</b> (Quelle 80, Ziel 1025), Flags <b>SYN+ACK</b>, Ack-Nummer = 1 (= Seq des Clients + 1) → Schritt 2.</td></tr>
<tr><td>HTTP: zweite Outbound-PDU des Clients ${S('PT',3)}</td><td>Wieder Quelle 1025 → Ziel 80, Flag <b>ACK</b>, Seq 1 / Ack 1 → Schritt 3, Verbindung steht; danach folgen die HTTP-Daten.</td></tr>
<tr><td>FTP: dasselbe ${S('PT',4)}</td><td>Letzter Abschnitt <b>TCP</b>, zuverlässig, Zielport <b>21</b> (FTP-Steuerung), SYN → SYN+ACK → ACK. Nachricht vom Server: Begrüßung des FTP-Servers (z. B. „220- Welcome to PT Ftp server“).</td></tr>
<tr><td>DNS: letzter Abschnitt? Zuverlässig? ${S('PT',4)}</td><td><b>UDP</b> – <b>nicht</b> zuverlässig (verbindungslos). ${S('TCP',4)}</td></tr>
<tr><td>DNS: Warum keine Seq-/Ack-Nummer? ${S('PT',4)}</td><td>Weil <b>UDP</b> verbindungslos ist und <b>keine</b> Bestätigung/Reihenfolge kennt – der UDP-Header hat diese Felder gar nicht. Zielport <b>53</b>. ${S('TCP',4)}</td></tr>
<tr><td>DNS: Antwort-PDU ${S('PT',5)}</td><td>Ports vertauscht (Quelle 53); letzter Abschnitt = die <b>DNS</b>-Antwort mit der aufgelösten Adresse.</td></tr>
<tr><td>E-Mail: Transportprotokoll? ${S('PT',5)}</td><td><b>TCP</b>, zuverlässig; Zielport <b>25 (SMTP)</b>; gleicher Handshake wie bei HTTP.</td></tr>
<tr><td>Port 25 / Port 110? ${S('PT',5)}</td><td><b>25 = SMTP</b> (senden), <b>110 = POP3</b> (abholen).</td></tr>
<tr><td><code>netstat</code> am Server: Protokolle, Ports? ${S('PT',6)}</td><td>Protokoll <b>TCP</b>; Server-Ports <b>21, 25, 80, 110</b> (FTP, SMTP, HTTP, POP3). DNS fehlt, weil UDP <b>keine Sitzungen</b> hat.</td></tr>
<tr><td>Zustand der Sitzungen? ${S('PT',6)}</td><td><b>ESTABLISHED</b> (aufgebaut); nach und nach werden sie geschlossen.</td></tr>
<tr><td>Welche bleibt offen und warum? ${S('PT',6)}</td><td>Die <b>FTP</b>-Sitzung – der FTP-Client ist noch <b>angemeldet</b> (wartet auf Benutzername/Befehle); die Verbindung wurde nicht mit FIN beendet. ${S('TCP',2)}</td></tr></table>
<div class="box merk"><b>Merkhilfe – Packet Tracer in einem Satz:</b> „<b>HTTP, FTP, Mail → TCP mit Handshake; DNS → UDP ohne Seq/Ack.</b> Antwort = Ports vertauscht. Was offen bleibt, ist FTP.“</div>
<div class="box faden"><b>Der rote Faden schließt sich:</b> IPv6/IP bringt das Paket zum Rechner (Teil A) → der Port bringt es zum Programm, TCP oder UDP entscheiden über Zuverlässigkeit (Teil B) → im Packet Tracer siehst du genau das (Teil C). Jetzt: ab in die <b>Übungen</b>!</div>`,
  mini: [
    { q: 'Welches Transportprotokoll verwendet DNS im Packet Tracer?', o: ['TCP', 'UDP', 'ICMP', 'ARP'], a: 1, why: 'Der letzte Abschnitt der DNS-PDU ist UDP – daher auch keine Seq-/Ack-Nummer.', src: ['PT', 4] },
    { q: 'Was steht bei der ersten HTTP-PDU links vom Feld WINDOW?', o: ['FIN', 'SYN', 'RST', 'URG'], a: 1, why: 'Links von Window stehen die Flags – bei der ersten PDU ist SYN gesetzt (Handshake Schritt 1).', src: ['PT', 3] }
  ]
}
];
