#!/usr/bin/env node
/**
 * CryptaKey project checks — zero dependencies.
 *   npm run check
 *
 *  1. Every first-party script parses (node --check equivalent).
 *  2. No Math.random() in first-party code (CSPRNG only).
 *  3. No inline <script> blocks and no remote http(s) script/style/font URLs in index.html.
 *  4. Every local file referenced from index.html exists.
 *  5. data/eff-wordlist.json is valid JSON with 7,776 unique words.
 */
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const failures = [];
const fail = (msg) => failures.push(msg);
const read = (p) => fs.readFileSync(path.join(root, p), 'utf8');

// 1 + 2 — first-party JavaScript
const jsDir = path.join(root, 'js');
for (const file of fs.readdirSync(jsDir).filter((f) => f.endsWith('.js'))) {
  const src = fs.readFileSync(path.join(jsDir, file), 'utf8');
  try { new vm.Script(src, { filename: file }); } catch (e) { fail(`js/${file}: syntax error — ${e.message}`); }
  if (/Math\.random\s*\(/.test(src.replace(/\/\*[\s\S]*?\*\/|\/\/.*$/gm, ''))) fail(`js/${file}: uses Math.random()`);
}

// 3 + 4 — index.html hygiene
const html = read('index.html');
if (/<script(?![^>]*\bsrc=)[^>]*>/i.test(html)) fail('index.html: inline <script> block found');
if (/(?:src|href)=["']https?:\/\/[^"']*\.(?:js|css|woff2?|ttf)["']/i.test(html)) fail('index.html: remote script/style/font URL found');
for (const m of html.matchAll(/(?:src|href)=["']([^"'#:]+?)["']/g)) {
  const ref = m[1];
  if (/^(?:mailto|tel|data):/.test(ref)) continue;
  if (!fs.existsSync(path.join(root, ref))) fail(`index.html: referenced file missing — ${ref}`);
}

// 5 — wordlist
try {
  const words = JSON.parse(read('data/eff-wordlist.json'));
  if (!Array.isArray(words) || words.length !== 7776) fail(`wordlist: expected 7776 words, found ${words.length}`);
  else if (new Set(words).size !== 7776) fail('wordlist: contains duplicates');
} catch (e) { fail(`wordlist: ${e.message}`); }

if (failures.length) {
  console.error('✗ Checks failed:\n  - ' + failures.join('\n  - '));
  process.exit(1);
}
console.log('✓ All checks passed');
