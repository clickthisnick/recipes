import { IItem, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { AnimalItems } from './animal';
import { Stores } from '../../class/stores';

export class CarbItems extends AnimalItems {

    public static readonly raoPastaElbow: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Rao Pasta Elbow',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly lentilSpaghetti = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Lentil Spaghetti', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
        )
    )

    public static readonly penneLentil: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Lentil Penne',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
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
    })

    public static readonly pretzelChips = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Pretzel Chips', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
            }, // purchaseLinks
        )
    )

    public static readonly whiteWine = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'White Wine', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
            }, // purchaseLinks
            // perishableLimit
        )
    )

    public static readonly mapleSyrup = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Maple Syrup', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
            }, // purchaseLinks
            // perishableLimit
        )
    )

    public static readonly wholeWheatBread = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'White Bread', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
            10, // perishableLimit
        )
    )

    public static readonly whiteBread = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'White Bread', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
            10, // perishableLimit
        )
    )

    public static readonly spaghettiLentil: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Lentil Spaghetti',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.ounce.name]: {
                calories: 100
            }
        }
    })

    public static readonly ziti = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Ziti', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
        )
    )

    public static readonly spaghettiWholeGrain: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Whole Grain Spaghetti',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.ounce.name]: {
                calories: 100,
                sodium: 0
            }
        }
    })

    public static readonly quinoa: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Quinoa',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly seaweed: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Seaweed',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly sushiRice: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Sushi Rice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.cup.name]: {
                servings: 10,
                serving_size: .25,
                calories: 160,
                sodium: 10,
                protein: 3,
            }
        }
    })

    public static readonly fudgeStripedCookie: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Fudge Stripped Cookie',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly miniaturePeanutButterCups: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Miniature Peanut Butter Cups',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly orangeFrosting: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Orange Frosting',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly oatMilk = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Oat Milk', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
        )
    )

    public static readonly wholeWheatFlour = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Whole Wheat Flour', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
        )
    )

    public static readonly allPurposeFlour: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Flour (All Purpose) Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly archerFlour: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Archer Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly buckwheatFlour: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Buckwheat Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly whiteRice = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'White Rice', // name
            10, // putAwayTime
            10, // takeOutTime
            'Rinse and put away measuring cup',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
        )
    )

    public static readonly arborioRice = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Arborio Rice', // name
            10, // putAwayTime
            10, // takeOutTime
            'Rinse and put away measuring cup',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
        )
    )

    public static readonly brownRice: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Brown Rice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.cup.name]: {
                calories: 678.96,
                sodium: 9.3,
            }
        }
    })

    public static readonly frozenChickenWings: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Frozen Chicken Wings',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly sweetPotatoes = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Sweet Potatoes', // name
            10, // putAwayTime
            10, // takeOutTime
            'Peel',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
            }, // purchaseLinks
        )
    )

    public static readonly wildBasmatiRice: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Wild Basmati Rice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly softTortillaShell = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Soft Tortilla Shell', // name
            10, // putAwayTime
            10, // takeOutTime
            'Rinse and put away measuring cup',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
        )
    )

    public static readonly basmatiRice = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Basmati Rice', // name
            10, // putAwayTime
            10, // takeOutTime
            'Rinse and put away measuring cup',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
            }, // purchaseLinks
        )
    )

    public static readonly flaxSeedCereal: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Flax seed cereal',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly hotdogBunPotato: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Hotdog Bun',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {
            [u.unit.name]: {
                calories: 150,
                sodium: 280,
            }
        },
    })
}
