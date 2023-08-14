import { IMeatObj, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { FruitItems } from './fruit';
import { Stores } from '../../class/stores';

export class MeatItems extends FruitItems {

    public static readonly flankSteak = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Flank Steak',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly gelatin = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Gelatin',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly groundBeef = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Ground Beef',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly BeefEyeRoundSteak = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Beef Eye Round Steak',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly groundBeef8020 = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Ground Beef 80/20',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 4.99,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://www.amazon.com/Beef-Ground-80-20-Step/dp/B078B25WMD/ref=sr_1_5_0o_wf',
                            organic: false
                        }
                    ]
                },
                [Stores.wegmans]: {
                    'conventional': [
                        {
                            price: 3.49,
                            quantity: 1,
                            quantity_unit: u.pound,
                            link: 'https://shop.wegmans.com/product/216270/wegmans-ground-beef-80-20-family-pack',
                            organic: false
                        }
                    ]
                }
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly premadePizza = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Premade Pizza',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {
                [Stores.wegmans]: {
                    'cheese': [
                        {
                            price: 13.79,
                            quantity: 33,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/31038/wegmans-fully-cooked-packaged-cheese-pizza-heat-serve',
                            organic: false
                        }
                    ],
                    'pepperoni': [
                        {
                            price: 16.09,
                            quantity: 35,
                            quantity_unit: u.ounce,
                            link: 'https://shop.wegmans.com/product/31143/wegmans-fully-cooked-packaged-pepperoni-pizza-heat-serve',
                            organic: false
                        }

                    ]
                },
                [Stores.wholeFoods]: {
                    'cheese': [
                        {
                            price: 9.99,
                            quantity: 34.25,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/Whole-Foods-Market-Prepared-Cheese/dp/B08DK3X7Y3/ref=sr_1_4_0o_wf',
                            organic: false
                        }
                    ],
                },
            },
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly londonBroil = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'London Broil',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly spiralCutHam = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Spiral Cut Ham',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {
                [u.ounce.name]: {
                    calories: 46.666666666666667,
                    sodium: 320,
                    total_cost: 0.249375,
                }
            },
        }
        return new Ingredient(item)
    }

    public static readonly topSirloin = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'top sirloin',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly babyBackRibs = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Baby Back Ribs',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {}
        }
        return new Ingredient(item)
    }

    public static readonly sausageAidellsCajun = (quantity = 0, unit: IUnitObj = Units.none) => {
        const item: IMeatObj = {
            name: 'Aidells Cajun Sausage',
            putAwayTime: 10,
            takeOutTime: 10,
            cleanSteps: '',
            quantity: quantity,
            unit: unit,
            wash: false,
            isTakeoutUnitable: false,
            isMeatProduct: true,
            purchaseLinks: {},
            perishableLimit: 0,
            nutrition: {
                [u.unit.name]: {
                    calories: 160,
                    sodium: 690,
                }
            },
        }
        return new Ingredient(item)
    }
}
