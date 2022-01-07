import { Stores } from '../../class/stores';
import { IItem, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { SauceItems } from './sauce';

export class SpiceItems extends SauceItems {

    public static readonly oldBay: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Old Bay Seasoning',
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

    public static readonly tandoriMasalla: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Tandori Masalla',
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

    public static readonly paprika: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Paprika',
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

    public static readonly vanillaExtract: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Vanilla Extract',
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

    public static readonly hotPaprika: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Hot Paprika',
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

    public static readonly coconutSugar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Coconut Sugar',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly sugar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Sugar',
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

    public static readonly cumin: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Cumin',
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

    public static readonly turmeric: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Turmeric',
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

    public static readonly thyme = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Dried Thyme', // name
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
                [Stores.amazon]: {
                    'Thyme': [
                        {
                            price: 13.14,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Frontier-Thyme-Extract-Fancy-Grade/dp/B00016XJVK',
                            organic: true,
                            discount: {
                                'Subscribe 5 Products': 15,
                                'Subscribe': 5,
                            }
                        }
                    ],
                }
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly mintLeaf = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Mint Leaf', // name
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
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly gingerPowder = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Ginger Powder', // name
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
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly saffron = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Saffron', // name
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
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly monkFruit: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Monk Fruit',
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

    public static readonly smokedPaprika: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Smoked Paprika',
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

    public static readonly worcestershireSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Worcestershire Sauce',
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

    public static readonly gramMasala: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Gram Masala',
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

    public static readonly salt: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            
        },
    })

    public static readonly seaSalt: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Sea Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            
        },
    })

    public static readonly pepperFlake: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pepper Flake',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pepper flake back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly lawlrySaltFree: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'lawlry salk free seasoning',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly dash: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'dash seasoning',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly cacaoPowderUnsweetened = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'unsweetened cacao powder', // name
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
                [Stores.amazon]: {
                    'Anthony\'s Organic Raw Cocoa Powder, Cacao Powder 5lb': [
                        {
                            price: 29.99,
                            quantity: 5,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Organic-Anthonys-Verified-Gluten-Free-Non-GMO/dp/B00F7SU63G',
                            organic: true,
                        },
                    ],
                    'Anthony\'s Organic Raw Cocoa Powder, Cacao Powder 2lb': [
                        {
                            price: 14.85,
                            quantity: 2,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Organic-Anthonys-Verified-Gluten-Free-Non-GMO/dp/B0833QH1N4?th=1',
                            organic: true,
                            discount: {
                                'Subscribe 5 Products': 5,
                            }
                        }
                    ],
                    'BetterBody Foods Organic Cacao Powder, Non-GMO, Gluten-Free Superfood': [
                        {
                            price: 8.49,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/LIVfit-Superfood-Guilt-Free-Substitute-BetterBody/dp/B01IPZUZW4',
                            organic: true,
                            discount: {
                                'Subscribe 5 Products': 15,
                                'Subscribe': 5,
                            }
                        }
                    ]
                },
            }, // purchase links
        )
    )

    public static readonly chilliPowder: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'chilli powder',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly cayennePepper: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'cayenne pepper',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly dhanaJeera = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Dhana Jeera', // name
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
            }, // purchaseLinks
            0, // perishableLimit
        )
    )

    public static readonly bayLeaf = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Bay Leaf', // name
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
            }, // purchaseLinks
            0, // perishableLimit
        )
    )

    public static readonly greenCardamonSeed = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Green Cardamon Seed', // name
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
            }, // purchaseLinks
            0, // perishableLimit
        )
    )

    public static readonly clove = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Clove', // name
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
            }, // purchaseLinks
            0, // perishableLimit
        )
    )

    public static readonly wholeBlackPepper = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Whole Black Pepper', // name
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
            }, // purchaseLinks
            0, // perishableLimit
        )
    )

    public static readonly blackPepper = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Black Pepper', // name
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
                [Stores.amazon]: {
                    'Amazon Brand - Peppercorn': [
                        {
                            price: 7.28,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/dp/B07QW1GH8Q',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 15,
                                'Subscribe': 5,
                            }
                        }
                    ],
                }
            }, // purchaseLinks
            0, // perishableLimit
        )
    )

    public static readonly parsley: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Parsley',
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

    public static readonly curryPowder: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'curry powder',
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

    public static readonly kosherSalt: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'kosher salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put kosher salt back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly cinnamon: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'cinnamon',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put cinnamon back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly wholeFennelSeeds: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Whole Fennel Seeds',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly marjoram: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Marjoram',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly italianSeasoning: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Italian Seasoning',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly powderedSugar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Powdered Sugar',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly garlicPowder = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Garlic Powder', // name
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
                [Stores.amazon]: {
                    'Amazon Brand - Happy Belly Granulated Garlic': [
                        {
                            price: 8.42,
                            quantity: 24,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Amazon-Brand-Granulated-Garlic-Ounces/dp/B07QW1GKR1/ref=sr_1_6',
                            organic: false,
                            discount: {
                                'Subscribe 5 Products': 15,
                                'Subscribe': 5,
                            }
                        }
                    ],
                }
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly onionPowder: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'onion powder',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly garlicGranules: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'garlic granules',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly onionGranules: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'onion granules',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly driedOnion: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Dried Onion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

}
