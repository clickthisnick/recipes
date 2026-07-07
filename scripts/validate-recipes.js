'use strict';

const { readFileSync } = require('fs');
const { resolve } = require('path');

const src = readFileSync(resolve(__dirname, '../src/file.ts'), 'utf8');
const lines = src.split('\n');

const errors = [];

// ── Check 1: consecutive .add() calls on the same equipment ──────────────────

const addCalls = [];
for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s+s\((\w+)\.add\(/);
    if (m) addCalls.push({ lineNum: i + 1, lineIdx: i, variable: m[1] });
}

for (let i = 0; i < addCalls.length - 1; i++) {
    const a = addCalls[i];
    const b = addCalls[i + 1];
    if (a.variable !== b.variable) continue;
    const between = lines.slice(a.lineIdx + 1, b.lineIdx);
    if (!between.some(l => /^\s+s\(/.test(l))) {
        errors.push(`line ${a.lineNum}: consecutive .add() on "${a.variable}" — consolidate into a single add()`);
    }
}

// ── Check 2: redundant nutrition entries covered by a conversion ──────────────
//
// If an ingredientFactory defines a conversion from unit A → B (any factor),
// and also has nutrition entries keyed by both A and B, one is redundant —
// the conversion system derives one from the other at runtime.
// A secondary check catches identical value objects (implicit factor: 1).

// Build u.<varName>.name → string map from the `export const u = { ... }` block
const unitNameMap = {};
let inUnitBlock = false;
for (const line of lines) {
    if (/^export const u\s*=\s*\{/.test(line)) { inUnitBlock = true; continue; }
    if (inUnitBlock) {
        if (/^\}/.test(line)) break;
        const m = line.match(/^\s+(\w+):\s*\{[^}]*name:\s*'([^']*)'/);
        if (m) unitNameMap[m[1]] = m[2];
    }
}

function resolveUnit(expr) {
    const m = expr && expr.trim().match(/^u\.(\w+)\.name$/);
    return m ? (unitNameMap[m[1]] ?? null) : null;
}

// Per-ingredient state
let tracking       = false;
let ingredientName = '';
let ingredientLine = 0;
let depth          = 0;   // brace depth relative to start of ingredient's defaults object

let section      = null;  // 'conversions' | 'nutrition' | null
let sectionDepth = 0;     // depth level that direct children of this section sit at

let conversionPairs = []; // { from, to }
let nutritionKeys   = []; // string[]
let nutritionValues = []; // { key, val, lineNum }

function resetIngredient() {
    tracking       = false;
    section        = null;
    conversionPairs = [];
    nutritionKeys   = [];
    nutritionValues = [];
}

function flushIngredient() {
    if (!tracking) return;

    // Check: conversion (A→B) exists but both A and B appear in the nutrition label
    for (const { from, to } of conversionPairs) {
        if (nutritionKeys.includes(from) && nutritionKeys.includes(to)) {
            errors.push(
                `line ${ingredientLine}: "${ingredientName}" — nutrition has entries for both` +
                ` "${from}" and "${to}" but a conversion between them already exists;` +
                ` remove the redundant entry`
            );
        }
    }

    // Fallback: two nutrition entries with identical value objects (implicit factor: 1)
    for (let a = 0; a < nutritionValues.length; a++) {
        for (let b = a + 1; b < nutritionValues.length; b++) {
            if (nutritionValues[a].val === nutritionValues[b].val) {
                errors.push(
                    `line ${nutritionValues[b].lineNum}: "${ingredientName}" — nutrition values for` +
                    ` "${nutritionValues[a].key}" and "${nutritionValues[b].key}" are identical;` +
                    ` use a conversion with factor: 1 instead`
                );
            }
        }
    }

    resetIngredient();
}

for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect a new ingredientFactory (only when not mid-tracking, or on new ones)
    if (!tracking) {
        const m = line.match(/ingredientFactory\('([^']+)'/);
        if (m) {
            ingredientName = m[1];
            ingredientLine = i + 1;
            tracking = true;
            depth = 0;
            // fall through to process braces on this same line
        }
    }

    if (!tracking) continue;

    // Compute brace delta for this line
    let delta = 0;
    for (const ch of line) {
        if (ch === '{') delta++;
        else if (ch === '}') delta--;
    }

    // Detect section opens *before* updating depth so sectionDepth = post-update depth
    if (section === null && delta > 0) {
        if (/\bconversions\s*:\s*\{/.test(line))
            { section = 'conversions'; sectionDepth = depth + delta; }
        else if (/\bnutrition\s*:\s*\{/.test(line))
            { section = 'nutrition'; sectionDepth = depth + delta; }
    }

    const prevDepth = depth;
    depth += delta;

    // Close active section when depth drops below where it opened
    if (section !== null && depth < sectionDepth) section = null;

    // Extract entries from the active section (direct children sit at sectionDepth)
    if (section === 'conversions' && depth === sectionDepth) {
        // [u.X.name]: { to: u.Y, factor: N }
        const m = line.match(/\[([^\]]+)\]:\s*\{[^}]*\bto:\s*(u\.\w+)/);
        if (m) {
            const from = resolveUnit(m[1].trim());
            const toVar = m[2].trim().replace(/^u\./, '');
            const to = unitNameMap[toVar] ?? null;
            if (from && to) conversionPairs.push({ from, to });
        }
    }

    if (section === 'nutrition' && depth === sectionDepth) {
        // [u.X.name]: { servings: N, ... }
        const m = line.match(/\[([^\]]+)\]:\s*(\{[^}]+\})/);
        if (m) {
            const key = resolveUnit(m[1].trim());
            const val = m[2].replace(/\s+/g, ' ').trim();
            if (key) {
                nutritionKeys.push(key);
                nutritionValues.push({ key, val, lineNum: i + 1 });
            }
        }
    }

    // Flush ingredient when its defaults object closes (depth returns to 0 after being positive)
    if (prevDepth > 0 && depth <= 0) {
        flushIngredient();
        depth = 0;
    }
}
flushIngredient(); // catch the last ingredient

// ── Check 3 (warning-only): step text mentions equipment/ingredients it doesn't declare ──
//
// Heuristic, not exhaustive: scans the literal text passed to instruction()/prep()/info()/
// Timer.set()/Timer.gate()/timerStep() calls for words that match a known equipment type or
// ingredient name, then checks whether that step's `equipment:`/`ingredients:` options array
// actually references it (by literal string, by an `X.name` where X is a var built from the
// matching equipment factory, or by a var/inline call built from the matching ingredient
// factory). Steps built via Equipment methods (.add(), .mix(), etc.) already populate these
// arrays automatically and aren't scanned. False positives are expected — this never fails
// the build.

const warnings = [];

function escapeRegex(s) { return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

// Equipment vocabulary: types declared in `export const e = { ... }`, plus any ad-hoc string
// literals used directly in an `equipment: [...]` array (covers e.g. 'sheet pan', which isn't
// backed by an Equipment instance).
const equipmentWords = new Set();
const factoryType = {};
{
    const eBlock = src.match(/export const e = \{([\s\S]*?)\n\};/);
    if (eBlock) {
        for (const m of eBlock[1].matchAll(/(\w+):\s*\([^)]*\)\s*=>\s*new (\w+)\((?:'([^']+)')?/g)) {
            const type = (m[3] || (m[2] === 'NuwaveEquipment' ? 'Nuwave pan' : m[1])).toLowerCase();
            factoryType[m[1]] = type;
            equipmentWords.add(type);
        }
    }
    for (const m of src.matchAll(/equipment:\s*\[([^\]]*)\]/g)) {
        for (const lit of m[1].matchAll(/'([^']+)'/g)) equipmentWords.add(lit[1].toLowerCase());
    }
}

// var name -> equipment type, from `const X = e.pot(...)` etc.
const equipmentVarType = {};
for (const m of src.matchAll(/const (\w+)\s*=\s*e\.(\w+)\(/g)) {
    if (factoryType[m[2]]) equipmentVarType[m[1]] = factoryType[m[2]];
}

// Ingredient vocabulary: display names from `key: ingredientFactory('Display Name'` plus
// `key: ingredientFactory(name || keyToName(key))` shorthand entries declared via
// `simpleIngredients({ key: 'Override' | '' })`. For multi-word names, also index the
// trailing noun alone (e.g. "lentils" for "Black Lentils") since step text is often brief
// ("Cook lentils"). A phrase can map to more than one ingredient key (e.g. "vinegar" from
// both "White Vinegar" and "Rice Vinegar") — coverage passes if any of them is declared.
function keyToName(key) {
    return key.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toUpperCase());
}

const ingredientKeyByPhrase = new Map(); // phrase -> Set<key>
function registerIngredientPhrase(display, key) {
    const full = display.toLowerCase().replace(/\s*\([^)]*\)/g, '').trim(); // strip parenthetical notes
    if (full.length >= 3) {
        if (!ingredientKeyByPhrase.has(full)) ingredientKeyByPhrase.set(full, new Set());
        ingredientKeyByPhrase.get(full).add(key);
    }
    const words = full.split(/\s+/);
    const last = words[words.length - 1];
    if (words.length > 1 && last.length >= 4) {
        if (!ingredientKeyByPhrase.has(last)) ingredientKeyByPhrase.set(last, new Set());
        ingredientKeyByPhrase.get(last).add(key);
    }
}

for (const m of src.matchAll(/(\w+):\s*ingredientFactory\('([^']+)'/g)) {
    registerIngredientPhrase(m[2], m[1]);
}
const simpleBlock = src.match(/\.\.\.simpleIngredients\(\{([\s\S]*?)\}\)/);
if (simpleBlock) {
    for (const m of simpleBlock[1].matchAll(/(\w+):\s*'([^']*)'/g)) {
        registerIngredientPhrase(m[2] || keyToName(m[1]), m[1]);
    }
}

// var name -> ingredient key, from `const X = i.someKey(...)`. Not scope-aware (global
// approximation), but good enough for a best-effort lint check.
const ingredientVarKey = {};
for (const m of src.matchAll(/const (\w+)\s*=\s*i\.(\w+)\(/g)) {
    ingredientVarKey[m[1]] = m[2];
}

const equipmentPhrases    = [...equipmentWords].sort((a, b) => b.length - a.length);
const ingredientPhraseList = [...ingredientKeyByPhrase.keys()].sort((a, b) => b.length - a.length);

// Returns matched phrases, masking each match before testing shorter phrases so e.g. "oven"
// isn't separately reported when "toaster oven" already matched the same words.
function matchPhrases(text, phrases) {
    let masked = text;
    const found = [];
    for (const phrase of phrases) {
        const re = new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'i');
        if (re.test(masked)) {
            found.push(phrase);
            masked = masked.replace(new RegExp(`\\b${escapeRegex(phrase)}\\b`, 'ig'), (s) => ' '.repeat(s.length));
        }
    }
    return found;
}

// Splits a raw argument-list string on top-level commas (ignoring commas nested inside
// (), [], {}, or string/template literals).
function splitTopLevelArgs(str) {
    const args = [];
    let depth = 0;
    let current = '';
    for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (ch === "'" || ch === '"' || ch === '`') {
            const quote = ch;
            current += ch;
            i++;
            while (i < str.length && str[i] !== quote) {
                if (str[i] === '\\') { current += str[i]; i++; }
                if (i < str.length) { current += str[i]; i++; }
            }
            if (i < str.length) current += str[i];
            continue;
        }
        if (ch === '(' || ch === '[' || ch === '{') depth++;
        else if (ch === ')' || ch === ']' || ch === '}') depth--;
        if (ch === ',' && depth === 0) { args.push(current); current = ''; continue; }
        current += ch;
    }
    if (current.trim().length) args.push(current);
    return args.map(a => a.trim());
}

// Finds the matching closing ')' for the '(' at str[openIdx], skipping over parens inside
// string/template literals.
function readBalanced(str, openIdx) {
    let depth = 0;
    for (let i = openIdx; i < str.length; i++) {
        const ch = str[i];
        if (ch === "'" || ch === '"' || ch === '`') {
            const quote = ch;
            i++;
            while (i < str.length && str[i] !== quote) {
                if (str[i] === '\\') i++;
                i++;
            }
            continue;
        }
        if (ch === '(') depth++;
        else if (ch === ')') { depth--; if (depth === 0) return i; }
    }
    return -1;
}

function extractArray(optsStr, key) {
    const m = optsStr.match(new RegExp(`${key}\\s*:\\s*\\[`));
    if (!m) return '';
    const start = m.index + m[0].length - 1; // index of '['
    let depth = 0;
    for (let i = start; i < optsStr.length; i++) {
        if (optsStr[i] === '[') depth++;
        else if (optsStr[i] === ']') { depth--; if (depth === 0) return optsStr.slice(start + 1, i); }
    }
    return '';
}

// Which positional argument holds the step's literal text, per factory function. `info()`
// is deliberately excluded — it's a narrative note shown to the user, not an action step,
// so it has no reason to declare equipment/ingredients.
const TEXT_ARG_INDEX = {
    instruction: 0, prep: 0, prepOnly: 0, timerStep: 0,
    'Timer.set': 2, 'Timer.gate': 0,
};

const STEP_FACTORY_RE = /\b(instruction|prep|prepOnly|Timer\.set|Timer\.gate|timerStep)\(/g;

let sm;
while ((sm = STEP_FACTORY_RE.exec(src)) !== null) {
    const callStart  = sm.index;
    const openParen   = callStart + sm[0].length - 1;
    const closeParen  = readBalanced(src, openParen);
    if (closeParen === -1) continue;
    const argsStr = src.slice(openParen + 1, closeParen);
    const lineNum = src.slice(0, callStart).split('\n').length;

    const args = splitTopLevelArgs(argsStr);
    const idx  = TEXT_ARG_INDEX[sm[1]];
    const rawTextArg = args[idx];
    if (!rawTextArg) continue;

    // Only handle a plain string or template literal — skips definition sites (e.g.
    // `function instruction(text: string, ...)`) and steps with dynamic/variable text.
    const literalMatch = rawTextArg.match(/^(?:'((?:[^'\\]|\\.)*)'|`((?:[^`\\]|\\.)*)`)$/);
    if (!literalMatch) continue;
    const text = (literalMatch[1] ?? literalMatch[2] ?? '').toLowerCase();
    if (!text) continue;

    const rest    = args.slice(idx + 1).join(', ');
    const equipArr = extractArray(rest, 'equipment').toLowerCase();
    const ingArr   = extractArray(rest, 'ingredients');

    for (const phrase of matchPhrases(text, equipmentPhrases)) {
        const coveredLiteral = equipArr.includes(`'${phrase}'`);
        const coveredVar = Object.entries(equipmentVarType).some(
            ([varName, type]) => type === phrase && new RegExp(`\\b${varName}\\.name\\b`).test(equipArr)
        );
        if (!coveredLiteral && !coveredVar) {
            warnings.push(`line ${lineNum}: text mentions "${phrase}" but step doesn't declare it in \`equipment\``);
        }
    }

    for (const phrase of matchPhrases(text, ingredientPhraseList)) {
        const keys = ingredientKeyByPhrase.get(phrase);
        const coveredInline = [...keys].some((key) => new RegExp(`\\bi\\.${key}\\(`).test(ingArr));
        const coveredVar = Object.entries(ingredientVarKey).some(
            ([varName, k]) => keys.has(k) && new RegExp(`\\b${varName}\\b`).test(ingArr)
        );
        if (!coveredInline && !coveredVar) {
            warnings.push(`line ${lineNum}: text mentions "${phrase}" but step doesn't declare it in \`ingredients\``);
        }
    }
}

// ── Report ────────────────────────────────────────────────────────────────────

if (warnings.length > 0) {
    console.warn('Recipe validation warnings (non-blocking):');
    warnings.forEach(w => console.warn(`  ${w}`));
}

if (errors.length > 0) {
    console.error('Recipe validation failed:');
    errors.forEach(e => console.error(`  ${e}`));
    process.exit(1);
}

console.log(
    `Recipe validation passed (${addCalls.length} add() calls, ${Object.keys(unitNameMap).length} units checked)` +
    `${warnings.length > 0 ? `, ${warnings.length} warning(s)` : ''}.`
);
