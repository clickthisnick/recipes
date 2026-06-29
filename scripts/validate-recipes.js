'use strict';

const { readFileSync } = require('fs');
const { resolve } = require('path');

const src = readFileSync(resolve(__dirname, '../src/file.ts'), 'utf8');
const lines = src.split('\n');

// Collect every equipment.add() call written as s(variable.add(...))
const addCalls = [];
for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^\s+s\((\w+)\.add\(/);
    if (m) addCalls.push({ lineNum: i + 1, lineIdx: i, variable: m[1] });
}

const errors = [];
for (let i = 0; i < addCalls.length - 1; i++) {
    const a = addCalls[i];
    const b = addCalls[i + 1];
    if (a.variable !== b.variable) continue;

    // If no other s(...) call sits between the two adds, they're consecutive
    const between = lines.slice(a.lineIdx + 1, b.lineIdx);
    const hasInterveningStep = between.some(l => /^\s+s\(/.test(l));
    if (!hasInterveningStep) {
        errors.push(`line ${a.lineNum}: consecutive .add() on "${a.variable}" — consolidate into a single add()`);
    }
}

if (errors.length > 0) {
    console.error('Recipe validation failed:');
    errors.forEach(e => console.error(`  ${e}`));
    process.exit(1);
}

console.log(`Recipe validation passed (${addCalls.length} add() calls checked).`);
