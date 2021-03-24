import { IItem, Item } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { Stores } from '../../class/stores';

export class AnimalItems {

    // This is used in recipes i.item('yeast mixture') - when you want an item, but there's not a specific one defined that fits
    public static readonly item = (name: string, quantity: number = 0, unit: any = null, purchaseLinks: any = {}) => (
        new Item(
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

    public static readonly chickenDrumsticks = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional': ['https://shop.wegmans.com/product/54787/wegmans-chicken-drumsticks-family-pack']
                },           
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly chickenBreast = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional': ['https://shop.wegmans.com/product/2584/wegmans-boneless-skinless-chicken-breasts-with-rib-meat-family-pack']
                },
                [Stores.wholeFoods]: {
                    'conventional': ['https://www.amazon.com/365-Everyday-Value-Boneless-Skinless/dp/B0787Y555X/ref=sxin_9_wf_dsk_ap_sira_0o_wf',]
                }                    
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly chickenThigh = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wegmans]: {
                    'conventional': ['https://shop.wegmans.com/product/11169/wegmans-boneless-skinless-highly-trimmed-chicken-thigh-cutlets-family-pack']
                },
                [Stores.wholeFoods]: {
                    'conventional': [
                        'https://www.amazon.com/365-Everyday-Value-Boneless-Skinless-Pre-Packaged/dp/B07813VZHR',
                        'https://www.amazon.com/Bell-Evans-Chicken-Boneless-Skinless/dp/B07881BQT9'
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

    public static readonly italianSausage = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Italian Sausage', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {
                calories: {
                    [u.ounce.name]: 92.13625,
                    [u.pound.name]: 1474.18,
                },
                sodium: {},
            }, // nutrition
            unit, // unit
            {
                [Stores.wegmans]: {
                    'conventional': ['https://shop.wegmans.com/product/12224/wegmans-italian-classics-hot-italian-sausage-family-pack']
                }
            }, // purchase links
        )
    )

    public static readonly mozzarellaCheese = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wegmans]: {
                    'conventional': ['https://shop.wegmans.com/product/5146/wegmans-cheese-mozzarella-part-skim-low-moisture-shredded-family-pack']
                }
            }, // purchase links
        )
    )

    public static readonly ricottaCheese = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wegmans]: {
                    'conventional': ['https://shop.wegmans.com/product/46314/wegmans-whole-milk-ricotta-cheese']
                }
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

    public static readonly parmesanCheese = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wholeFoods]: {
                    'conventional': ['https://www.amazon.com/365-Everyday-Value-Shredded-Parmesan/dp/B074H51Q58']
                }
            }, // purchase links
        )
    )

    public static readonly cheddarCheese = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional': ['https://shop.wegmans.com/product/5204/wegmans-cheese-cheddar-mild-shredded-family-pack']
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

    public static readonly porkChops = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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

    public static readonly egg = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'three dozen': ['https://shop.wegmans.com/product/53608/wegmans-three-dozen-large-eggs-family-pack'],
                },
                [Stores.wholeFoods]: {
                    'organic': ['https://shop.wegmans.com/product/53608/wegmans-three-dozen-large-eggs-family-pack'],
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

    public static readonly butter = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'unsalted': ['https://shop.wegmans.com/product/50048/wegmans-butter-unsalted-sweet-cream']
                },
                [Stores.wholeFoods]: {
                    'unsalted': ['https://www.amazon.com/365-Everyday-Value-Unsalted-Butter/dp/B074VDJ7KZ']
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
