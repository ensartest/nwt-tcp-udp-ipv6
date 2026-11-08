// Baut aus index.html + style.css + js/*.js eine einzelne Datei für das Claude-Artifact.
// Aufruf: node tools/build-artifact.js  → .claude/artifact/nwt-lernseite.html
const fs = require('fs'), path = require('path');
const root = path.resolve(__dirname, '..');
const read = f => fs.readFileSync(path.join(root, f), 'utf8');
const html = read('index.html');
const body = html.split(/<body>/)[1].split(/<\/body>/)[0];
const scripts = [...body.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const inner = body.replace(/<script src="[^"]+"><\/script>\s*/g, '');
const js = scripts.map(s => `/* ${s} */\n` + read(s).replace(/<\/script/gi, '<\\/script')).join('\n');
const out = `<title>NWT 2 Lernseite</title>
<style>
${read('style.css')}
</style>
${inner}
<script>
${js}
</script>
`;
const dir = path.join(root, '.claude', 'artifact');
fs.mkdirSync(dir, { recursive: true });
fs.writeFileSync(path.join(dir, 'nwt-lernseite.html'), out);
console.log('ok', out.length, 'Zeichen,', scripts.length, 'Skripte');
