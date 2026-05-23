import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class SpiceItems {
    private static createFactory =
        (name: string, overrides: Partial<IItemObj> = {}) =>
        (quantity = 0, unit: IUnitObj = Units.none) =>
            Ingredient.makeItem(name, quantity, unit, {
                ...overrides,
            });

    public static readonly oldBay = this.createFactory('Old Bay Seasoning');

    public static readonly tandoriMasalla = this.createFactory('Tandori Masalla');

    public static readonly paprika = this.createFactory('Paprika');

    public static readonly vanillaExtract = this.createFactory('Vanilla Extract');

    public static readonly hotPaprika = this.createFactory('Hot Paprika');

    public static readonly coconutSugar = this.createFactory('Coconut Sugar');

    public static readonly sugar = this.createFactory('Sugar');

    public static readonly cumin = this.createFactory('Cumin');

    public static readonly driedThyme = this.createFactory('Dried Thyme');

    public static readonly turmeric = this.createFactory('Turmeric');

    public static readonly thyme = this.createFactory('Dried Thyme', {
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

    public static readonly mintLeaf = this.createFactory('Mint Leaf');

    public static readonly gingerPowder = this.createFactory('Ginger Powder');

    public static readonly saffron = this.createFactory('Saffron');

    public static readonly monkFruit = this.createFactory('Monk Fruit');

    public static readonly sweetPaprika = this.createFactory('Sweet Paprika');

    public static readonly smokedPaprika = this.createFactory('Smoked Paprika');

    public static readonly worcestershireSauce = this.createFactory('Worcestershire Sauce');

    public static readonly gramMasala = this.createFactory('Gram Masala');

    public static readonly litesalt = this.createFactory('Lite Salt');

    public static readonly salt = this.createFactory('Salt');

    public static readonly seaSalt = this.createFactory('Sea Salt');

    public static readonly pepperFlake = this.createFactory('Pepper Flake');

    public static readonly nutmeg = this.createFactory('Nutmeg');

    public static readonly allSpice = this.createFactory('All Spice');

    public static readonly lawlrySaltFree = this.createFactory('Lawlry Salt Free Seasoning');

    public static readonly dash = this.createFactory('Dash Seasoning');

    public static readonly cassavaFlour = this.createFactory('Cassava Flour');

    public static readonly cornstarch = this.createFactory('Cornstarch');

    public static readonly cacaoPowderUnsweetened = this.createFactory('Unsweetened Cacao Powder', {
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

    public static readonly peas = this.createFactory('Peas');

    public static readonly peaProtein = this.createFactory('Pea Protein');

    public static readonly chilliPowder = this.createFactory('Chilli Powder');

    public static readonly cayennePepper = this.createFactory('Cayenne Pepper');

    public static readonly dhanaJeera = this.createFactory('Dhana Jeera');

    public static readonly bayLeaf = this.createFactory('Bay Leaf');

    public static readonly greenCardamonSeed = this.createFactory('Green Cardamon Seed');

    public static readonly clove = this.createFactory('Clove');

    public static readonly wholeBlackPepper = this.createFactory('Whole Black Pepper');

    public static readonly panangCurryPaste = this.createFactory('Panang Curry Paste');

    public static readonly citricAcid = this.createFactory('Citric Acid');

    public static readonly blackPepper = this.createFactory('Black Pepper', {
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

    public static readonly parsleyFlakes = this.createFactory('Parsley Flakes');

    public static readonly dillWeed = this.createFactory('Dill Weed');

    public static readonly parsley = this.createFactory('Parsley');

    public static readonly curryPowder = this.createFactory('Curry Powder');

    public static readonly kosherSalt = this.createFactory('Kosher Salt', {
        cleanSteps: 'Put kosher salt back in cupboard',
    });

    public static readonly ceylonCinnamon = this.createFactory('Ceylon Cinnamon', {
        cleanSteps: 'Put cinnamon back in cupboard',
    });

    public static readonly cinnamon = this.createFactory('Cinnamon', {
        cleanSteps: 'Put cinnamon back in cupboard',
    });

    public static readonly wholeFennelSeeds = this.createFactory('Whole Fennel Seeds');

    public static readonly marjoram = this.createFactory('Marjoram');

    public static readonly italianSeasoning = this.createFactory('Italian Seasoning');

    public static readonly powderedSugar = this.createFactory('Powdered Sugar');

    public static readonly garlicPowder = this.createFactory('Garlic Powder', {
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

    public static readonly onionPowder = this.createFactory('Onion Powder');

    public static readonly garlicGranules = this.createFactory('Garlic Granules');

    public static readonly onionGranules = this.createFactory('Onion Granules');

    public static readonly driedOnion = this.createFactory('Dried Onion');
}
