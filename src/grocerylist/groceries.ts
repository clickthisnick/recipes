import * as fs from 'fs';

interface IItem {
    price: number[];
    link: string;
    quantity: number;
    name: string;
}

const items: IItem[] = [
    {
        price: [1.99],
        quantity: 2,
        name: 'Almond Milk',
        link: 'https://www.amazon.com/365-Everyday-Value-Almondmilk-Unsweetened/dp/B074H6M4LN?fpw=fresh'
    },
    {
        price: [3.39],
        quantity: 1,
        name: 'Plain Yogurt',
        link: 'https://www.amazon.com/gp/product/B074H64BYN?ppw=fresh'
    },
    {
        price: [11.32],
        quantity: 2,
        name: 'Frozen Cascade Farm Fruit Raspberry',
        link: 'https://www.amazon.com/Cascadian-Farm-Organic-Raspberries-Organically/dp/B06Y2GKMT9/?fpw=fresh',
    },
    {
        price: [5.66],
        quantity: 5,
        name: 'Chicken Breasts',
        link: 'https://www.amazon.com/gp/product/B00AR0ZZ62?ppw=fresh',
    },
    {
        price: [1.99],
        quantity: 1,
        name: 'Spring Mix',
        link: 'https://www.amazon.com/365-Everyday-Value-Organic-Spring/dp/B074H7KKJT/?fpw=fresh',
    },
    {
        price: [3.49],
        quantity: 1,
        name: 'Unsalted Butter',
        link: 'https://www.amazon.com/gp/product/B074VDJ7KZ?ppw=fresh',
    },
    {
        price: [4.99],
        quantity: 2,
        name: 'Eggs Whites',
        link: 'https://www.amazon.com/365-Everyday-Value-Organic-Whites/dp/B074H5M1PM?ppw=fresh',
    },
    {
        price: [4.29],
        quantity: 2,
        name: 'Dried Apricots',
        link: 'https://www.amazon.com/gp/product/B0014D2992?ppw=fresh',
    },
    // {
    //     price: [5.74],
    //     quantity: 1,
    //     name: 'Low Sodium Bacon',
    //     link: 'https://www.amazon.com/gp/product/B00408JGB2?ppw=fresh',
    // },
    {
        price: [3.32],
        quantity: 1,
        name: 'Briana Artichoke Dressing',
        link: 'https://www.amazon.com/Briannas-Real-French-Vinaigrette-Dressing/dp/B000WLGD4O?fpw=fresh',
    },
    {
        price: [6.99],
        quantity: 1,
        name: 'Almond Butter',
        link: 'https://www.amazon.com/365-Everyday-Value-Almond-Crunchy/dp/B074J76XG2?fpw=fresh',
    },
    {
        price: [4.49],
        quantity: 1,
        name: 'Monterey Jack Cheese',
        link: 'https://www.amazon.com/gp/product/B074HJ4V7C?ppw=fresh',
    },
    {
        price: [4.99],
        quantity: 1,
        name: 'Dish Detergent',
        link: 'https://www.amazon.com/Seventh-Generation-Dishwasher-Detergent-Lemon/dp/B004JX7N2W?fpw=fresh',
    },
    {
        price: [2.99],
        quantity: 1,
        name: 'Wheat Squares',
        link: 'https://www.amazon.com/365-Everyday-Value-Sized-Squares/dp/B074H6M3Z5?fpw=fresh',
    },
    {
        price: [2.99],
        quantity: 1,
        name: 'Kosher Salt',
        link: 'https://www.amazon.com/Morton-Coarse-Kosher-Salt-Ounce/dp/B000Q68WSA?fpw=fresh',
    },
    {
        price: [10.17],
        quantity: 1,
        name: 'Olive Oil',
        link: 'https://www.amazon.com/Pompeian-Robust-Extra-Virgin-Olive/dp/B00ZLUF01I?fpw=fresh',
    },
    {
        price: [14.99],
        quantity: 1,
        name: 'Laundry Detergent',
        link: 'https://www.amazon.com/Seventh-Generation-Laundry-Detergent-Concentrate/dp/B003X028NG?fpw=fresh',
    },
    {
        price: [2.99],
        quantity: 2,
        name: 'Rapsberry Spread',
        link: 'https://www.amazon.com/365-Everyday-Value-Raspberry-Spread/dp/B074H5H17J?&fpw=fresh',
    },
    {
        price: [4.99],
        quantity: 1,
        name: 'Wheat Flour',
        link: 'https://www.amazon.com/365-Everyday-Value-Organic-Whole/dp/B074VDMNDM/?fpw=fresh',
    },
    {
        price: [12.99],
        quantity: 1,
        name: 'Organic Peppercorn',
        link: '',
    },
];

let groceryListHtml = `
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

<table>
    <th>Name</th>
    <th>Quantity</th>
    <th>Link</th>
    <th>Price</th>
    `;

items.forEach((item) => {
    groceryListHtml+= `<tr onclick="this.classList.toggle('completed')">
        <td>${item.name}</td>
        <td>${item.quantity}</td>
        <td><a href="${item.link}" target="_blank" >Link</a></td>
        <td>${item.price.reduce((a, b) => a + b) / item.price.length}</td>
    </tr>`;
});

groceryListHtml += '</table>';

const dateHtml = `<h3><b>Expiration Date:</b> <span id='weekAhead'></span></h3>
If existing item going to be past the expiration date, assume quantity is 0.</br></br>`;

groceryListHtml = `${dateHtml}${groceryListHtml}`;

fs.writeFileSync(`${process.cwd()}/groceryList.html`, groceryListHtml);
console.log('The file was saved!'); //tslint:disable-line no-console
