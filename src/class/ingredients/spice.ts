import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class SpiceItems {
    private static makeSpiceItem(
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

    public static readonly oldBay = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Old Bay Seasoning', quantity, unit);

    public static readonly tandoriMasalla = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Tandori Masalla', quantity, unit);

    public static readonly paprika = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Paprika', quantity, unit);

    public static readonly vanillaExtract = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Vanilla Extract', quantity, unit);

    public static readonly hotPaprika = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Hot Paprika', quantity, unit);

    public static readonly coconutSugar = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Coconut Sugar', quantity, unit);

    public static readonly sugar = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Sugar', quantity, unit);

    public static readonly cumin = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Cumin', quantity, unit);

    public static readonly driedThyme = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Dried Thyme', quantity, unit);

    public static readonly turmeric = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Turmeric', quantity, unit);

    public static readonly thyme = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Dried Thyme', quantity, unit, {
            purchaseLinks: {
                [Stores.amazon]: {
                    Thyme: [
                        {
                            price: 13.14,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Frontier-Thyme-Extract-Fancy-Grade/dp/B00016XJVK',
                            organic: true,
                            discount: {
                                'Subscribe 5 Products': 15,
                                Subscribe: 5,
                            },
                        },
                    ],
                },
            },
        });

    public static readonly mintLeaf = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Mint Leaf', quantity, unit);

    public static readonly gingerPowder = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Ginger Powder', quantity, unit);

    public static readonly saffron = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Saffron', quantity, unit);

    public static readonly monkFruit = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Monk Fruit', quantity, unit);

    public static readonly sweetPaprika = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Sweet Paprika', quantity, unit);

    public static readonly smokedPaprika = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Smoked Paprika', quantity, unit);

    public static readonly worcestershireSauce = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Worcestershire Sauce', quantity, unit);

    public static readonly gramMasala = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Gram Masala', quantity, unit);

    public static readonly litesalt = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Lite Salt', quantity, unit);

    public static readonly salt = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Salt', quantity, unit);

    public static readonly seaSalt = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Sea Salt', quantity, unit);

    public static readonly pepperFlake = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Pepper Flake', quantity, unit);

    public static readonly nutmeg = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Nutmeg', quantity, unit);

    public static readonly allSpice = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('All Spice', quantity, unit);

    public static readonly lawlrySaltFree = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Lawlry Salt Free Seasoning', quantity, unit);

    public static readonly dash = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Dash Seasoning', quantity, unit);

    public static readonly cassavaFlour = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Cassava Flour', quantity, unit);

    public static readonly cornstarch = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Cornstarch', quantity, unit);

    public static readonly cacaoPowderUnsweetened = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Unsweetened Cacao Powder', quantity, unit, {
            purchaseLinks: {
                [Stores.amazon]: {
                    "Anthony's Organic Raw Cocoa Powder, Cacao Powder 5lb": [
                        {
                            price: 29.99,
                            quantity: 5,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Organic-Anthonys-Verified-Gluten-Free-Non-GMO/dp/B00F7SU63G',
                            organic: true,
                        },
                    ],
                    "Anthony's Organic Raw Cocoa Powder, Cacao Powder 2lb": [
                        {
                            price: 14.85,
                            quantity: 2,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Organic-Anthonys-Verified-Gluten-Free-Non-GMO/dp/B0833QH1N4?th=1',
                            organic: true,
                            discount: {
                                'Subscribe 5 Products': 5,
                            },
                        },
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
                                Subscribe: 5,
                            },
                        },
                    ],
                },
            },
        });

    public static readonly peas = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Peas', quantity, unit);

    public static readonly peaProtein = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Pea Protein', quantity, unit);

    public static readonly chilliPowder = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Chilli Powder', quantity, unit);

    public static readonly cayennePepper = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Cayenne Pepper', quantity, unit);

    public static readonly dhanaJeera = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Dhana Jeera', quantity, unit);

    public static readonly bayLeaf = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Bay Leaf', quantity, unit);

    public static readonly greenCardamonSeed = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Green Cardamon Seed', quantity, unit);

    public static readonly clove = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Clove', quantity, unit);

    public static readonly wholeBlackPepper = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Whole Black Pepper', quantity, unit);

    public static readonly panangCurryPaste = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Panang Curry Paste', quantity, unit);

    public static readonly citricAcid = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Citric Acid', quantity, unit);

    public static readonly blackPepper = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Black Pepper', quantity, unit, {
            purchaseLinks: {
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
                                Subscribe: 5,
                            },
                        },
                    ],
                },
            },
        });

    public static readonly parsleyFlakes = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Parsley Flakes', quantity, unit);

    public static readonly dillWeed = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Dill Weed', quantity, unit);

    public static readonly parsley = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Parsley', quantity, unit);

    public static readonly curryPowder = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Curry Powder', quantity, unit);

    public static readonly kosherSalt = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Kosher Salt', quantity, unit, {
            cleanSteps: 'Put kosher salt back in cupboard',
        });

    public static readonly ceylonCinnamon = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Ceylon Cinnamon', quantity, unit, {
            cleanSteps: 'Put cinnamon back in cupboard',
        });

    public static readonly cinnamon = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Cinnamon', quantity, unit, {
            cleanSteps: 'Put cinnamon back in cupboard',
        });

    public static readonly wholeFennelSeeds = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Whole Fennel Seeds', quantity, unit);

    public static readonly marjoram = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Marjoram', quantity, unit);

    public static readonly italianSeasoning = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Italian Seasoning', quantity, unit);

    public static readonly powderedSugar = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Powdered Sugar', quantity, unit);

    public static readonly garlicPowder = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Garlic Powder', quantity, unit, {
            purchaseLinks: {
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
                                Subscribe: 5,
                            },
                        },
                    ],
                },
            },
        });

    public static readonly onionPowder = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Onion Powder', quantity, unit);

    public static readonly garlicGranules = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Garlic Granules', quantity, unit);

    public static readonly onionGranules = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Onion Granules', quantity, unit);

    public static readonly driedOnion = (quantity?: number, unit?: IUnitObj) =>
        SpiceItems.makeSpiceItem('Dried Onion', quantity, unit);
}
