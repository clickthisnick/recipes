import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { AnimalItems } from './animal';
import { Stores } from '../../class/stores';

export class CarbItems extends AnimalItems {

    public static readonly ricottaCheese = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Ricotta Cheese',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly raoPastaElbow = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Rao Pasta Elbow',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly lentilSpaghetti = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Lentil Spaghetti',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'organic': [
                        {
                            price: 3.49,
                            quantity: 8.8,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/35264/wegmans-organic-gluten-free-red-lentil-spaghetti',
                            organic: true
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 2.99,
                            quantity: 8,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Whole-Foods-Market-Organic-Spaghetti/dp/B07FX14M71',
                            organic: true
                        }
                    ]
                },
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly penneLentil = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Lentil Penne',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {
                [u.ounce.name]: {
                    servings: 2.5,
                    serving_size: 3,
                    calories: 300,
                    sodium: 0,
                    protein: 21,
                    sugar: 2,
                    fiber: 9,
                    total_cost: 2.99
                }
            }
        }
        return new Ingredient(item)
    }

    public static readonly pretzelChips = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Pretzel Chips',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly whiteWine = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'White Wine',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly mapleSyrup = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Maple Syrup',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly wholeWheatBread = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'White Bread',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 4.59,
                            quantity: 40,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/30552/wegmans-soft-100-whole-wheat-bread-price-good-for-only-2-or-more',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 3.99,
                            quantity: 22,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Whole-Foods-Market-Sandwich/dp/B082N5Y5B2/ref=sr_1_2_0o_wf',
                            organic: false
                        }
                    ]
                },
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly whiteBread = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'White Bread',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 1.19,
                            quantity: 22,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/1841/wegmans-giant-bread',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 2.99,
                            quantity: 24,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Sandwich-slices/dp/B074H67KW3/ref=sr_1_2_0o_wf',
                            organic: false
                        }
                    ]
                },
            },
            perishableLimit: 10,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly spaghettiLentil = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Lentil Spaghetti',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {
                [u.ounce.name]: {
                    calories: 100
                }
            }
        }
        return new Ingredient(item)
    }

    public static readonly ziti = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Ziti',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 0.89,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/221279/wegmans-pasta-ziti',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 1.99,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Whole-Foods-Market-Organic-Ziti/dp/B074H64QCF/ref=sr_1_1_0o_wf',
                            organic: true
                        }
                    ]
                },
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly spaghettiWholeGrain = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Whole Grain Spaghetti',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {
                [u.ounce.name]: {
                    calories: 100,
                    sodium: 0
                }
            }
        }
        return new Ingredient(item)
    }

    public static readonly quinoa = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Quinoa',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly seaweed = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Seaweed',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly sushiRice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Sushi Rice',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {
                [u.cup.name]: {
                    servings: 10,
                    serving_size: .25,
                    calories: 160,
                    sodium: 10,
                    protein: 3,
                }
            }
        }
        return new Ingredient(item)
    }

    public static readonly fudgeStripedCookie = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Fudge Stripped Cookie',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly miniaturePeanutButterCups = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Miniature Peanut Butter Cups',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly quinoaBurger = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Quinoa Burger',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks:            {
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 4.99,
                            quantity: 4,
                            quantity_unit: u.unit,
                            link: 'https://www.amazon.com/365-Whole-Foods-Market-Mushroom/dp/B0CJJZ9VPF',
                            organic: true,
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {
                [u.unit.name]: {                    
                    calories: 140,
                    sodium: 330,
                    protein: 7,
                    fiber: 4,
                    sugar: 0.99,
                }
            }
        }
        return new Ingredient(item)
    }

    public static readonly orangeFrosting = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Orange Frosting',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly oatMilk = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Oat Milk',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 4.39,
                            quantity: 64,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/227051/wegmans-milk-oat',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'oatly': [
                        {
                            price: 4.99,
                            quantity: 64,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/Oatly-Milk-Oat-Full-Fat/dp/B07SX36KZZ/ref=sr_1_12_0o_wf',
                            organic: false
                        }
                    ],
                    '365': [
                        {
                            price: 3.99,
                            quantity: 64,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Beverage-Original/dp/B07SY3YFC1/ref=sr_1_5_0o_wf',
                            organic: false
                        }
                    ],
                },
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly wholeWheatFlour = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Whole Wheat Flour',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 3.49,
                            quantity: 5,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/54401/wegmans-whole-wheat-flour',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 5.39,
                            quantity: 5,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/King-Arthur-Whole-Traditional-Flour/dp/B0007MKWXQ/ref=sr_1_1_0o_wf',
                            organic: false
                        }
                    ]
                },
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly allPurposeFlour = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Flour (All Purpose) Flour',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly archerFlour = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Archer Flour',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly buckwheatFlour = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Buckwheat Flour',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly whiteRice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'White Rice',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 5.79,
                            quantity: 10,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/4815/wegmans-enriched-long-grain-white-rice',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 3.99,
                            quantity: 32,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B084NJHWTQ',
                            organic: true
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly arborioRice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Arborio Rice',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'organic': [
                        {
                            price: 5.79,
                            quantity: 32,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/59630/wegmans-organic-arborio-rice',
                            organic: true
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 2.99,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Whole-Foods-Market-Arborio/dp/B084NJ55YB/ref=sr_1_1_0o_wf',
                            organic: false
                        }
                    ]
                },
                [Stores.amazon]: {
                    'organic': [
                        {
                            price: 23.99,
                            quantity: 11,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/gp/product/B081S4MXB5/ref=ppx_yo_dt_b_asin_title_o00_s00?ie=UTF8&psc=1',
                            organic: false
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly brownRice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Brown Rice',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {
                [u.cup.name]: {
                    calories: 678.96,
                    sodium: 9.3,
                }
            }
        }
        return new Ingredient(item)
    }

    public static readonly sweetPotatoes = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Sweet Potatoes',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly wildBasmatiRice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Wild Basmati Rice',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly softTortillaShell = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Soft Tortilla Shell',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks:             {
                [Stores.wegmans]: {
                    'Wegmans Fajita Tortilla Gordita Style, FAMILY PACK': [
                        {
                            price: 2.99,
                            quantity: 30.5,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/25809/wegmans-fajita-tortilla-gordita-style-family-pack',
                            organic: false
                        }
                    ],
                    'Wegmans Fajita Tortillas, Gordita Style': [
                        {
                            price: 1.89,
                            quantity: 15,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/20492/wegmans-fajita-tortillas-gordita-style',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    '365 Everyday Value, Organic Flour Tortillas': [
                        {
                            price: 2.29,
                            quantity: 12,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Maria-Ricardos-Tortilla-Wheat-Flour/dp/B01BPHD06M/ref=sr_1_3_0o_wf',
                            organic: true
                        }
                    ],
                    'Maria & Ricardos Tortilla 8In Wheat Flour': [
                        {
                            price: 3.79,
                            quantity: 13.5,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Maria-Ricardos-Tortilla-Wheat-Flour/dp/B01BPHD06M/ref=sr_1_3_0o_wf',
                            organic: false
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly basmatiRice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Basmati Rice',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly pomegranateJuice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Pomegranate Juice',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks:             {
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 15.49,
                            quantity: 32,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/Lakewood-Organic-Pomegranate-Juice-32oz/dp/B000RELFGC',
                            organic: true,
                        },

                    ]
                },
                [Stores.amazon]: {
                    'organic': [
                        {
                            price: 52.99,
                            quantity: 202.8,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/gp/product/B01M8I4G2L/',
                            organic: true,
                        },
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly walnut = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Walnut',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks:             {
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 7.99,
                            quantity: 10,
                            quantity_unit: u.ounce,
                            link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-walnut-halves-pieces-10-oz-b07glt4z49',
                            organic: true,
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly brazilNut = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Brazil Nut',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly flaxSeed = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Flax seed',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 5.49,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-brown-whole-flaxseed-16-oz-b07myfzr8z',
                            organic: true,
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly flaxSeedCereal = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Flax seed cereal',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly hotdogBunPotato = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Hotdog Bun',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put measuring cup in dishwasher',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {
                [u.unit.name]: {
                    calories: 150,
                    sodium: 280,
                }
            },
        }
        return new Ingredient(item)
    }
}
