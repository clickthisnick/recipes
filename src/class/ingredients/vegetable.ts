import { IItem, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { SpiceItems } from './spice';
import { Stores } from '../../class/stores';

export class VegetableItems extends SpiceItems {

    public static readonly vitalWheatGluten: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Vital Wheat Gluten',
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

    public static readonly coffeeGrounds: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Coffee Grounds',
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

    public static readonly bakingPowder: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Baking Powder',
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

    public static readonly whiteVinegar: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'White Vinegar',
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

    public static readonly frozenStirFryVeggies: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Frozen Stirfry Veggies',
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

    public static readonly almondFlour: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Almond Flour',
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

    public static readonly pankoBreadCrumbs: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Panko Bread Crumbs',
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

    public static readonly beyondBurger: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Beyond Burger',
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

    public static readonly briocheHamburgerBun: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Brioche Hamburger Bun',
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

    public static readonly blackLentils: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Black Lentils',
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

    public static readonly lentils: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Lentils',
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

    public static readonly pizzaCrust: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Pizza Crust',
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

    public static readonly popcorn: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Popcorn',
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

    public static readonly carrots = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Carrots', // name
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

    public static readonly celery = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Celery', // name
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
            5, // perishableLimit
        )
    )

    public static readonly frozenTatorTots: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Frozen Tator Tots',
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

    public static readonly hamburgerBun = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Hamburger Bun', // name
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
                    'white': [
                        {
                            price: 1.79,
                            quantity: 8,
                            quantity_unit: u.unit,
                            link: 'https://shop.wegmans.com/product/16394/wegmans-hamburger-rolls-8-pack',
                            organic: false,
                        }
                    ]
                },
            }, // purchase links
        )
    )

    public static readonly almondMilk = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Almond Milk', // name
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
                    'unsweetened': [
                        {
                            price: 4.99,
                            quantity: 96,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/41821/blue-diamond-almond-breeze-almondmilk-unsweetened-original',
                            organic: false,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic unsweetened': [
                        {
                            price: 3.19,
                            quantity: 64,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Almondmilk-Unsweetened/dp/B074H6M4M4/ref=sr_1_21_0o_wf',
                            organic: true,
                        }
                    ]
                }
            }, // purchase links
        )
    )

    public static readonly kale = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Kale', // name
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
                    'organic': [
                        {
                            price: 3.49,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/21168/wegmans-kale-greens-cut',
                            organic: false,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 3.99,
                            quantity: 12,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Chopped/dp/B078J13FYR/',
                            organic: true,
                        }
                    ]
                }
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly cookingSpray: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Cooking Spray',
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

    public static readonly asparagus = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'asparagus', // name
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
                    'conventional': [
                        {
                            price: 3.49,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/produce-aisle-176899-Asparagus-bunch/dp/B078ZG3THS/ref=sr_1_2_0g_wf',
                            organic: false,
                        }
                    ]
                },
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 2.29,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/58808/asparagus',
                            organic: false,
                        }
                    ]
                }
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly brusselSprouts = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Brussel Sprouts', // name
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
            7, // perishableLimit
        )
    )

    public static readonly romaineLettuce = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Romaine Lettuce', // name
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
            7, // perishableLimit
        )
    )

    public static readonly appleSauce = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Apple Sauce', // name
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
                    'conventional': [
                        {
                            price: 2.49,
                            quantity: 24,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Cinnamon/dp/B074H5CNFD',
                            organic: true,
                        }
                    ]
                }
            }, // purchaseLinks
        )
    )

    public static readonly timer: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Timer',
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

    public static readonly water = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Water', // name
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
            }, // purchase links
        )
    )

    public static readonly aminosCoconut: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Aminos Coconut',
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

    public static readonly liquidSmoke: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Liquid Smoke',
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

    public static readonly seasonedRiceVinegar: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Seasoned Rice Vinegar',
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

    public static readonly appleCiderVinegar: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Apple Cider Vinegar',
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

    public static readonly blackBeans = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Black Beans', // name
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
                    'organic': [
                        {
                            price: 1.09,
                            quantity: 15,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Black/dp/B074H6QVKY',
                            organic: true,
                        }
                    ],
                    'conventional': [
                        {
                            price: 0.89,
                            quantity: 15,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Black-Beans/dp/B074H58Y5B/ref=sr_1_5_0g_wf',
                            organic: false,
                        }
                    ]
                }
            }, // purchase links
        )
    )

    public static readonly avocadoLarge = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Large avocado', // name
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
            5, // perishableLimit
        )
    )

    public static readonly avocado: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'avocado',
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

    public static readonly cauliflower: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Cauliflower',
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

    public static readonly leek: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Leek',
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

    public static readonly lime: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Lime',
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

    public static readonly lemonJuice = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Lemon Juice', // name
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

    public static readonly limeJuice = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Lime Juice', // name
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
                            price: 2.29,
                            quantity: 8,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/29839/realime-100-lime-juice-natural-strength',
                            organic: false,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 3.29,
                            quantity: 10,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/29839/realime-100-lime-juice-natural-strength',
                            organic: true,
                        }
                    ]
                }
            }, // purchaseLinks
        )
    )

    public static readonly romaTomato: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Roma Tomato',
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

    public static readonly pickleHotdogSlice: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Pickle',
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

    public static readonly freshGinger = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Fresh Ginger',
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

    public static readonly groundGinger = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Ground Ginger',
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
                [Stores.amazon]: {
                    'organic': [
                        {
                            price: 8.99,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Naturevibe-Botanicals-Zingiber-officinale-verified/dp/B088X6FW6B',
                            organic: true,
                        }
                    ]
                }
            }, // purchaseLinks
        )
    )

    public static readonly shallot: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Shallot',
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

    public static readonly serranoChilli = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Serrano Chilli', // name
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
        )
    )

    public static readonly cilantro: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Cilantro',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly habanero: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Habanero',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly mango: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Mango',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly jalapeno: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Jalapeno',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly spiriliazer: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Spirilizer',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put sprilizer in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly pickleSpears = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Pickle Spears', // name
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
                    'spears': [
                        {
                            price: 2.89,
                            quantity: 24,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/32241/wegmans-reduced-sodium-kosher-dill-spears',
                            organic: false,
                        }
                    ]
                },
            }, // purchaseLinks
        )
    )

    public static readonly pickleSlices = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Pickle Slices', // name
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
                    'slices': [
                        {
                            price: 2.29,
                            quantity: 16,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/31882/wegmans-hamburger-dill-slices',
                            organic: false,
                        }
                    ]
                },
            }, // purchaseLinks
        )
    )

    public static readonly breadFlour = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Bread Flour', // name
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
        )
    )

    public static readonly wheatBreadFlour: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Wheat Bread Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put bread flour back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly dryActiveYeast: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Active Dry Yeast',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put dry active yeast back in refrigerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly brownSugar: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Brown Sugar',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put brown sugar back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly greenOnion = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Green Onion', // name
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
        )
    )

    public static readonly frozenCorn = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Frozen Corn', // name
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
                // [Stores.amazonFresh]: {
                //     'supremely spicy': [
                //         {
                //             price: 2.29,
                //             quantity: 16,
                //             quantity_unit: u.fluid_ounce,
                //             link: 'https://www.amazon.com/Sabra-Supremely-Spicy-Hummus-17/dp/B00LME9DTM',
                //         }
                //     ]
                // },
            }, // purchaseLinks
        )
    )

    public static readonly redPepperFlakes: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Red Pepper Flakes',
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

    public static readonly spicyHummus = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Spicy Hummus', // name
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
                // [Stores.amazonFresh]: {
                //     'supremely spicy': [
                //         {
                //             price: 2.29,
                //             quantity: 16,
                //             quantity_unit: u.fluid_ounce,
                //             link: 'https://www.amazon.com/Sabra-Supremely-Spicy-Hummus-17/dp/B00LME9DTM',
                //         }
                //     ]
                // },
            }, // purchaseLinks
        )
    )

    public static readonly whiteOnion = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'White Onion', // name
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
                    'conventional bulk': [
                        {
                            price: 6.89,
                            quantity: 10,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/16647/10-lb-cooking-onions',
                            organic: false,
                        }
                    ],
                    'conventional': [
                        {
                            price: 1.99,
                            quantity: 2,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/35629/wegmans-onions-yellow',
                            organic: false,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 0.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Onion-Yellow-Conventional-1-Each/dp/B07QTZBZ2C',
                            organic: false,
                        }
                    ],
                    'organic': [
                        {
                            price: 1.69,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Organic-White-Onion-One-Large/dp/B000RGZNFY/ref=sr_1_2_0g_wf',
                            organic: true,
                        }
                    ]
                },
            }, // purchaseLinks
        )
    )

    public static readonly yellowOnion = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Yellow Onion', // name
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
        )
    )

    public static readonly redOnion = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Red Onion', // name
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
                // [Stores.wholeFoods]: {
                //     'conventional': [
                //         {
                //             price: 6.89,
                //             quantity: 10,
                //             quantity_unit: u.pound,
                //             link: 'https://www.amazon.com/Onion-Red-Conventional-1-Each/dp/B0787T926H/ref=sr_1_2_0g_wf',
                //         }
                //     ]
                // },
            }, // purchaseLinks
            10, // perishableLimit
        )
    )

    public static readonly scallion: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Scallion',
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

    public static readonly cannedHotCherryPepper: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Canned Hot Cherry Pepper',
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

    public static readonly lemonZest = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Lemon Zest', // name
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
            // perishableLimit
        )
    )

    public static readonly greenBellPepper = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Green Bell Pepper', // name
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
                            price: 2.29,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/31857/extra-large-green-peppers',
                            organic: false,
                        }
                    ]
                },
                // [Stores.wholeFoods]: {
                //     "conventional": ["https://www.amazon.com/Green-Bell-Pepper-Conventional-Each/dp/B07815JXHB/ref=sr_1_1_0g_wf"],
                //     "organic": ["https://www.amazon.com/Green-Bell-Pepper-Organic-Each/dp/B07QYB5JNX/ref=sr_1_2_0g_wf"],
                // }
            }, // purchase links
            7, // perishableLimit
        )
    )

    public static readonly redBellPepper = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Red Bell Pepper', // name
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
            7, // perishableLimit
        )
    )

    public static readonly arrowRootStarch: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Arrow Root Starch',
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

    public static readonly broccoli: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Broccoli',
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

    public static readonly tomatoPaste = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Tomato Paste', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            true, // isTakoutUnitable
            false, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 1.19,
                            quantity: 6,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/112566/wegmans-tomato-paste',
                            organic: false,
                        }
                    ],
                    'organic': [
                        {
                            price: 0.89,
                            quantity: 6,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/111564/wegmans-organic-tomato-paste',
                            organic: true,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 0.99,
                            quantity: 6,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Tomato/dp/B074H5HH2H',
                            organic: true,
                        }
                    ]
                }
            }, // purchaseLinks
        )
    )

    public static readonly chipotlePepperInAdoboSauce: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Chipotle Pepper In Adobo Sauce',
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

    public static readonly driedOregano: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Dried Oregano',
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

    public static readonly garlicClove = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Garlic Clove', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            true, // isTakoutUnitable
            false, // isMeatProduct
            {

            }, // nutrition
            unit, // unit
            {
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 1.79,
                            quantity: 5,
                            quantity_unit: u.unit,
                            link: 'https://shop.wegmans.com/product/232182/wegmans-garlic-5-count-family-pack',
                            organic: false,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 3.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Garlic-Organic-1-Each/dp/B0788FLWK1',
                            organic: true,
                        }
                    ]
                }
            }, // purchaseLinks
        )
    )

    public static readonly basil = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Basil', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            true, // isTakoutUnitable
            false, // isMeatProduct
            {

            }, // nutrition
            unit, // unit
            {
            }, // purchaseLinks
        )
    )

    public static readonly whiteMushroom = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'White Mushroom', // name
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

    public static readonly shitatkeMushroom = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Shitatke eMushroom', // name
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

    public static readonly cabbage = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Cabbage', // name
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

    public static readonly babyBellaMushroom = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Baby Bella Mushroom', // name
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
                    'Wegmans Mushrooms, Baby Bella, Whole, FAMILY PACK': [
                        {
                            price: 4.59,
                            quantity: 24,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/3728/wegmans-mushrooms-baby-bella-whole-family-pack',
                            organic: false,
                        }
                    ],
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        {
                            price: 3.99,
                            quantity: 8,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Mushrooms/dp/B07NQDLF47',
                            organic: true,
                        }
                    ],
                    'sliced': [
                        {
                            price: 2.79,
                            quantity: 8,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Sliced-Mushrooms/dp/B07NQCSBBK/ref=sr_1_3_0o_wf',
                            organic: false,
                        }
                    ],
                    'whole': [
                        {
                            price: 2.59,
                            quantity: 8,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Mushroom-Baby-Bella-8-Ounce/dp/B08LLCB9FC/ref=sr_1_1_0o_wf',
                            organic: false,
                        }
                    ]
                }
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly spinach = (quantity = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Spinach', // name
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

    public static readonly zuchinni: IItem = (quantity = 0, unit: IUnitObj) => ({
        name: 'Zuchinni',
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
}
