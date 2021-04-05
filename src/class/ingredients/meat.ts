import { IItem, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { FruitItems } from './fruit';
import { Stores } from '../../class/stores';

export class MeatItems extends FruitItems {
    public static readonly flankSteak: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Flank Steak',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly groundBeef: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Ground Beef',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })
    
    public static readonly BeefEyeRoundSteak: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Beef Eye Round Steak',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly groundBeef8020 = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Ground Beef 80/20', // name
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
            }, // purchase links
        )
    )

    public static readonly premadePizza = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Premade Pizza', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            true, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
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
            }, // purchaseLinks
        )
    )

    public static readonly londonBroil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'London Broil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly spiralCutHam: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Spiral Cut Ham',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {
            [u.ounce.name]: {
                calories: 46.666666666666667,
                sodium: 320,
                total_cost: 0.249375,
            }
        },
    })

    public static readonly topSirloin = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'top sirloin', // Name
            10, // Put away time
            10, // Take out time
            '', // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakeoutunitable
            true, // isMeatProduct
            {}, // Nutrition
            unit, // Unit
            {}, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly babyBackRibs: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Baby Back Ribs',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly sausageAidellsCajun: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Aidells Cajun Sausage',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {
            [u.unit.name]: {
                calories: 160,
                sodium: 690,
            }
        },
    })
}
