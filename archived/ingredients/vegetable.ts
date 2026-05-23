import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class VegetableItems {
    private static createFactory =
        (name: string, overrides: Partial<IItemObj> = {}) =>
        (quantity = 0, unit: IUnitObj = Units.none) =>
            Ingredient.makeItem(name, quantity, unit, {
                ...overrides,
            });

    public static readonly vitalWheatGluten = this.createFactory('Vital Wheat Gluten');

    public static readonly coffeeGrounds = this.createFactory('Coffee Grounds');

    public static readonly bakingPowder = this.createFactory('Baking Powder');

    public static readonly balsamicVinegar = this.createFactory('White Vinegar');

    public static readonly whiteVinegar = this.createFactory('White Vinegar');

    public static readonly frozenStirFryVeggies = this.createFactory('Frozen Stirfry Veggies');

    public static readonly almondFlour = this.createFactory('Almond Flour');

    public static readonly pankoBreadCrumbs = this.createFactory('Panko Bread Crumbs');

    public static readonly beyondBurger = this.createFactory('Beyond Burger');

    public static readonly briocheHamburgerBun = this.createFactory('Brioche Hamburger Bun');

    public static readonly blackLentils = this.createFactory('Black Lentils', {
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

    public static readonly lentils = this.createFactory('Lentils');

    public static readonly pizzaCrust = this.createFactory('Pizza Crust');

    public static readonly popcorn = this.createFactory('Popcorn');

    public static readonly carrots = this.createFactory('Carrots');

    public static readonly celery = this.createFactory('Celery', {
        perishableLimit: 5,
    });

    public static readonly frozenTatorTots = this.createFactory('Frozen Tator Tots');

    public static readonly hamburgerBun = this.createFactory('Hamburger Bun', {
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

    public static readonly sunflowerLechtin = this.createFactory('Sunflower Lechtin');

    public static readonly almondMilk = this.createFactory('Almond Milk', {
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

    public static readonly kale = this.createFactory('Kale', {
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

    public static readonly cookingSpray = this.createFactory('Cooking Spray');

    public static readonly asparagus = this.createFactory('asparagus', {
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

    public static readonly brusselSprouts = this.createFactory('Brussel Sprouts', {
        perishableLimit: 7,
    });

    public static readonly romaineLettuce = this.createFactory('Romaine Lettuce', {
        perishableLimit: 7,
    });

    public static readonly appleSauce = this.createFactory('Apple Sauce', {
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

    public static readonly timer = this.createFactory('Timer');

    public static readonly taurine = this.createFactory('Taurine');

    public static readonly vitaminE = this.createFactory('Vitamin E');

    public static readonly vitaminBComplex = this.createFactory('VitaminB Complex');

    public static readonly salmonOil = this.createFactory('Salmon Oil');

    public static readonly waterFirst = this.createFactory('Water First', {
        // TODO can delete some bug where its added all together
        putAwayTime: 10,
    });

    public static readonly water = this.createFactory('Water');

    public static readonly aminosCoconut = this.createFactory('Aminos Coconut');

    public static readonly liquidSmoke = this.createFactory('Liquid Smoke');

    public static readonly seasonedRiceVinegar = this.createFactory('Seasoned Rice Vinegar');

    public static readonly appleCiderVinegar = this.createFactory('Apple Cider Vinegar');

    public static readonly organicBlackKalamataOlives = this.createFactory('Black Olives');

    public static readonly blackBeans = this.createFactory('Black Beans', {
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

    public static readonly avocadoLarge = this.createFactory('Large avocado');

    public static readonly avocado = this.createFactory('avocado');

    public static readonly cauliflower = this.createFactory('Cauliflower');

    public static readonly leek = this.createFactory('Leek');

    public static readonly lime = this.createFactory('Lime');

    public static readonly macadamiaNutMilk = this.createFactory('Macadamia Nut Milk');

    public static readonly lemonJuice = this.createFactory('Lemon Juice');

    public static readonly limeJuice = this.createFactory('Lime Juice', {
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

    public static readonly romaTomato = this.createFactory('Roma Tomato');

    public static readonly pickleHotdogSlice = this.createFactory('Pickle');

    public static readonly freshGinger = this.createFactory('Fresh Ginger');

    public static readonly groundGinger = this.createFactory('Ground Ginger', {
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

    public static readonly shallot = this.createFactory('Shallot');

    public static readonly serranoChilli = this.createFactory('Serrano Chilli');

    public static readonly cilantro = this.createFactory('Cilantro');

    public static readonly habanero = this.createFactory('Habanero');

    public static readonly mango = this.createFactory('Mango');

    public static readonly jalapeno = this.createFactory('Jalapeno');

    public static readonly spiriliazer = this.createFactory('Spirilizer', {
        cleanSteps: 'Rinse and put sprilizer in dishwasher',
    });

    public static readonly pickleSpears = this.createFactory('Pickle Spears', {
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

    public static readonly pickleSlices = this.createFactory('Pickle Slices', {
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

    public static readonly breadFlour = this.createFactory('Bread Flour');

    public static readonly wheatBreadFlour = this.createFactory('Wheat Bread Flour', {
        cleanSteps: 'Put bread flour back in cupboard',
    });

    public static readonly nutritionalYeast = this.createFactory('Active Dry Yeast', {
        cleanSteps: 'Put dry active yeast back in refrigerator',
    });

    public static readonly dryActiveYeast = this.createFactory('Active Dry Yeast', {
        cleanSteps: 'Put dry active yeast back in refrigerator',
    });

    public static readonly brownSugar = this.createFactory('Brown Sugar', {
        cleanSteps: 'Put brown sugar back in cupboard',
    });
    public static readonly greenOnion = this.createFactory('Green Onion');

    public static readonly frozenCorn = this.createFactory('Frozen Corn');

    public static readonly redPepperFlakes = this.createFactory('Red Pepper Flakes');

    public static readonly spicyHummus = this.createFactory('Spicy Hummus');

    public static readonly whiteOnion = this.createFactory('White Onion', {
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

    public static readonly yellowOnion = this.createFactory('Yellow Onion');

    public static readonly redOnion = this.createFactory('Red Onion', {
        perishableLimit: 10,
    });

    public static readonly scallion = this.createFactory('Scallion', {
        perishableLimit: 7,
    });

    public static readonly cannedHotCherryPepper = this.createFactory('Canned Hot Cherry Pepper', {
        perishableLimit: 7,
    });

    public static readonly lemonZest = this.createFactory('Lemon Zest', {
        perishableLimit: 7,
    });

    public static readonly greenBellPepper = this.createFactory('Green Bell Pepper', {
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

    public static readonly greenBeans = this.createFactory('Green Beans', {
        perishableLimit: 7,
    });

    public static readonly redBellPepper = this.createFactory('Red Bell Pepper', {
        perishableLimit: 7,
    });

    public static readonly arrowRootStarch = this.createFactory('Arrow Root Starch');

    public static readonly broccoli = this.createFactory('Broccoli', {
        perishableLimit: 7,
    });

    public static readonly tomatoPaste = this.createFactory('Tomato Paste', {
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

    public static readonly chipotlePepperInAdoboSauce = this.createFactory(
        'Chipotle Pepper In Adobo Sauce',
        {
            perishableLimit: 7,
        }
    );

    public static readonly driedOregano = this.createFactory('Dried Oregano', {
        perishableLimit: 7,
    });

    public static readonly garlicClove = this.createFactory('Garlic Clove', {
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

    public static readonly basil = this.createFactory('Basil', {
        perishableLimit: 7,
    });

    public static readonly rosemary = this.createFactory('Rosemary', {
        perishableLimit: 7,
    });

    public static readonly sage = this.createFactory('Sage', {
        perishableLimit: 7,
    });

    public static readonly redPotatoes = this.createFactory('Red Potatoes', {
        perishableLimit: 7,
    });

    public static readonly whiteMushroom = this.createFactory('White Mushroom', {
        perishableLimit: 7,
    });

    public static readonly shitatkeMushroom = this.createFactory('Shitatke Mushroom', {
        perishableLimit: 7,
    });

    public static readonly frozenShitatkeMushroom = this.createFactory('Frozen Shitatke Mushroom');

    public static readonly cabbage = this.createFactory('Cabbage', {
        perishableLimit: 7,
    });

    public static readonly babyBellaMushroom = this.createFactory('Baby Bella Mushroom', {
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

    public static readonly spinach = this.createFactory('Spinach', {
        perishableLimit: 7,
    });

    public static readonly zuchinni = this.createFactory('Zuchinni');
}
