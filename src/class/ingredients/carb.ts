import { IItem, Item } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { AnimalItems } from './animal';
import { Stores } from '../../class/stores';

export class CarbItems extends AnimalItems {

    public static readonly raoPastaElbow: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly lentilSpaghetti = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'organic': ['https://shop.wegmans.com/product/35264/wegmans-organic-gluten-free-red-lentil-spaghetti'],
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        'https://www.amazon.com/Whole-Foods-Market-Organic-Spaghetti/dp/B07FX14M71',
                    ]
                }
            }, // purchaseLinks
        )
    )

    public static readonly penneLentil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly pretzelChips = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.amazonFresh]: {
                    'conventional': [
                        'https://www.amazon.com/Snack-Factory-Pretzel-Crisps-Everything/dp/B013OUXDM4',
                        'https://www.amazon.com/Snack-Factory-Pretzel-Crisps-Original/dp/B01M63ZHKX',
                    ],
                }
            }, // purchaseLinks
        )
    )

    public static readonly whiteWine = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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

    public static readonly mapleSyrup = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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

    public static readonly wholeWheatBread = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional': ['https://shop.wegmans.com/product/30552/wegmans-soft-100-whole-wheat-bread-price-good-for-only-2-or-more',]
                }                    
            }, // purchaseLinks
            10, // perishableLimit
        )
    )

    public static readonly whiteBread = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional': ['https://shop.wegmans.com/product/1841/wegmans-giant-bread']
                }
            }, // purchaseLinks
            10, // perishableLimit
        )
    )

    public static readonly spaghettiLentil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly ziti = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional': ['https://shop.wegmans.com/product/221279/wegmans-pasta-ziti'],
                }
            }, // purchaseLinks
        )
    )

    public static readonly spaghettiWholeGrain: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly quinoa: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly seaweed: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly sushiRice: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly fudgeStripedCookie: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly miniaturePeanutButterCups: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly orangeFrosting: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly oatMilk = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wholeFoods]: {
                    'oatly': ['https://www.amazon.com/Oatly-Milk-Oat-Full-Fat/dp/B07SX36KZZ/ref=sr_1_12_0o_wf'],
                }
            }, // purchaseLinks
        )
    )

    public static readonly wholeWheatFlour = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional': ['https://shop.wegmans.com/product/54401/wegmans-whole-wheat-flour']
                },
                [Stores.wholeFoods]: {
                    'organic': ['https://www.amazon.com/365-Everyday-Value-Organic-Pastry/dp/B074VD2ZKF'],
                }
            }, // purchaseLinks
        )
    )

    public static readonly allPurposeFlour: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly archerFlour: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly buckwheatFlour: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly whiteRice = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'White Rice', // name
            10, // putAwayTime
            10, // takeOutTime
            'Rinse and put away measuring cup',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
                [u.cup.name]: {
                    calories: 678.96,
                    sodium: 9.3,
                }
            }, // nutrition
            unit, // unit
            {
                [Stores.wholeFoods]: {
                    'organic': ['https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B084NJHWTQ']
                }
            }, // purchaseLinks
        )
    )

    public static readonly arborioRice = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
            }, // purchaseLinks
        )
    )

    public static readonly brownRice: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly frozenChickenWings: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly wildBasmatiRice: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly softTortillaShell = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wholeFoods]: {
                    'conventional': ['https://shop.wegmans.com/product/25809/wegmans-fajita-tortilla-gordita-style-family-pack']
                }
            }, // purchaseLinks
        )
    )

    public static readonly flaxSeedCereal: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly hotdogBunPotato: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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
