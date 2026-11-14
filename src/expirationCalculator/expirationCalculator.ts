import * as fs from 'fs';

interface IItem {
    expirationDays: number;
    name: string;
}

const items: IItem[] = [
    { expirationDays: 3, name: 'Mushrooms' },
    { expirationDays: 3, name: 'Sausage' },
    { expirationDays: 7, name: 'Carrot' },
];

function escapeHtml(value: string): string {
    return value
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

function slug(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

const rows = items.map((item) => {
    const id = `used-${slug(item.name)}`;
    const safeName = escapeHtml(item.name);
    return `                    <tr>
                        <th scope="row">${safeName}</th>
                        <td data-label="Days to expire">${item.expirationDays}</td>
                        <td data-label="Expiration date" data-expiration-days="${item.expirationDays}"></td>
                        <td data-label="Used"><input id="${id}" data-testid="${id}" type="checkbox" data-used="${safeName}"> <label for="${id}">Used<span class="visually-hidden"> ${safeName}</span></label></td>
                    </tr>`;
}).join('\n');

const expirationCalculatorHtml = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Expiration calculator | Recipes</title>
    <link rel="stylesheet" href="./src/site.css">
</head>
<body>
    <a class="skip-link visually-hidden" href="#content">Skip to content</a>
    <main id="content">
        <h1>Expiration calculator</h1>
        <p>Today: <time id="today"></time></p>
        <p id="expiration-status" class="status visually-hidden" role="status" aria-live="polite"></p>
        <div class="table-wrap" tabindex="0" role="region" aria-labelledby="expiration-caption">
            <table class="stack">
                <caption id="expiration-caption">Days until these items expire</caption>
                <thead>
                    <tr>
                        <th scope="col">Item</th>
                        <th scope="col">Days to expire</th>
                        <th scope="col">Expiration date</th>
                        <th scope="col">Used</th>
                    </tr>
                </thead>
                <tbody>
${rows}
                </tbody>
            </table>
        </div>
    </main>
    <script type="module">
        import { addCalendarDays, formatUsDate, isoDate } from './src/site-logic.js';

        const today = new Date();
        const todayEl = document.getElementById('today');
        todayEl.textContent = formatUsDate(today);
        todayEl.dateTime = isoDate(today);

        for (const cell of document.querySelectorAll('[data-expiration-days]')) {
            const days = Number(cell.getAttribute('data-expiration-days'));
            const when = addCalendarDays(today, days);
            cell.textContent = formatUsDate(when);
            cell.dateTime = isoDate(when);
        }

        const status = document.getElementById('expiration-status');
        for (const box of document.querySelectorAll('[data-used]')) {
            box.addEventListener('change', () => {
                box.closest('tr').classList.toggle('completed', box.checked);
                const name = box.getAttribute('data-used');
                status.textContent = box.checked ? name + ' marked used' : name + ' marked still in the fridge';
            });
        }
    </script>
</body>
</html>
`;

fs.writeFileSync(`${process.cwd()}/expirationCalculator.html`, expirationCalculatorHtml);
console.log('The file was saved!');
