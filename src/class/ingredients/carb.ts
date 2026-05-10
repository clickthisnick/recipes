import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class CarbItems {
    private static makeCarbItem(
        name: string,
        quantity = 0,
        unit: IUnitObj = Units.none,
        overrides: Partial<IItemObj> = {}
    ): Ingredient {
        return Ingredient.makeItem(name, quantity, unit, {
            ...overrides,
        });
    }

    public static readonly ricottaCheese = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Ricotta Cheese', quantity, unit);
    };

    public static readonly raoPastaElbow = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Rao Pasta Elbow', quantity, unit);
    };

    public static readonly abbotPeaItalianSausage = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Abbot Pea Italian Sausage', quantity, unit);
    };

    public static readonly pomegraniteSeeds = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Pomegranite Seeds', quantity, unit);
    };

    public static readonly pretzelChips = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Pretzel Chips', quantity, unit);
    };

    public static readonly quinoa = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Quinoa', quantity, unit);
    };

    public static readonly lentilSpaghetti = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Lentil Spaghetti', quantity, unit, {
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
    };

    public static readonly penneLentil = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Lentil Penne', quantity, unit, {
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
    };

    public static readonly whiteWine = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('White Wine', quantity, unit);
    };

    public static readonly mapleSyrup = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Maple Syrup', quantity, unit);
    };

    public static readonly wholeWheatBread = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('White Bread', quantity, unit, {
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
    };

    public static readonly whiteBread = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('White Bread', quantity, unit, {
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
    };

    public static readonly spaghettiLentil = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Lentil Spaghetti', quantity, unit, {
            nutrition: {
                [u.ounce.name]: {
                    calories: 100,
                },
            },
        });
    };

    public static readonly ziti = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Ziti', quantity, unit, {
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
    };

    public static readonly spaghettiWholeGrain = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Whole Grain Spaghetti', quantity, unit, {
            nutrition: {
                [u.ounce.name]: {
                    calories: 100,
                    sodium: 0,
                },
            },
        });
    };

    public static readonly seaweed = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Seaweed', quantity, unit);
    };

    public static readonly sushiRice = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Sushi Rice', quantity, unit, {
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
    };

    public static readonly fudgeStripedCookie = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Fudge Stripped Cookie', quantity, unit);
    };

    public static readonly miniaturePeanutButterCups = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Miniature Peanut Butter Cups', quantity, unit);
    };

    public static readonly quinoaBurger = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Quinoa Burger', quantity, unit, {
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
    };

    public static readonly orangeFrosting = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Orange Frosting', quantity, unit);
    };

    public static readonly oatMilk = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Oat Milk', quantity, unit, {
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
    };

    public static readonly wholeWheatFlour = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Whole Wheat Flour', quantity, unit, {
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
    };

    public static readonly allPurposeFlour = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Flour (All Purpose) Flour', quantity, unit);
    };

    public static readonly archerFlour = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Archer Flour', quantity, unit);
    };

    public static readonly buckwheatFlour = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Buckwheat Flour', quantity, unit);
    };

    public static readonly whiteRice = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('White Rice', quantity, unit, {
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
    };

    public static readonly arborioRice = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Arborio Rice', quantity, unit, {
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
    };

    public static readonly brownRice = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Brown Rice', quantity, unit, {
            nutrition: {
                [u.cup.name]: {
                    calories: 678.96,
                    sodium: 9.3,
                },
            },
        });
    };

    public static readonly sweetPotatoes = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Sweet Potatoes', quantity, unit, {
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
        });
    };

    public static readonly wildBasmatiRice = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Wild Basmati Rice', quantity, unit, {
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
        });
    };

    public static readonly softTortillaShell = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Soft Tortilla Shell', quantity, unit, {
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
    };

    public static readonly basmatiRice = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Basmati Rice', quantity, unit, {
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
        });
    };

    public static readonly pomegranateJuice = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Pomegranate Juice', quantity, unit, {
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
    };

    public static readonly walnut = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Walnut', quantity, unit, {
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
    };

    public static readonly brazilNut = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Brazil Nut', quantity, unit, {
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
        });
    };

    public static readonly flaxSeed = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Flax seed', quantity, unit, {
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
    };

    public static readonly flaxSeedCereal = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Flax seed cereal', quantity, unit, {
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
        });
    };

    public static readonly hotdogBunPotato = (quantity?: number, unit?: IUnitObj) => {
        return CarbItems.makeCarbItem('Hotdog Bun', quantity, unit, {
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            nutrition: {
                [u.unit.name]: {
                    calories: 150,
                    sodium: 280,
                },
            },
        });
    };
}
