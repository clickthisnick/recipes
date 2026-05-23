import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class CarbItems {
    private static createFactory =
        (name: string, overrides: Partial<IItemObj> = {}) =>
        (quantity = 0, unit: IUnitObj = Units.none) =>
            Ingredient.makeItem(name, quantity, unit, {
                ...overrides,
            });

    public static readonly ricottaCheese = this.createFactory('Ricotta Cheese');

    public static readonly raoPastaElbow = this.createFactory('Rao Pasta Elbow');

    public static readonly abbotPeaItalianSausage = this.createFactory('Abbot Pea Italian Sausage');

    public static readonly pomegraniteSeeds = this.createFactory('Pomegranite Seeds');

    public static readonly pretzelChips = this.createFactory('Pretzel Chips');

    public static readonly quinoa = this.createFactory('Quinoa');

    public static readonly lentilSpaghetti = this.createFactory('Lentil Spaghetti', {
        purchaseLinks: {
            [Stores.wegmans]: {
                organic: [
                    {
                        price: 3.49,
                        quantity: 8.8,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/35264/wegmans-organic-gluten-free-red-lentil-spaghetti',
                        organic: true,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 2.99,
                        quantity: 8,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/Whole-Foods-Market-Organic-Spaghetti/dp/B07FX14M71',
                        organic: true,
                    },
                ],
            },
        },
    });

    public static readonly penneLentil = this.createFactory('Lentil Penne', {
        nutrition: {
            [u.ounce.name]: {
                servings: 2.5,
                serving_size: 3,
                calories: 300,
                sodium: 0,
                protein: 21,
                sugar: 2,
                fiber: 9,
                total_cost: 2.99,
            },
        },
    });

    public static readonly whiteWine = this.createFactory('White Wine');

    public static readonly mapleSyrup = this.createFactory('Maple Syrup');

    public static readonly wholeWheatBread = this.createFactory('White Bread', {
        purchaseLinks: {
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 4.59,
                        quantity: 40,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/30552/wegmans-soft-100-whole-wheat-bread-price-good-for-only-2-or-more',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 3.99,
                        quantity: 22,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Whole-Foods-Market-Sandwich/dp/B082N5Y5B2/ref=sr_1_2_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly whiteBread = this.createFactory('White Bread', {
        purchaseLinks: {
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 1.19,
                        quantity: 22,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/1841/wegmans-giant-bread',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 2.99,
                        quantity: 24,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Everyday-Value-Sandwich-slices/dp/B074H67KW3/ref=sr_1_2_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
        perishableLimit: 10,
    });

    public static readonly spaghettiLentil = this.createFactory('Lentil Spaghetti', {
        nutrition: {
            [u.ounce.name]: {
                calories: 100,
            },
        },
    });

    public static readonly ziti = this.createFactory('Ziti', {
        purchaseLinks: {
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 0.89,
                        quantity: 16,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/221279/wegmans-pasta-ziti',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 1.99,
                        quantity: 16,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/Whole-Foods-Market-Organic-Ziti/dp/B074H64QCF/ref=sr_1_1_0o_wf',
                        organic: true,
                    },
                ],
            },
        },
    });

    public static readonly spaghettiWholeGrain = this.createFactory('Whole Grain Spaghetti', {
        nutrition: {
            [u.ounce.name]: {
                calories: 100,
                sodium: 0,
            },
        },
    });

    public static readonly seaweed = this.createFactory('Seaweed');

    public static readonly sushiRice = this.createFactory('Sushi Rice', {
        nutrition: {
            [u.cup.name]: {
                servings: 10,
                serving_size: 0.25,
                calories: 160,
                sodium: 10,
                protein: 3,
            },
        },
    });

    public static readonly fudgeStripedCookie = this.createFactory('Fudge Stripped Cookie');

    public static readonly miniaturePeanutButterCups = this.createFactory(
        'Miniature Peanut Butter Cups'
    );

    public static readonly quinoaBurger = this.createFactory('Quinoa Burger', {
        purchaseLinks: {
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 4.99,
                        quantity: 4,
                        quantity_unit: u.unit,
                        link: 'https://www.amazon.com/365-Whole-Foods-Market-Mushroom/dp/B0CJJZ9VPF',
                        organic: true,
                    },
                ],
            },
        },
        nutrition: {
            [u.unit.name]: {
                calories: 140,
                sodium: 330,
                protein: 7,
                fiber: 4,
                sugar: 0.99,
            },
        },
    });

    public static readonly orangeFrosting = this.createFactory('Orange Frosting');

    public static readonly oatMilk = this.createFactory('Oat Milk', {
        purchaseLinks: {
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 4.39,
                        quantity: 64,
                        quantity_unit: u.fluid_ounce,
                        link: 'https://shop.wegmans.com/product/227051/wegmans-milk-oat',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                oatly: [
                    {
                        price: 4.99,
                        quantity: 64,
                        quantity_unit: u.fluid_ounce,
                        link: 'https://www.amazon.com/Oatly-Milk-Oat-Full-Fat/dp/B07SX36KZZ/ref=sr_1_12_0o_wf',
                        organic: false,
                    },
                ],
                '365': [
                    {
                        price: 3.99,
                        quantity: 64,
                        quantity_unit: u.fluid_ounce,
                        link: 'https://www.amazon.com/365-Everyday-Value-Beverage-Original/dp/B07SY3YFC1/ref=sr_1_5_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly wholeWheatFlour = this.createFactory('Whole Wheat Flour', {
        purchaseLinks: {
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 3.49,
                        quantity: 5,
                        quantity_unit: u.pound,
                        link: 'https://shop.wegmans.com/product/54401/wegmans-whole-wheat-flour',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                conventional: [
                    {
                        price: 5.39,
                        quantity: 5,
                        quantity_unit: u.pound,
                        link: 'https://www.amazon.com/King-Arthur-Whole-Traditional-Flour/dp/B0007MKWXQ/ref=sr_1_1_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly allPurposeFlour = this.createFactory('Flour (All Purpose) Flour');

    public static readonly archerFlour = this.createFactory('Archer Flour');

    public static readonly buckwheatFlour = this.createFactory('Buckwheat Flour');

    public static readonly whiteRice = this.createFactory('White Rice', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        purchaseLinks: {
            [Stores.wegmans]: {
                conventional: [
                    {
                        price: 5.79,
                        quantity: 10,
                        quantity_unit: u.pound,
                        link: 'https://shop.wegmans.com/product/4815/wegmans-enriched-long-grain-white-rice',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 3.99,
                        quantity: 32,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B084NJHWTQ',
                        organic: true,
                    },
                ],
            },
        },
    });

    public static readonly arborioRice = this.createFactory('Arborio Rice', {
        purchaseLinks: {
            [Stores.wegmans]: {
                organic: [
                    {
                        price: 5.79,
                        quantity: 32,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/59630/wegmans-organic-arborio-rice',
                        organic: true,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 2.99,
                        quantity: 16,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/365-Whole-Foods-Market-Arborio/dp/B084NJ55YB/ref=sr_1_1_0o_wf',
                        organic: false,
                    },
                ],
            },
            [Stores.amazon]: {
                organic: [
                    {
                        price: 23.99,
                        quantity: 11,
                        quantity_unit: u.pound,
                        link: 'https://www.amazon.com/gp/product/B081S4MXB5/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly brownRice = this.createFactory('Brown Rice', {
        nutrition: {
            [u.cup.name]: {
                calories: 678.96,
                sodium: 9.3,
            },
        },
    });

    public static readonly sweetPotatoes = this.createFactory('Sweet Potatoes', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
    });

    public static readonly wildBasmatiRice = this.createFactory('Wild Basmati Rice', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
    });

    public static readonly softTortillaShell = this.createFactory('Soft Tortilla Shell', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        purchaseLinks: {
            [Stores.wegmans]: {
                'Wegmans Fajita Tortilla Gordita Style, FAMILY PACK': [
                    {
                        price: 2.99,
                        quantity: 30.5,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/25809/wegmans-fajita-tortilla-gordita-style-family-pack',
                        organic: false,
                    },
                ],
                'Wegmans Fajita Tortillas, Gordita Style': [
                    {
                        price: 1.89,
                        quantity: 15,
                        quantity_unit: u.ounce,
                        link: 'https://shop.wegmans.com/product/20492/wegmans-fajita-tortillas-gordita-style',
                        organic: false,
                    },
                ],
            },
            [Stores.wholeFoods]: {
                '365 Everyday Value, Organic Flour Tortillas': [
                    {
                        price: 2.29,
                        quantity: 12,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/Maria-Ricardos-Tortilla-Wheat-Flour/dp/B01BPHD06M/ref=sr_1_3_0o_wf',
                        organic: true,
                    },
                ],
                'Maria & Ricardos Tortilla 8In Wheat Flour': [
                    {
                        price: 3.79,
                        quantity: 13.5,
                        quantity_unit: u.ounce,
                        link: 'https://www.amazon.com/Maria-Ricardos-Tortilla-Wheat-Flour/dp/B01BPHD06M/ref=sr_1_3_0o_wf',
                        organic: false,
                    },
                ],
            },
        },
    });

    public static readonly basmatiRice = this.createFactory('Basmati Rice', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
    });

    public static readonly pomegranateJuice = this.createFactory('Pomegranate Juice', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        purchaseLinks: {
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 15.49,
                        quantity: 32,
                        quantity_unit: u.fluid_ounce,
                        link: 'https://www.amazon.com/Lakewood-Organic-Pomegranate-Juice-32oz/dp/B000RELFGC',
                        organic: true,
                    },
                ],
            },
            [Stores.amazon]: {
                organic: [
                    {
                        price: 52.99,
                        quantity: 202.8,
                        quantity_unit: u.fluid_ounce,
                        link: 'https://www.amazon.com/gp/product/B01M8I4G2L/',
                        organic: true,
                    },
                ],
            },
        },
    });

    public static readonly walnut = this.createFactory('Walnut', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        purchaseLinks: {
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 7.99,
                        quantity: 10,
                        quantity_unit: u.ounce,
                        link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-walnut-halves-pieces-10-oz-b07glt4z49',
                        organic: true,
                    },
                ],
            },
        },
    });

    public static readonly brazilNut = this.createFactory('Brazil Nut', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
    });

    public static readonly flaxSeed = this.createFactory('Flax seed', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        purchaseLinks: {
            [Stores.wholeFoods]: {
                organic: [
                    {
                        price: 5.49,
                        quantity: 16,
                        quantity_unit: u.ounce,
                        link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-brown-whole-flaxseed-16-oz-b07myfzr8z',
                        organic: true,
                    },
                ],
            },
        },
    });

    public static readonly flaxSeedCereal = this.createFactory('Flax seed cereal', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
    });

    public static readonly hotdogBunPotato = this.createFactory('Hotdog Bun', {
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        nutrition: {
            [u.unit.name]: {
                calories: 150,
                sodium: 280,
            },
        },
    });
}
