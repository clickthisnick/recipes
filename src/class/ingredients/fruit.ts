import { IItem, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { CarbItems } from './carb';
import { Stores } from '../../class/stores';

export class FruitItems extends CarbItems {
    public static readonly apple: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Apple',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly collagenPowder = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Collagen Powder', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
                [Stores.amazon]: {
                    'Anthony\'s Collagen Peptide Powder, 1 lb, Pure Hydrolyzed, Gluten Free, Keto and Paleo Friendly, Grass Fed': [
                        {
                            price: 17.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/gp/product/B071S8D69C/ref=ppx_yo_dt_b_asin_title_o00_s00',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 5
                            }
                        }
                    ]
                },
            }, // purchase links
        )
    )

    public static readonly pittedDates = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Pitted Dates', // name
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
                [Stores.wholeFoods]: {
                    '365 by Whole Foods Market, Dried Fruit, Pitted Dates': [
                        {
                            price: 3.99,
                            quantity: 8,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Dates-Pitted/dp/B074VDMNH7/ref=sr_1_5_0o_wf',
                            organic: false,
                        }
                    ]
                },
                [Stores.amazon]: {
                    'ORGANIC Pitted Dates (Deglet Nour) - Sunny Fruit 40oz Bulk Bag (2.5 lbs)': [
                        {
                            price: 16.59,
                            quantity: 2.5,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/ORGANIC-Pitted-Dates-Deglet-Nour/dp/B0872L82ZK/ref=sr_1_10',
                            organic: true,
                            discount: {
                                'Subscribe 5 Products': 5,
                            }
                        }
                    ],
                    '5 Pounds Of Dates Pitted (80oz) No Added Sugar, Non GMO, Kosher Certified,Healthy Snack for Kids & Adults': [
                        {
                            price: 24.89,
                            quantity: 5,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/5-Pounds-Dates-Pitted-5lb/dp/B0727V394G/ref=sr_1_9',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 10,
                                'Subscribe': 5
                            }
                        }
                    ],
                    'Mariani Pitted Dates - 40oz (Pack of 1) – Exceptional Taste and Soft Texture, No Sugar Added, Good Source of Dietary Fiber, Gluten Free, Vegan, Fat Free, Cholesterol Free, NonGMO, Resealable Bag': [
                        {
                            price: 14.08,
                            quantity: 2.5,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Mariani-Pitted-Dates-Natural-40-Ounce/dp/B0027YZBJC/ref=sxin_9',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 5,
                            }
                        }
                    ]
                },
            }, // purchase links
        )
    )

    public static readonly peanutButter = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Peanut Butter', // name
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
                [Stores.wholeFoods]: {
                    '365 by Whole Foods Market, Organic Peanut Butter, Creamy': [
                        {
                            price: 4.19,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Unsweetened/dp/B074H61LYV/ref=sr_1_9_0o_wf',
                            organic: true,
                        }
                    ],
                    '365 by Whole Foods Market, Peanut Butter, Creamy': [
                        {
                            price: 2.49,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Peanut-Butter/dp/B074H57SPT/ref=sr_1_7_0o_wf',
                            organic: false,
                        }
                    ],
                    '365 by Whole Foods Market, Peanut Butter, Crunchy': [
                        {
                            price: 4.99,
                            quantity: 36,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Everyday-Value-Peanut-Butter-Crunchy/dp/B074Y2V88X/ref=sr_1_16_0o_wf',
                            organic: false,
                        }
                    ],
                },
                [Stores.amazon]: {
                    'Happy Belly Creamy Peanut Butter': [
                        {
                            price: 4.69,
                            quantity: 40,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/dp/B07KWGSCW2/ref=sns_myd_detail_page',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 5
                            }
                        }
                    ],
                },
                [Stores.amazonFresh]: {
                    ' Amazon Brand - Happy Belly Creamy Peanut Butter': [
                        {
                            price: 3.99,
                            quantity: 40,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Amazon-Brand-Creamy-Peanut-Butter/dp/B07KWGSCW2',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 5
                            }
                        }
                    ],
                },
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly cashewButter = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Cashew Butter', // name
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
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 8.99,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Cashew-Butter/dp/B074H6R4YF/ref=sr_1_5_0o_wf_mod_primary_alm',
                            organic: false,
                        }
                    ]
                },
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly orangeJuice: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Orange Juice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.fluid_ounce.name]: {
                servings: 8,
                serving_size: 7,
                calories: 110,
                sodium: 0,
                sugar: 22,
                protein: 2,
            }
        },
        link: 'https://www.amazon.com/gp/product/B074H6QW3S/ref=afx_dp_ingress?ie=UTF8&almBrandId=VUZHIFdob2xlIEZvb2Rz&fpw=alm'
    })

    public static readonly frozenBerries: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Frozen Berries',
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
}
