import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { OilItems } from './oil';
import { Stores } from '../../class/stores';

export class SauceItems extends OilItems {

    public static readonly coconutCream = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Coconut Cream',
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
                            price: 1.99,
                            quantity: 5.4,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Native-Forest-Coconut-Cream-organic/dp/B07893W8C1',
                            organic: true,
                        }
                    ],
                    'organic large': [
                        {
                            price: 2.99,
                            quantity: 13.5,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Coconut-Organic/dp/B07NRSVLBQ',
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

    public static readonly coconutMilk = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Coconut Milk',
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

    public static readonly ketchup = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Ketchup',
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

    public static readonly steakSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'steak sauce',
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

    public static readonly salsa = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'salsa',
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
                            price: 2.99,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Whole-Foods-Market-Cantina-Roasted/dp/B07H5Q73PN/ref=sr_1_2_0g_wf',
                            organic: false,
                        }
                    ]
                },
                [Stores.wegmans]: {
                    'chipotle': [
                        {
                            price: 3.09,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/19610/wegmans-salsa-roasted-chipotle',
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

    public static readonly hotSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'hot sauce',
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

    public static readonly sourCream = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'sour cream',
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

    public static readonly dijonMustard = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Dijon Mustard',
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
            nutrition: {
                [u.tsp.name]: {
                    calories: 0,
                    sodium: 50,
                    total_cost: .044,
                    protein: 0,
                    sugar: 0,
                }
            },
        }
        return new Ingredient(item)
    }

    public static readonly germanMustard = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'German Mustard',
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
                    'spicy': [
                        {
                            price: 1.49,
                            quantity: 12,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/24395/wegmans-spicy-brown-mustard',
                            organic: false,
                        }
                    ],
                    'whole': [
                        {
                            price: 2.89,
                            quantity: 9.9,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/650/wegmans-whole-grain-dijon-mustard',
                            organic: false,
                        }
                    ]
                },
                [Stores.wholeFoods]: {
                    'stone ground': [
                        {
                            price: 2.70,
                            quantity: 12,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Organicville-Stone-Ground-Organic-Mustard/dp/B00MFNAX52/ref=sr_1_2_0o_wf',
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

    public static readonly peanutOil = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Peanut Oil',
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

    public static readonly oysterSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Oyster Sauce',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put oyster sauce back in refrigerator',
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

    public static readonly soySauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Soy Sauce',
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

    public static readonly padThaiSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Pad Thai Sauce',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put pad thai sauce back in refrigerator',
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

    public static readonly barbecueSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Barbecue Sauce',
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

    public static readonly pizzaSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Pizza Sauce',
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

    public static readonly sirachaSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Siracha Sauce',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put siracha back in refrigerator',
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

    public static readonly hoisonSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Hoison Sauce',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put hoison back in refrigerator',
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

    public static readonly spaghettiSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Spaghetti Sauce',
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
                    'four cheese': [
                        {
                            price: 2.29,
                            quantity: 25,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Cheese/dp/B074H66176',
                            organic: true,
                        }
                    ],
                    'poetobello': [
                        {
                            price: 2.29,
                            quantity: 25,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Portobello-Mushroom/dp/B074J6YB78',
                            organic: true,
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {
                [u.cup.name]: {
                    servings: 6,
                    serving_size: .5,
                    calories: 70,
                    sodium: 410,
                    sugar: 4,
                    protein: 3,
                    fiber: 2,
                    total_cost: 2.29
                }
            },
        }
        return new Ingredient(item)
    }

    public static readonly wingTimeMediumBuffaloSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Buffalo Sauce',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: 'Put windtime sauce back in refrigerator',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: false,
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    'wing time': [
                        {
                            price: 4.79,
                            quantity: 13,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/WING-TIME-SAUCE-BUFFALO-MED/dp/B003S2QZVK',
                            organic: false,
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {
                [u.tbsp.name]: {
                    calories: 25,
                    sodium: 280,
                }
            },
        }
        return new Ingredient(item)
    }

    public static readonly buffaloSauce = (quantity = 0, unit: IUnitObj = Units.none) => {
        let item: IItemObj = {
            name: 'Buffalo Sauce',
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
