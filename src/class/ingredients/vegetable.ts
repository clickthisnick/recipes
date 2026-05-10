import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class VegetableItems {
    private static makeVegetableItem(
        name: string,
        quantity = 0,
        unit: IUnitObj = Units.none,
        overrides: Partial<IItemObj> = {}
    ): Ingredient {
        return Ingredient.makeItem(name, quantity, unit, {
            isMeatProduct: true,
            ...overrides,
        });
    }

    public static readonly vitalWheatGluten = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Vital Wheat Gluten', quantity, unit);
    };

    public static readonly coffeeGrounds = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Coffee Grounds', quantity, unit);
    };

    public static readonly bakingPowder = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Baking Powder', quantity, unit);
    };

    public static readonly balsamicVinegar = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('White Vinegar', quantity, unit);
    };

    public static readonly whiteVinegar = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('White Vinegar', quantity, unit);
    };

    public static readonly frozenStirFryVeggies = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Frozen Stirfry Veggies', quantity, unit);
    };

    public static readonly almondFlour = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Almond Flour', quantity, unit);
    };

    public static readonly pankoBreadCrumbs = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Panko Bread Crumbs', quantity, unit);
    };

    public static readonly beyondBurger = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Beyond Burger', quantity, unit);
    };

    public static readonly briocheHamburgerBun = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Brioche Hamburger Bun', quantity, unit);
    };

    public static readonly blackLentils = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Black Lentils', quantity, unit, {
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 3.19,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Whole-Foods-Market-Organic/dp/B084NHD2R9/ref=sr_1_5_f3',
                            organic: true,
                        },
                    ],
                },
            },
        });
    };

    public static readonly lentils = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Lentils', quantity, unit);
    };

    public static readonly pizzaCrust = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Pizza Crust', quantity, unit);
    };

    public static readonly popcorn = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Popcorn', quantity, unit);
    };

    public static readonly carrots = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Carrots', quantity, unit);
    };

    public static readonly celery = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Celery', quantity, unit, {
            perishableLimit: 5,
        });
    };

    public static readonly frozenTatorTots = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Frozen Tator Tots', quantity, unit);
    };

    public static readonly hamburgerBun = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Hamburger Bun', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    white: [
                        {
                            price: 1.79,
                            quantity: 8,
                            quantity_unit: u.unit,
                            link: 'https://shop.wegmans.com/product/16394/wegmans-hamburger-rolls-8-pack',
                            organic: false,
                        },
                    ],
                },
            },
        });
    };

    public static readonly sunflowerLechtin = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Sunflower Lechtin', quantity, unit);
    };

    public static readonly almondMilk = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Almond Milk', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    unsweetened: [
                        {
                            price: 4.99,
                            quantity: 96,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/41821/blue-diamond-almond-breeze-almondmilk-unsweetened-original',
                            organic: false,
                        },
                    ],
                },
                [Stores.amazon]: {
                    'organic unsweetened': [
                        {
                            price: 3.19,
                            quantity: 64,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Almondmilk-Unsweetened/dp/B074H6M4M4/ref=sr_1_21_0o_wf',
                            organic: true,
                        },
                    ],
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
                    ],
                },
            },
        });
    };

    public static readonly kale = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Kale', quantity, unit, {
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 3.49,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/21168/wegmans-kale-greens-cut',
                            organic: false,
                        },
                    ],
                },
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 3.99,
                            quantity: 12,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Chopped/dp/B078J13FYR/',
                            organic: true,
                        },
                    ],
                },
            },
            perishableLimit: 7,
        });
    };

    public static readonly cookingSpray = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Cooking Spray', quantity, unit);
    };

    public static readonly asparagus = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('asparagus', quantity, unit, {
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    conventional: [
                        {
                            price: 3.49,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/produce-aisle-176899-Asparagus-bunch/dp/B078ZG3THS/ref=sr_1_2_0g_wf',
                            organic: false,
                        },
                    ],
                },
                [Stores.wegmans]: {
                    conventional: [
                        {
                            price: 2.29,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/58808/asparagus',
                            organic: false,
                        },
                    ],
                },
            },
            perishableLimit: 7,
        });
    };

    public static readonly brusselSprouts = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Brussel Sprouts', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly romaineLettuce = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Romaine Lettuce', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly appleSauce = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Apple Sauce', quantity, unit, {
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    conventional: [
                        {
                            price: 2.49,
                            quantity: 24,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Cinnamon/dp/B074H5CNFD',
                            organic: true,
                        },
                    ],
                },
            },
        });
    };

    public static readonly timer = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Timer', quantity, unit);
    };

    public static readonly taurine = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Taurine', quantity, unit);
    };

    public static readonly vitaminE = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Vitamin E', quantity, unit);
    };

    public static readonly vitaminBComplex = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('VitaminB Complex', quantity, unit);
    };

    public static readonly salmonOil = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Salmon Oil', quantity, unit);
    };

    public static readonly waterFirst = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Water First', quantity, unit, {
            // TODO can delete some bug where its added all together
            putAwayTime: 10,
        });
    };

    public static readonly water = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Water', quantity, unit);
    };

    public static readonly aminosCoconut = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Aminos Coconut', quantity, unit);
    };

    public static readonly liquidSmoke = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Liquid Smoke', quantity, unit);
    };

    public static readonly seasonedRiceVinegar = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Seasoned Rice Vinegar', quantity, unit);
    };

    public static readonly appleCiderVinegar = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Apple Cider Vinegar', quantity, unit);
    };

    public static readonly organicBlackKalamataOlives = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Black Olives', quantity, unit);
    };

    public static readonly blackBeans = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Black Beans', quantity, unit, {
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 1.09,
                            quantity: 15,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Black/dp/B074H6QVKY',
                            organic: true,
                        },
                    ],
                    conventional: [
                        {
                            price: 0.89,
                            quantity: 15,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Black-Beans/dp/B074H58Y5B/ref=sr_1_5_0g_wf',
                            organic: false,
                        },
                    ],
                },
            },
        });
    };

    public static readonly avocadoLarge = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Large avocado', quantity, unit);
    };

    public static readonly avocado = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('avocado', quantity, unit);
    };

    public static readonly cauliflower = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Cauliflower', quantity, unit);
    };

    public static readonly leek = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Leek', quantity, unit);
    };

    public static readonly lime = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Lime', quantity, unit);
    };

    public static readonly macadamiaNutMilk = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Macadamia Nut Milk', quantity, unit);
    };

    public static readonly lemonJuice = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Lemon Juice', quantity, unit);
    };

    public static readonly limeJuice = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Lime Juice', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    conventional: [
                        {
                            price: 2.29,
                            quantity: 8,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/29839/realime-100-lime-juice-natural-strength',
                            organic: false,
                        },
                    ],
                },
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 3.29,
                            quantity: 10,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/29839/realime-100-lime-juice-natural-strength',
                            organic: true,
                        },
                    ],
                },
            },
        });
    };

    public static readonly romaTomato = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Roma Tomato', quantity, unit);
    };

    public static readonly pickleHotdogSlice = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Pickle', quantity, unit);
    };

    public static readonly freshGinger = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Fresh Ginger', quantity, unit);
    };

    public static readonly groundGinger = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Ground Ginger', quantity, unit, {
            purchaseLinks: {
                [Stores.amazon]: {
                    organic: [
                        {
                            price: 8.99,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Naturevibe-Botanicals-Zingiber-officinale-verified/dp/B088X6FW6B',
                            organic: true,
                        },
                    ],
                },
            },
        });
    };

    public static readonly shallot = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Shallot', quantity, unit);
    };

    public static readonly serranoChilli = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Serrano Chilli', quantity, unit);
    };

    public static readonly cilantro = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Cilantro', quantity, unit);
    };

    public static readonly habanero = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Habanero', quantity, unit);
    };

    public static readonly mango = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Mango', quantity, unit);
    };

    public static readonly jalapeno = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Jalapeno', quantity, unit);
    };

    public static readonly spiriliazer = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Spirilizer', quantity, unit, {
            cleanSteps: 'Rinse and put sprilizer in dishwasher',
        });
    };

    public static readonly pickleSpears = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Pickle Spears', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    spears: [
                        {
                            price: 2.89,
                            quantity: 24,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/32241/wegmans-reduced-sodium-kosher-dill-spears',
                            organic: false,
                        },
                    ],
                },
            },
        });
    };

    public static readonly pickleSlices = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Pickle Slices', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    slices: [
                        {
                            price: 2.29,
                            quantity: 16,
                            quantity_unit: u.fluid_ounce,
                            link: 'https://shop.wegmans.com/product/31882/wegmans-hamburger-dill-slices',
                            organic: false,
                        },
                    ],
                },
            },
        });
    };

    public static readonly breadFlour = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Bread Flour', quantity, unit);
    };

    public static readonly wheatBreadFlour = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Wheat Bread Flour', quantity, unit, {
            cleanSteps: 'Put bread flour back in cupboard',
        });
    };

    public static readonly nutritionalYeast = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Active Dry Yeast', quantity, unit, {
            cleanSteps: 'Put dry active yeast back in refrigerator',
        });
    };

    public static readonly dryActiveYeast = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Active Dry Yeast', quantity, unit, {
            cleanSteps: 'Put dry active yeast back in refrigerator',
        });
    };

    public static readonly brownSugar = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Brown Sugar', quantity, unit, {
            cleanSteps: 'Put brown sugar back in cupboard',
        });
    };
    public static readonly greenOnion = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Green Onion', quantity, unit);
    };

    public static readonly frozenCorn = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Frozen Corn', quantity, unit);
    };

    public static readonly redPepperFlakes = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Red Pepper Flakes', quantity, unit);
    };

    public static readonly spicyHummus = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Spicy Hummus', quantity, unit);
    };

    public static readonly whiteOnion = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('White Onion', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    'conventional bulk': [
                        {
                            price: 6.89,
                            quantity: 10,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/16647/10-lb-cooking-onions',
                            organic: false,
                        },
                    ],
                    conventional: [
                        {
                            price: 1.99,
                            quantity: 2,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/35629/wegmans-onions-yellow',
                            organic: false,
                        },
                    ],
                },
                [Stores.wholeFoods]: {
                    conventional: [
                        {
                            price: 0.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Onion-Yellow-Conventional-1-Each/dp/B07QTZBZ2C',
                            organic: false,
                        },
                    ],
                    organic: [
                        {
                            price: 1.69,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Organic-White-Onion-One-Large/dp/B000RGZNFY/ref=sr_1_2_0g_wf',
                            organic: true,
                        },
                    ],
                },
            },
        });
    };

    public static readonly yellowOnion = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Yellow Onion', quantity, unit);
    };

    public static readonly redOnion = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Red Onion', quantity, unit, {
            perishableLimit: 10,
        });
    };

    public static readonly scallion = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Scallion', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly cannedHotCherryPepper = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Canned Hot Cherry Pepper', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly lemonZest = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Lemon Zest', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly greenBellPepper = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Green Bell Pepper', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    conventional: [
                        {
                            price: 2.29,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/31857/extra-large-green-peppers',
                            organic: false,
                        },
                    ],
                },
                // [Stores.wholeFoods]: {
                //     "conventional": ["https://www.amazon.com/Green-Bell-Pepper-Conventional-Each/dp/B07815JXHB/ref=sr_1_1_0g_wf"],
                //     "organic": ["https://www.amazon.com/Green-Bell-Pepper-Organic-Each/dp/B07QYB5JNX/ref=sr_1_2_0g_wf"],
                // }
            },
            perishableLimit: 7,
        });
    };

    public static readonly greenBeans = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Green Beans', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly redBellPepper = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Red Bell Pepper', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly arrowRootStarch = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Arrow Root Starch', quantity, unit);
    };

    public static readonly broccoli = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Broccoli', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly tomatoPaste = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Tomato Paste', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    conventional: [
                        {
                            price: 1.19,
                            quantity: 6,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/112566/wegmans-tomato-paste',
                            organic: false,
                        },
                    ],
                    organic: [
                        {
                            price: 0.89,
                            quantity: 6,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/111564/wegmans-organic-tomato-paste',
                            organic: true,
                        },
                    ],
                },
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 0.99,
                            quantity: 6,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Tomato/dp/B074H5HH2H',
                            organic: true,
                        },
                    ],
                },
            },
        });
    };

    public static readonly chipotlePepperInAdoboSauce = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Chipotle Pepper In Adobo Sauce', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly driedOregano = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Dried Oregano', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly garlicClove = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Garlic Clove', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    conventional: [
                        {
                            price: 1.79,
                            quantity: 5,
                            quantity_unit: u.unit,
                            link: 'https://shop.wegmans.com/product/232182/wegmans-garlic-5-count-family-pack',
                            organic: false,
                        },
                    ],
                },
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 3.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Garlic-Organic-1-Each/dp/B0788FLWK1',
                            organic: true,
                        },
                    ],
                },
            },
            perishableLimit: 7,
        });
    };

    public static readonly basil = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Basil', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly rosemary = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Rosemary', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly sage = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Sage', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly redPotatoes = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Red Potatoes', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly whiteMushroom = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('White Mushroom', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly shitatkeMushroom = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Shitatke Mushroom', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly frozenShitatkeMushroom = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Frozen Shitatke Mushroom', quantity, unit);
    };

    public static readonly cabbage = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Cabbage', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly babyBellaMushroom = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Baby Bella Mushroom', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    'Wegmans Mushrooms, Baby Bella, Whole, FAMILY PACK': [
                        {
                            price: 4.59,
                            quantity: 24,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/3728/wegmans-mushrooms-baby-bella-whole-family-pack',
                            organic: false,
                        },
                    ],
                },
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 3.99,
                            quantity: 8,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Mushrooms/dp/B07NQDLF47',
                            organic: true,
                        },
                    ],
                    sliced: [
                        {
                            price: 2.79,
                            quantity: 8,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Sliced-Mushrooms/dp/B07NQCSBBK/ref=sr_1_3_0o_wf',
                            organic: false,
                        },
                    ],
                    whole: [
                        {
                            price: 2.59,
                            quantity: 8,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Mushroom-Baby-Bella-8-Ounce/dp/B08LLCB9FC/ref=sr_1_1_0o_wf',
                            organic: false,
                        },
                    ],
                },
            },
            perishableLimit: 7,
        });
    };

    public static readonly spinach = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Spinach', quantity, unit, {
            perishableLimit: 7,
        });
    };

    public static readonly zuchinni = (quantity?: number, unit?: IUnitObj) => {
        return this.makeVegetableItem('Zuchinni', quantity, unit);
    };
}
