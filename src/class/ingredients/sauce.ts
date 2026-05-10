import { IItemObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { Stores } from '../../class/stores';

export class SauceItems {
    private static makeSauceItem(
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

    public static readonly coconutCream = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Coconut Cream', quantity, unit, {
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 1.99,
                            quantity: 5.4,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Native-Forest-Coconut-Cream-organic/dp/B07893W8C1',
                            organic: true,
                        },
                    ],
                    'organic large': [
                        {
                            price: 2.99,
                            quantity: 13.5,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Coconut-Organic/dp/B07NRSVLBQ',
                            organic: true,
                        },
                    ],
                },
            },
        });

    public static readonly coconutMilk = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Coconut Milk', quantity, unit);

    public static readonly ketchup = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Ketchup', quantity, unit);

    public static readonly steakSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Steak Sauce', quantity, unit);

    public static readonly salsa = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Salsa', quantity, unit, {
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    organic: [
                        {
                            price: 2.99,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Whole-Foods-Market-Cantina-Roasted/dp/B07H5Q73PN/ref=sr_1_2_0g_wf',
                            organic: false,
                        },
                    ],
                },
                [Stores.wegmans]: {
                    chipotle: [
                        {
                            price: 3.09,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/19610/wegmans-salsa-roasted-chipotle',
                            organic: false,
                        },
                    ],
                },
            },
        });

    public static readonly hotSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Hot Sauce', quantity, unit);

    public static readonly sourCream = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Sour Cream', quantity, unit);

    public static readonly dijonMustard = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Dijon Mustard', quantity, unit, {
            nutrition: {
                [u.tsp.name]: {
                    calories: 0,
                    sodium: 50,
                    total_cost: 0.044,
                    protein: 0,
                    sugar: 0,
                },
            },
        });

    public static readonly germanMustard = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('German Mustard', quantity, unit, {
            purchaseLinks: {
                [Stores.wegmans]: {
                    spicy: [
                        {
                            price: 1.49,
                            quantity: 12,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/24395/wegmans-spicy-brown-mustard',
                            organic: false,
                        },
                    ],
                    whole: [
                        {
                            price: 2.89,
                            quantity: 9.9,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/650/wegmans-whole-grain-dijon-mustard',
                            organic: false,
                        },
                    ],
                },
                [Stores.wholeFoods]: {
                    'stone ground': [
                        {
                            price: 2.7,
                            quantity: 12,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Organicville-Stone-Ground-Organic-Mustard/dp/B00MFNAX52/ref=sr_1_2_0o_wf',
                            organic: true,
                        },
                    ],
                },
            },
        });

    public static readonly peanutOil = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Peanut Oil', quantity, unit);

    public static readonly oysterSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Oyster Sauce', quantity, unit, {
            cleanSteps: 'Put oyster sauce back in refrigerator',
        });

    public static readonly soySauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Soy Sauce', quantity, unit);

    public static readonly padThaiSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Pad Thai Sauce', quantity, unit, {
            cleanSteps: 'Put pad thai sauce back in refrigerator',
        });

    public static readonly barbecueSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Barbecue Sauce', quantity, unit);

    public static readonly pizzaSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Pizza Sauce', quantity, unit);

    public static readonly sirachaSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Siracha Sauce', quantity, unit, {
            cleanSteps: 'Put siracha back in refrigerator',
        });

    public static readonly hoisonSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Hoison Sauce', quantity, unit, {
            cleanSteps: 'Put hoison back in refrigerator',
        });

    public static readonly spaghettiSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Spaghetti Sauce', quantity, unit, {
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    'four cheese': [
                        {
                            price: 2.29,
                            quantity: 25,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Organic-Cheese/dp/B074H66176',
                            organic: true,
                        },
                    ],
                    poetobello: [
                        {
                            price: 2.29,
                            quantity: 25,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Portobello-Mushroom/dp/B074J6YB78',
                            organic: true,
                        },
                    ],
                },
            },
            nutrition: {
                [u.cup.name]: {
                    servings: 6,
                    serving_size: 0.5,
                    calories: 70,
                    sodium: 410,
                    sugar: 4,
                    protein: 3,
                    fiber: 2,
                    total_cost: 2.29,
                },
            },
        });

    public static readonly wingTimeMediumBuffaloSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Buffalo Sauce', quantity, unit, {
            cleanSteps: 'Put wingtime sauce back in refrigerator',
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    'wing time': [
                        {
                            price: 4.79,
                            quantity: 13,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/WING-TIME-SAUCE-BUFFALO-MED/dp/B003S2QZVK',
                            organic: false,
                        },
                    ],
                },
            },
            nutrition: {
                [u.tbsp.name]: {
                    calories: 25,
                    sodium: 280,
                },
            },
        });

    public static readonly buffaloSauce = (quantity?: number, unit?: IUnitObj) =>
        SauceItems.makeSauceItem('Buffalo Sauce', quantity, unit);
}
