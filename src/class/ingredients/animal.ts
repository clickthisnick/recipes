import { IStorePurchaseLink, IItemObj, IMeatObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class AnimalItems {
    // This is used in recipes i.ingredient('yeast mixture') - when you want an item, but there's not a specific one defined that fits
    public static readonly ingredient = (name: string, quantity = 0, unit: IUnitObj = Units.none, purchaseLinks: IStorePurchaseLink = {}) => {
        const item: IItemObj = {
            name: name,
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: purchaseLinks,
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly chickenDrumsticks = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Chicken Drumsticks',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'organic': [
                        {
                            price: 1.19,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/54787/wegmans-chicken-drumsticks-family-pack',
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

    public static readonly chickenBreast = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Chicken Breast',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks:             {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 2.29,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/2584/wegmans-boneless-skinless-chicken-breasts-with-rib-meat-family-pack',
                            organic: false,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 3.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/365-Everyday-Value-Boneless-Skinless/dp/B0787Y555X/ref=sr_1_4_0o_wf',
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

    public static readonly chickenThigh = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Chicken Thigh',
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
                    'conventional': [
                        {
                            price: 4.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/365-Everyday-Value-Boneless-Skinless/dp/B0787WHRNP',
                            organic: false
                        }
                    ]
                }
            },
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly chickenLiver = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Chicken Liver',
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

    public static readonly chickenHeart = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Chicken Heart',
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

    public static readonly chickenStock = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Chicken Stock',
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

    public static readonly halfAndHalf = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Half and Half',
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

    public static readonly collagenPeptides = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Collagen Peptides',
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

    public static readonly pepperedSalami = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Peppered Salami',
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

    public static readonly salmon = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Salmon',
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

    public static readonly frozenChickenWings = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Frozen Chicken Wings',
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

    public static readonly homemadeItalianSausage = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Homemade Italian Sausage',
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

    public static readonly sausage = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Sausage',
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

    public static readonly mayonaise = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Mayonaise',
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

    public static readonly italianSausage = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Italian Sausage',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks:             {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 4.49,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/12224/wegmans-italian-classics-hot-italian-sausage-family-pack',
                            organic: false,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 5.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Sausage-Pork-Bulk-Italian-Mild/dp/B0787Z4BLG/ref=sr_1_3_0o_wf',
                            organic: false,
                        }
                    ]
                },
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly mozzarellaCheese = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Mozzarella Cheese',
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
                            price: 6.49,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/365-Everyday-Value-Mozzarella-Shred/dp/B074H5SS4J/ref=sr_1_3_0o_wf',
                            organic: false,
                        }
                    ]
                },
                [Stores.wegmans]: {
                    'organic': [
                        {
                            price: 14.99,
                            quantity: 80,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/5146/wegmans-cheese-mozzarella-part-skim-low-moisture-shredded-family-pack',
                            organic: false,
                        }
                    ]
                },
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly ricottaCheese = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Ricotta Cheese',
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

    public static readonly plainYogurt = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Plain Yogurt',
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

    public static readonly parmesanCheese = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Parmesan Cheese',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'shredded': [
                        {
                            price: 2.79,
                            quantity: 6,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/17248/wegmans-fancy-shredded-parmesan-cheese',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'shredded': [
                        {
                            price: 3.99,
                            quantity: 5,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Shredded-Parmesan/dp/B074H51Q58',
                            organic: false
                        },
                        {
                            price: 7.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Milano-Parmesan-Shred-Big-Pack/dp/B07D6V3DZ8/ref=sr_1_7_0o_wf',
                            organic: false
                        }
                    ],
                    'grated': [
                        {
                            price: 3.99,
                            quantity: 5,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Grated-Parmesan/dp/B074H5SRZX',
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

    public static readonly cheddarCheese = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Cheddar Cheese',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 16.09,
                            quantity: 80,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/5204/wegmans-cheese-cheddar-mild-shredded-family-pack',
                            organic: false,
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly pepperJackCheese = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Pepper Jack Cheese',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put pepper jack cheese back in refrigerator',
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

    public static readonly montereyJackCheese = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Monterey Jack Cheese',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put monterey cheese back in refrigerator',
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

    public static readonly porkRoast = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Pork Roast',
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

    public static readonly porkChops = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Pork Chops',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly bonelessRibClubSteak = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Boneless Rib Club Steak',
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

    public static readonly egg = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Egg',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put eggs back in refrigerator',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'conventional - 3 dozed': [
                        {
                            price: 5.79,
                            quantity: 36,
                            quantity_unit: u.unit,
                            link: 'https://shop.wegmans.com/product/53608/wegmans-three-dozen-large-eggs-family-pack',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 2.99,
                            quantity: 12,
                            quantity_unit: u.unit,
                            link: 'https://www.amazon.com/365-Everyday-Value-Brown-Non-Gmo/dp/B07PFDYT9T/ref=sr_1_6_0o_wf',
                            organic: false
                        }
                    ]
                }
            },
            perishableLimit: 14,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly eggyolk = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Egg Yolk',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put egg yolks back in refrigerator',
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

    public static readonly eggWhite = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Egg White',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put egg whites back in refrigerator',
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

    public static readonly ham = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Ham',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put ham back in refrigerator',
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

    public static readonly honey = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Honey',
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

    public static readonly butter = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Butter',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put butter back on right of sink',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'Wegmans Butter, Unsalted, Sweet Cream': [
                        {
                            price: 3.69,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/50048/wegmans-butter-unsalted-sweet-cream',
                            organic: false
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 3.99,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Unsalted-Butter/dp/B074VDJ7KZ/ref=sr_1_2_0o_wf',
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

    public static readonly bacon = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Bacon',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put package back in refrigerator',
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

    public static readonly eggPasta = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Egg Pasta',
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
}
