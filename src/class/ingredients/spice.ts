import { Stores } from '../../class/stores';
import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { SauceItems } from './sauce';

export class SpiceItems extends SauceItems {

    public static readonly oldBay = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Old Bay Seasoning',
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

    public static readonly tandoriMasalla = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Tandori Masalla',
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

    public static readonly paprika = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Paprika',
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

    public static readonly vanillaExtract = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Vanilla Extract',
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

    public static readonly hotPaprika = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Hot Paprika',
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

    public static readonly coconutSugar = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Coconut Sugar',
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

    public static readonly sugar = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Sugar',
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

    public static readonly cumin = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Cumin',
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

        public static readonly driedThyme = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Turmeric',
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

    public static readonly turmeric = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Turmeric',
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

    public static readonly thyme = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Dried Thyme',
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly mintLeaf = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Mint Leaf',
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

    public static readonly gingerPowder = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Ginger Powder',
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

    public static readonly saffron = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Saffron',
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

    public static readonly monkFruit = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Monk Fruit',
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


    public static readonly sweetPaprika = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Smoked Paprika',
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

    public static readonly smokedPaprika = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Smoked Paprika',
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

    public static readonly worcestershireSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Worcestershire Sauce',
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

    public static readonly gramMasala = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Gram Masala',
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

    public static readonly litesalt = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Lite Salt',
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

    public static readonly salt = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Salt',
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

    public static readonly seaSalt = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Sea Salt',
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

    public static readonly pepperFlake = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Pepper Flake',
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

    public static readonly nutmeg = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'nutmeg',
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

    public static readonly allSpice = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'all spice',
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

    public static readonly lawlrySaltFree = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'lawlry salk free seasoning',
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

    public static readonly dash = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'dash seasoning',
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

    public static readonly cacaoPowderUnsweetened = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'unsweetened cacao powder',
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly peaProtein = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Pea Protein',
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

    public static readonly chilliPowder = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'chilli powder',
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

    public static readonly cayennePepper = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'cayenne pepper',
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

    public static readonly dhanaJeera = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Dhana Jeera',
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

    public static readonly bayLeaf = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Bay Leaf',
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

    public static readonly greenCardamonSeed = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Green Cardamon Seed',
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

    public static readonly clove = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Clove',
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

    public static readonly wholeBlackPepper = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Whole Black Pepper',
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

    public static readonly panangCurryPaste = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Panang Curry Paste',
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

    public static readonly citricAcid = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Citric Acid',
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

    public static readonly blackPepper = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Black Pepper',
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly parsleyFlakes = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Parsley Flakes',
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

    public static readonly dillWeed = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Dill Weed',
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

    public static readonly parsley = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Parsley',
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

    public static readonly curryPowder = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'curry powder',
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

    public static readonly kosherSalt = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'kosher salt',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put kosher salt back in cupboard',
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

    public static readonly ceylonCinnamon = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Ceylon Cinnamon',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put cinnamon back in cupboard',
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

    public static readonly cinnamon = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'cinnamon',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put cinnamon back in cupboard',
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

    public static readonly wholeFennelSeeds = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Whole Fennel Seeds',
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

    public static readonly marjoram = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Marjoram',
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

    public static readonly italianSeasoning = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Italian Seasoning',
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

    public static readonly powderedSugar = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Powdered Sugar',
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

    public static readonly garlicPowder = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Garlic Powder',
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
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly onionPowder = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'onion powder',
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

    public static readonly garlicGranules = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'garlic granules',
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

    public static readonly onionGranules = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'onion granules',
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

    public static readonly driedOnion = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IItemObj = {
            name: 'Dried Onion',
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
