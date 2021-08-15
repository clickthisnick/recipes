import { IItem, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class AnimalItems {

    // This is used in recipes i.ingredient('yeast mixture') - when you want an item, but there's not a specific one defined that fits
    public static readonly ingredient = (name: string, quantity: number = 0, unit: any = null, purchaseLinks: any = {}) => (
        new Ingredient(
            name,
            10,
            10,
            '',
            quantity,
            false,
            false,
            false,
            {},
            unit,
            purchaseLinks
        )
    )

    public static readonly chickenDrumsticks = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Chicken Drumsticks', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly chickenBreast = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Chicken Breast', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly chickenThigh = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Chicken Thigh', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly chickenStock: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Chicken Stock',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly pepperedSalami: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Peppered Salami',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly salmon: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Salmon',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly homemadeItalianSausage: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Homemade Italian Sausage',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly italianSausage = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Italian Sausage', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
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
            }, // purchase links
        )
    )

    public static readonly mozzarellaCheese = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Mozzarella Cheese', // name
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
            }, // purchase links
        )
    )

    public static readonly ricottaCheese = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Ricotta Cheese', // name
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
            }, // purchase links
        )
    )

    public static readonly plainYogurt: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Plain Yogurt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly parmesanCheese = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Parmesan Cheese', // name
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
            }, // purchase links
        )
    )

    public static readonly cheddarCheese = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Cheddar Cheese', // name
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
            }, // purchase links
        )
    )

    public static readonly pepperJackCheese: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pepper Jack Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put monterey jack cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly montereyJackCheese: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Monterey Jack Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put monterey jack cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly porkRoast: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pork Roast',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly porkChops = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Pork Chops', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {}, // purchase links
            7, // perishableLimit
        )
    )

    public static readonly bonelessRibClubSteak: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Boneless Rib Club Steak',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly egg = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Egg', // name
            10, // putAwayTime
            10, // takeOutTime
            'Put eggs back in refridgerator',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {}, // nutrition
            unit, // unit
            {
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
            }, // purchase links
            14, // Perishable Limit
        )
    )

    public static readonly eggWhite: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Egg White',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put egg whites back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly ham: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Ham',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put ham back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly honey: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Honey',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly butter = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Butter', // name
            10, // putAwayTime
            10, // takeOutTime
            'Put butter back on right of sink',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {

            }, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
        )
    )

    public static readonly eggPasta: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Egg Pasta',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })
}
