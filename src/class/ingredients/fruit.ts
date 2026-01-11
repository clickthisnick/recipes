import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { CarbItems } from './carb';
import { Stores } from '../../class/stores';

export class FruitItems extends CarbItems {

    public static readonly apple = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Apple',
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

    public static readonly cocoaFlavanols = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Cocoa Flavanols',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }


    public static readonly creatine = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Creatine',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly chlorellaPowder = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Chlorella Powder',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly aminoComplex = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Amino Complex',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly acaiFrozenMix = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Acai Frozen Mix',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly strawberry = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Strawberry',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 6.69,
                            quantity: 32,
                            quantity_unit: u.ounce,
                            link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-365-whole-foods-market-organic-whole-strawberries-b09gcp3jng',
                            organic: true,
                        },
                        {
                            price: 6.69,
                            quantity: 32,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-WFM-Organic-Whole-Strawberries/dp/B09GCP3JNG',
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

    public static readonly banana = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'banana',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly frozenStrawberry = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Frozen Strawberry',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly frozenCauliflower = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Frozen Cauliflower',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly frozenBroccoli = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Frozen Broccoli',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly frozenBlueberry = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Frozen Blueberry',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly cherry = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Cherry',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly blueprintBlueberryWalnut = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Blueprint Blueberry Walnut',
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

    public static readonly blueprintCacao = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Blueprint Cacao',
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

    public static readonly blueprintNuttyPudding = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Blueprint Nutty Pudding',
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

    // https://www.amazon.com/365-Whole-Foods-Market-Macadamia/dp/B086HK83YF/
    public static readonly macadamiaNut = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Macadamia Nut',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 10.79,
                            quantity: 8,
                            quantity_unit: u.ounce,
                            link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-macadamia-nuts-8-oz-b086hk83yf',
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

    public static readonly wheatGrassPowder = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'What Grass Powder',
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

    public static readonly hempSeed = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Hemp Seed',
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

    public static readonly chiaSeed = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Chia Seed',
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

    public static readonly collagenPowder = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Collagen Powder',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly pittedDates = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Pitted Dates',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly peanutButter = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Peanut Butter',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            perishableLimit: 0,
            purchaseLinks: {
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
            },
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly cashewButter = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Cashew Butter',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly orangeJuice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Orange Juice',
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
                [u.fluid_ounce.name]: {
                    servings: 8,
                    serving_size: 7,
                    calories: 110,
                    sodium: 0,
                    sugar: 22,
                    protein: 2,
                }
            },
        }
        return new Ingredient(item)
    }

    public static readonly frozenBerries = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Frozen Berries',
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
}
