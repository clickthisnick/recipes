import { IItem, Item } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { SpiceItems } from './spice';
import { Stores } from '../../class/stores';

export class VegetableItems extends SpiceItems {

    public static readonly vitalWheatGluten: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly coffeeGrounds: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly bakingPowder: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly whiteVinegar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly frozenStirFryVeggies: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly almondFlour: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly pankoBreadCrumbs: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly beyondBurger: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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


    public static readonly briocheHamburgerBun: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly lentils: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly pizzaCrust: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly popcorn: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly carrots: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Carrots',
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

    public static readonly celery: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Celery',
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
    
    public static readonly frozenTatorTots: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly hamburgerBun = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'white': ['https://shop.wegmans.com/product/16394/wegmans-hamburger-rolls-8-pack']
                }
            }, // purchase links
        )
    )

    public static readonly almondMilk = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wholeFoods]: {
                    'unsweetented': ['https://www.amazon.com/365-Everyday-Value-Almondmilk-Unsweetened/dp/B074H6M4M4/ref=sr_1_21_0o_wf']
                }
            }, // purchase links
        )
    )

    public static readonly kale = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'organic': ['https://www.amazon.com/365-Everyday-Value-Organic-Chopped/dp/B078J13FYR/'],
                }
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly cookingSpray: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly asparagus = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wegmans]: {
                    'conventional': ['https://www.amazon.com/Asparagus-Green-Conventional-Whole-Guarantee/dp/B0787Y51DM'],
                },
                [Stores.amazonFresh]: {
                    'conventional': ['https://www.amazon.com/produce-aisle-176899-Asparagus-bunch/dp/B078ZG3THS'],
                }
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly brusselSprouts = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wholeFoods]: {
                    'conventional': [
                        'https://www.amazon.com/Brussels-Sprout-Conventional-1-Bag/dp/B07813LYD6',
                        'https://www.amazon.com/Taylor-Farms-Trimmed-Brussels-Sprouts/dp/B077L4BGYN'
                    ],
                },
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly appleSauce = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'organic': [
                        'https://www.amazon.com/365-Everyday-Value-Organic-Cinnamon/dp/B074H5CNFD',
                    ],
                }
            }, // purchaseLinks
        )
    )

    public static readonly timer: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly water: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Water',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.cup.name]: {
                sodium: 0,
                calories: 0,
                total_cost: 0,
                protein: 0,
                sugar: 0,
            },
            [u.tsp.name]: {
                sodium: 0,
                calories: 0,
                total_cost: 0,
                protein: 0,
                sugar: 0,
            },
            [u.tbsp.name]: {
                sodium: 0,
                calories: 0,
                total_cost: 0,
                protein: 0,
                sugar: 0,
            },
            [u.ounce.name]: {
                sodium: 0,
                calories: 0,
                total_cost: 0,
                protein: 0,
                sugar: 0,
            },
            [u.pound.name]: {
                sodium: 0,
                calories: 0,
                total_cost: 0,
                protein: 0,
                sugar: 0,
            },
            [u.unit.name]: {
                sodium: 0,
                calories: 0,
                total_cost: 0,
                protein: 0,
                sugar: 0,
            },
        },
    })

    public static readonly aminosCoconut: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly liquidSmoke: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly seasonedRiceVinegar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly appleCiderVinegar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly blackBeans = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'organic': ['https://www.amazon.com/365-Everyday-Value-Organic-Black/dp/B074H6QVKY']
                }
            }, // purchase links
        )
    )

    public static readonly avacadoLarge = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Large Avacado', // name
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
                    'organic': ['https://www.amazon.com/Avocado-Hass-Large-Organic-Each/dp/B0785WJ3LT']
                }
            }, // purchaseLinks
            5, // perishableLimit
        )
    )

    public static readonly avacado: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Avacado',
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

    public static readonly cauliflower: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly leek: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly lime: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly limeJuice = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional': ['https://shop.wegmans.com/product/29839/realime-100-lime-juice-natural-strength']
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        'https://www.amazon.com/365-Everyday-Value-Organic-Concentrate/dp/B074H8KLVL',
                    ],
                }
            }, // purchaseLinks
        )
    )

    public static readonly romaTomato: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly pickleHotdogSlice: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly groundGinger: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Ground Ginger',
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

    public static readonly shallot: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly serranoChilli: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Serrano Chilli',
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

    public static readonly cilantro: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly habanero: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly mango: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly jalapeno: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly spiriliazer: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly pickleSpears = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wholeFoods]: {
                    'reduce sodium': ['https://shop.wegmans.com/product/32241/wegmans-reduced-sodium-kosher-dill-spears'],
                }
            }, // purchaseLinks
        )
    )

    public static readonly breadFlour = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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

    public static readonly wheatBreadFlour: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly dryActiveYeast: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Active Dry Yeast',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put dry active yeast back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly brownSugar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly greenOnion: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Green Onion',
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

    public static readonly redPepperFlakes: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly spicyHummus = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.amazonFresh]: {
                    'supremely spicy': ['https://www.amazon.com/Sabra-Supremely-Spicy-Hummus-17/dp/B00LME9DTM'],
                }
            }, // purchaseLinks
        )
    )

    public static readonly whiteOnion = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional bulk': ['https://shop.wegmans.com/product/16647/10-lb-cooking-onions'],
                },
                [Stores.wholeFoods]: {
                    'conventional': ['https://www.amazon.com/Onion-Yellow-Conventional-1-Each/dp/B07QTZBZ2C/ref=sr_1_8_0g_wf'],
                    'organic': ['https://www.amazon.com/White-Onion-Organic-1-Each/dp/B0787Z3T3B'],
                }
            }, // purchaseLinks
        )
    )

    public static readonly yellowOnion: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Yellow Onion',
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

    public static readonly redOnion = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wholeFoods]: {
                    'conventional': [
                        'https://www.amazon.com/Onion-Red-Conventional-1-Each/dp/B0787T926H/ref=sr_1_2_0g_wf'
                    ],
                    'organic': [
                        'https://www.amazon.com/Onion-Red-Organic-1-Each/dp/B0787Y45SB',
                    ],
                }
            }, // purchaseLinks
            10, // perishableLimit
        )
    )

    public static readonly scallion: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly cannedHotCherryPepper: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly greenBellPepper = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Bell Pepper', // name
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
                    'conventional': ["https://shop.wegmans.com/product/31857/extra-large-green-peppers"],
                },
                [Stores.wholeFoods]: {
                    "conventional": ["https://www.amazon.com/Green-Bell-Pepper-Conventional-Each/dp/B07815JXHB/ref=sr_1_1_0g_wf"],
                    "organic": ["https://www.amazon.com/Green-Bell-Pepper-Organic-Each/dp/B07QYB5JNX/ref=sr_1_2_0g_wf"],
                }
            }, // purchase links
            7, // perishableLimit
        )
    )

    public static readonly arrowRootStarch: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly broccoli: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly tomatoPaste = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Tomato Paste', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            true, // isTakoutUnitable
            false, // isMeatProduct
            {
                [u.tbsp.name]: {
                    servings: 5,
                    serving_size: 2,
                    calories: 25,
                    sodium: 0,
                    protein: 0,
                    sugar: 4,
                    fiber: 0,
                    total_cost: 0.99
                }
            }, // nutrition
            unit, // unit
            {
                [Stores.wegmans]: {
                    'organic': ['https://shop.wegmans.com/product/111564/wegmans-organic-tomato-paste'],
                    'conventional': ['https://shop.wegmans.com/product/112566/wegmans-tomato-paste']
                },
                [Stores.wholeFoods]: {
                    'organic': ['https://www.amazon.com/365-Everyday-Value-Organic-Tomato/dp/B074H5HH2H'],
                }
            }, // purchaseLinks
        )
    )

    public static readonly chipotlePepperInAdoboSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly driedOregano: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly garlicClove = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                    'conventional': ['https://shop.wegmans.com/product/232182/wegmans-garlic-5-count-family-pack'],
                },
                [Stores.wholeFoods]: {
                    ['organic']: ['https://www.amazon.com/Garlic-Organic-1-Each/dp/B0788FLWK1'],
                },
                [Stores.amazonFresh]: {
                    'organic': ['https://www.amazon.com/produce-aisle-mburring-Organic-Garlic/dp/B0035APRLO']
                }
            }, // purchaseLinks
        )
    )

    public static readonly whiteMushroom = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
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
                [Stores.wholeFoods]: {
                    'sliced': [
                        'https://www.amazon.com/Mushroom-Sliced-Conventional-8-Ounce/dp/B07B6B8PGG/ref=sr_1_5_0o_wf',
                    ],
                },
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly babyBellaMushroom = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Baby Bella Mushroom', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
                [u.ounce.name]: {
                    calories: 6.24,
                    sodium: 1.7,
                }
            }, // nutrition
            unit, // unit
            {
                [Stores.wegmans]: {
                    'conventional': [
                        'https://shop.wegmans.com/product/3728/wegmans-mushrooms-baby-bella-whole-family-pack'
                    ],
                },
                [Stores.wholeFoods]: {
                    'organic': [
                        'https://www.amazon.com/365-Everyday-Value-Organic-Mushrooms/dp/B07NQDLF47',
                    ],
                    'sliced': [
                        'https://www.amazon.com/365-Everyday-Value-Sliced-Mushrooms/dp/B07NQCSBBK/ref=sr_1_3_0o_wf',
                    ],
                    'whole': [
                        'https://www.amazon.com/Mushroom-Baby-Bella-8-Ounce/dp/B08LLCB9FC/ref=sr_1_1_0o_wf',
                    ]
                }
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly zuchinni: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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
