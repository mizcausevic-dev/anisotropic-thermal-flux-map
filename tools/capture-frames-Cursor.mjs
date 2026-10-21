#!/usr/bin/env node
/*
  Frame-exact PNG capture for index.html, no dependencies (Node ≥ 22, Chrome/Chromium on PATH).

  Usage:
    node tools/capture-frames-Cursor.mjs --frames 0,149,300 --out out/frames
    node tools/capture-frames-Cursor.mjs --all --out out/frames            # 1,020 PNGs, frame-0000.png … frame-1019.png
    node tools/capture-frames-Cursor.mjs --all --out out/frames --chrome chromium

  Assemble (optional, ffmpeg not bundled):
    ffmpeg -framerate 30 -i out/frames/frame-%04d.png -c:v libx264 -pix_fmt yuv420p -crf 16 anisotropic-thermal-flux-map.mp4

  Mechanism: launches one headless Chrome with a DevTools port, opens index.html, calls window.__explainer.render(n)
  for each frame, and reads the canvas as PNG via toDataURL. render(n) is a pure function of n, so output is
  deterministic across runs (fonts aside: the page uses system font fallbacks).
*/
import { spawn } from 'node:child_process';
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const argv = process.argv.slice(2);
const opt = (name, dflt) => { const i = argv.indexOf('--' + name); return i >= 0 ? argv[i + 1] : dflt; };
const has = name => argv.includes('--' + name);

const TOTAL = 1020;
const outDir = resolve(opt('out', 'out/frames'));
const chromeBin = opt('chrome', process.env.CHROME || 'google-chrome');
const htmlPath = resolve(opt('html', 'index.html'));
if (!existsSync(htmlPath)) { console.error('index.html not found at', htmlPath); process.exit(2); }
const url = pathToFileURL(htmlPath).href + '?frame=0&autoplay=0';
let frames;
if (has('all')) frames = Array.from({ length: TOTAL }, (_, i) => i);
else frames = (opt('frames', '0') + '').split(',').map(s => parseInt(s, 10)).filter(n => Number.isInteger(n) && n >= 0 && n < TOTAL);
if (!frames.length) { console.error('No valid frames requested'); process.exit(2); }
mkdirSync(outDir, { recursive: true });

const chrome = spawn(chromeBin, [
  '--headless=new', '--disable-gpu', '--no-sandbox', '--hide-scrollbars', '--mute-audio',
  '--remote-debugging-port=0', `--user-data-dir=/tmp/cfx-chrome-${process.pid}`, '--window-size=1280,900', 'about:blank',
], { stdio: ['ignore', 'ignore', 'pipe'] });

const wsBrowser = await new Promise((res, rej) => {
  let buf = ''; const timer = setTimeout(() => rej(new Error('Chrome did not expose a DevTools endpoint within 30 s')), 30000);
  chrome.stderr.on('data', d => { buf += d; const m = buf.match(/DevTools listening on (ws:\/\/[^\s]+)/); if (m) { clearTimeout(timer); res(m[1]); } });
  chrome.on('exit', code => rej(new Error('Chrome exited early with code ' + code)));
});
const httpBase = wsBrowser.replace(/^ws:\/\/([^/]+)\/.*$/, 'http://$1');
const target = await (await fetch(`${httpBase}/json/new?${encodeURIComponent(url)}`, { method: 'PUT' })).json();

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((res, rej) => { ws.onopen = res; ws.onerror = rej; });
let id = 0; const pending = new Map(); const events = [];
ws.onmessage = ev => { const msg = JSON.parse(ev.data); if (msg.id && pending.has(msg.id)) { const { res, rej } = pending.get(msg.id); pending.delete(msg.id); msg.error ? rej(new Error(msg.error.message)) : res(msg.result); } else if (msg.method) events.push(msg); };
const send = (method, params = {}) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params })); });
const evalJs = async expr => { const r = await send('Runtime.evaluate', { expression: expr, returnByValue: true, awaitPromise: true }); if (r.exceptionDetails) throw new Error(r.exceptionDetails.text + ' ' + (r.exceptionDetails.exception?.description || '')); return r.result.value; };

await send('Page.enable'); await send('Runtime.enable');
await send('Emulation.setDeviceMetricsOverride', { width: 1280, height: 900, deviceScaleFactor: 1, mobile: false });
// Wait for the page's automation surface to exist.
for (let i = 0; i < 100; i++) { if (await evalJs('typeof window.__explainer === "object"')) break; await new Promise(r => setTimeout(r, 100)); }
const meta = await evalJs('JSON.stringify({TOTAL: window.__explainer.TOTAL, FPS: window.__explainer.FPS, selfcheck: document.getElementById("selfcheck").textContent})');
console.log('page:', meta);

const t0 = Date.now();
for (const n of frames) {
  const dataUrl = await evalJs(`(() => { window.__explainer.render(${n}); return document.getElementById('stage').toDataURL('image/png'); })()`);
  writeFileSync(resolve(outDir, `frame-${String(n).padStart(4, '0')}.png`), Buffer.from(dataUrl.split(',')[1], 'base64'));
  if (frames.length > 40 && n % 60 === 0) console.log(`frame ${n}`);
}
console.log(`wrote ${frames.length} frame(s) to ${outDir} in ${((Date.now() - t0) / 1000).toFixed(1)} s`);
const errors = events.filter(e => e.method === 'Runtime.exceptionThrown' || (e.method === 'Runtime.consoleAPICalled' && e.params.type === 'error'));
if (errors.length) { console.error('page errors:', JSON.stringify(errors, null, 1).slice(0, 2000)); }
ws.close(); chrome.kill('SIGKILL');
process.exit(errors.length ? 1 : 0);
