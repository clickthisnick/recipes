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

// ── Report ────────────────────────────────────────────────────────────────────

if (errors.length > 0) {
    console.error('Recipe validation failed:');
    errors.forEach(e => console.error(`  ${e}`));
    process.exit(1);
}

console.log(`Recipe validation passed (${addCalls.length} add() calls, ${Object.keys(unitNameMap).length} units checked).`);
