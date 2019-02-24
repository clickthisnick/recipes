import * as fs from 'fs';

interface IItem {
    expirationDays: number;
    name: string;
}

const items: IItem[] = [
    {
        expirationDays: 3,
        name: 'Mushrooms',
    },
    {
        expirationDays: 3,
        name: 'Sausage',
    },
    {
        expirationDays: 7,
        name: 'Carrot',
    },
];

function getExpirationDate(daysToAdd: number) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + daysToAdd);

    return currentDate.toLocaleDateString('en-US');
}

let expirationCalculatorHtml = `
<style>


    table {
        color: #333;
        /* Lighten up font color */
        font-family: Helvetica, Arial, sans-serif;
        /* Nicer font */
        width: 640px;
        border-collapse: collapse;
        border-spacing: 0;
    }

    td,
    th {
        border: 1px solid #CCC;
        height: 30px;
    }

    /* Make cells a bit taller */

    th {
        background: #F3F3F3;
        /* Light grey background */
        font-weight: bold;
        /* Make sure they're bold */
    }

    td {
        /* Lighter grey background */
        text-align: left;
        /* Center our text */
        padding-left: 1rem;
    }

    .completed {
        background-color:green;
        color: white;
    }

    a:visited {
        color:blue;
    }

    body {
        padding: 1rem;
    }

</style>

<script>
    const oneWeekAhead = new Date();
    oneWeekAhead.setDate(oneWeekAhead.getDate() + 7);
    document.getElementById("weekAhead").innerHTML = oneWeekAhead.toLocaleDateString('en-US')
</script>

Todays Date: ${new Date().toLocaleDateString('en-US')}</br>
<table>
    <th>Item</th>
    <th>Days To Expire</th>
    <th>Expiration Date</th>
    `;

items.forEach((item) => {
    expirationCalculatorHtml+= `<tr onclick="this.classList.toggle('completed')">
        <td>${item.name}</td>
        <td>${item.expirationDays}</td>
        <td>${getExpirationDate(item.expirationDays)}</td>
    </tr>`;
});

expirationCalculatorHtml += '</table>';

fs.writeFileSync(`${process.cwd()}/expirationCalculator.html`, expirationCalculatorHtml);
console.log('The file was saved!'); //tslint:disable-line no-console
