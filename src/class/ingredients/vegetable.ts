import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { SpiceItems } from './spice';
import { Stores } from '../../class/stores';

export class VegetableItems extends SpiceItems {

    public static readonly vitalWheatGluten = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Vital Wheat Gluten',
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

    public static readonly coffeeGrounds = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Coffee Grounds',
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

    public static readonly bakingPowder = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Baking Powder',
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

    public static readonly balsamicVinegar = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'White Vinegar',
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

    public static readonly whiteVinegar = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'White Vinegar',
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

    public static readonly frozenStirFryVeggies = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Frozen Stirfry Veggies',
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

    public static readonly almondFlour = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Almond Flour',
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

    public static readonly pankoBreadCrumbs = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Panko Bread Crumbs',
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

    public static readonly beyondBurger = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Beyond Burger',
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

    public static readonly briocheHamburgerBun = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Brioche Hamburger Bun',
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

    public static readonly blackLentils = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Black Lentils',
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
                            price: 3.19,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B084NHD2R9/ref=sr_1_5_f3',
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

    public static readonly lentils = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Lentils',
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

    public static readonly pizzaCrust = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Pizza Crust',
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

    public static readonly popcorn = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Popcorn',
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

    public static readonly carrots = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Carrots',
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

    public static readonly celery = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Celery',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 5,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly frozenTatorTots = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Frozen Tator Tots',
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

    public static readonly hamburgerBun = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Hamburger Bun',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks:             {
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly sunflowerLechtin = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Sunflower Lechtin',
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

    public static readonly almondMilk = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Almond Milk',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
                [Stores.amazon]: {
                    'organic unsweetened': [
                        {
                            price: 3.19,
                            quantity: 64,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Almondmilk-Unsweetened/dp/B074H6M4M4/ref=sr_1_21_0o_wf',
                            organic: true,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'organic unsweetened': [
                        {
                            price: 3.19,
                            quantity: 64,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.wholefoodsmarket.com/product/365-by-whole-foods-market-organic-unsweetened-almond-milk-96-fl-oz-b08tsqr1cs',
                            organic: true,
                        },
                        {
                            price: 4.99,
                            quantity: 96,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/365-WFM-Organic-Unsweetened-Almond/dp/B08TSQR1CS',
                            organic: true,
                        },
                    ]
                },
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly kale = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Kale',
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
            },
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly cookingSpray = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Cooking Spray',
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

    public static readonly asparagus = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'asparagus',
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
            },
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly brusselSprouts = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Brussel Sprouts',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly romaineLettuce = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Romaine Lettuce',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly appleSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Apple Sauce',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks:            {
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly timer = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Timer',
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

    public static readonly taurine = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Taurine',
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

    public static readonly vitaminE = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Vitamin E',
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

    public static readonly vitaminBComplex = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'VitaminB Complex',
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

    public static readonly salmonOil = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Salmon Oil',
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

    public static readonly waterFirst = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Water First', // TODO can delete some bug where its added all together
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

    public static readonly water = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Water',
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

    public static readonly aminosCoconut = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Aminos Coconut',
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

    public static readonly liquidSmoke = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Liquid Smoke',
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

    public static readonly seasonedRiceVinegar = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Seasoned Rice Vinegar',
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

    public static readonly appleCiderVinegar = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Apple Cider Vinegar',
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

    public static readonly blackBeans = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Black Beans',
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly avocadoLarge = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Large avocado',
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

    public static readonly avocado = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'avocado',
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

    public static readonly cauliflower = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Cauliflower',
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

    public static readonly leek = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Leek',
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

    public static readonly lime = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Lime',
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

    public static readonly lemonJuice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Lemon Juice',
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

    public static readonly limeJuice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Lime Juice',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly romaTomato = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Roma Tomato',
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

    public static readonly pickleHotdogSlice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Pickle',
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

    public static readonly freshGinger = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Fresh Ginger',
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

    public static readonly groundGinger = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Ground Ginger',
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly shallot = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Shallot',
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

    public static readonly serranoChilli = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Serrano Chilli',
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

    public static readonly cilantro = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Cilantro',
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

    public static readonly habanero = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Habanero',
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

    public static readonly mango = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Mango',
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

    public static readonly jalapeno = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Jalapeno',
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

    public static readonly spiriliazer = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Spirilizer',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Rinse and put sprilizer in dishwasher',
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

    public static readonly pickleSpears = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Pickle Spears',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly pickleSlices = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Pickle Slices',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly breadFlour = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Bread Flour',
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

    public static readonly wheatBreadFlour = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Wheat Bread Flour',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put bread flour back in cupboard',
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


    public static readonly nutritionalYeast = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Active Dry Yeast',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put dry active yeast back in refrigerator',
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

    public static readonly dryActiveYeast = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Active Dry Yeast',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put dry active yeast back in refrigerator',
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

    public static readonly brownSugar = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name:  'Brown Sugar',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put brown sugar back in cupboard',
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
    public static readonly greenOnion = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Green Onion',
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

    public static readonly frozenCorn = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Frozen Corn',
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

    public static readonly redPepperFlakes = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Red Pepper Flakes',
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

    public static readonly spicyHummus = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Spicy Hummus',
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

    public static readonly whiteOnion = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'White Onion',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly yellowOnion = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Yellow Onion',
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

    public static readonly redOnion = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Red Onion',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 10,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly scallion = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Scallion',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly cannedHotCherryPepper = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Canned Hot Cherry Pepper',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly lemonZest = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Lemon Zest',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly greenBellPepper = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Green Bell Pepper',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly redBellPepper = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Red Bell Pepper',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly arrowRootStarch = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Arrow Root Starch',
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

    public static readonly broccoli = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Broccoli',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly tomatoPaste = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Tomato Paste',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly chipotlePepperInAdoboSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Chipotle Pepper In Adobo Sauce',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly driedOregano = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Dried Oregano',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly garlicClove = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Garlic Clove',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly basil = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Basil',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly rosemary = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Rosemary',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly sage = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Sage',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly redPotatoes = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Red Potatoes',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly whiteMushroom = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'White Mushroom',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly shitatkeMushroom = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Shitatke Mushroom',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly frozenShitatkeMushroom = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Frozen Shitatke Mushroom',
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

    public static readonly cabbage = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Cabbage',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly babyBellaMushroom = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Baby Bella Mushroom',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
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
            },
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly spinach = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Spinach',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {},
            perishableLimit: 7,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly zuchinni = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Zuchinni',
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
