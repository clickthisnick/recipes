import { IItem, Item } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { OilItems } from './oil';
import { Stores } from '../../class/stores';

export class SauceItems extends OilItems {

    public static readonly coconutCream = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Coconut Cream', // name
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
                    'organic': ['https://www.amazon.com/Native-Forest-Coconut-Cream-organic/dp/B07893W8C1'],
                }
            }, // purchaseLinks
        )
    )

    public static readonly coconutMilk: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Coconut Milk',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly ketchup: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Ketchup',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly steakSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'steak sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly salsa: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'salsa',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly hotSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'hot sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly sourCream: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'sour cream',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {}
    })

    public static readonly dijonMustard: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Dijon Mustard',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.tsp.name]: {
                calories: 0,
                sodium: 50,
                total_cost: .044,
                protein: 0,
                sugar: 0,
            }
        },
        link: 'https://www.amazon.com/365-Everyday-Value-Organic-Mustard/dp/B074J6RQZB?fpw=alm&s=wf'
    })

    public static readonly germanMustard = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'German Mustard', // name
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
                    'spicy': [
                        'https://shop.wegmans.com/product/24395/wegmans-spicy-brown-mustard'
                    ],
                    'whole': [
                        'https://shop.wegmans.com/product/650/wegmans-whole-grain-dijon-mustard',
                    ],
                }

            }, // purchase links
        )
    )

    public static readonly soySauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Soy Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly padThaiSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pad Thai Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pad thai sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly barbecueSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Barbecue Sauce',
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

    public static readonly pizzaSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pizza Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly sirachaSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Siracha Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put siracha back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly hoisonSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Hoison Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put hoison back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly spaghettiSauce = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Spaghetti Sauce', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
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
            }, // nutrition
            unit, // unit
            {
                [Stores.wholeFoods]: {
                    'organic': [
                        'https://www.amazon.com/365-Everyday-Value-Organic-Cheese/dp/B074H66176',
                    ],
                    'conventional': ['https://www.amazon.com/365-Everyday-Value-Portobello-Mushroom/dp/B074J6YB78']
                }

            }, // purchase links
        )
    )

    public static readonly wingTimeMediumBuffaloSauce = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Buffalo Sauce', // name
            10, // putAwayTime
            10, // takeOutTime
            'Rinse and put away measuring cup',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
                [u.tbsp.name]: {
                    calories: 25,
                    sodium: 280,
                }
            }, // nutrition
            unit, // unit
            {
                [Stores.wholeFoods]: {
                    'wing time': [
                        'https://www.amazon.com/Wing-Time-Buffalo-Sauce-Ounce/dp/B003S2N5XG',
                        'https://www.amazon.com/WING-TIME-SAUCE-BUFFALO-MED/dp/B003S2QZVK'
                    ]
                }
            }, // purchaseLinks
        )
    )

    public static readonly buffaloSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Buffalo Sauce',
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
}
