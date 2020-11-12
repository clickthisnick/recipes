import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { AnimalItems } from './animal';

export class CarbItems extends AnimalItems {

    public static readonly raoPastaElbow: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Rao Pasta Elbow',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly penneLentil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Lentil Penne',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.ounce.name]: {
                servings: 2.5,
                serving_size: 3,
                calories: 300,
                sodium: 0,
                protein: 21,
                sugar: 2,
                fiber: 9,
                total_cost: 2.99
            }
        }
    })

    public static readonly spaghettiLentil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Lentil Spaghetti',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.ounce.name]: {
                calories: 100
            }
        }
    })

    public static readonly ziti: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Ziti',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.pound.name]: {
                servings: 1,
                total_cost: 1.99,
            }
        }
    })

    public static readonly spaghettiWholeGrain: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Whole Grain Spaghetti',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.ounce.name]: {
                calories: 100,
                sodium: 0
            }
        }
    })

    public static readonly quinoa: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Quinoa',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly seaweed: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Seaweed',
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

    public static readonly sushiRice: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Sushi Rice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.cup.name]: {
                servings: 10,
                serving_size: .25,
                calories: 160,
                sodium: 10,
                protein: 3,
            }
        }
    })

    public static readonly brownRice: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Brown Rice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.cup.name]: {
                calories: 678.96,
                sodium: 9.3,
            }
        }
    })

    public static readonly frozenChickenWings: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Frozen Chicken Wings',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly wildBasmatiRice: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Wild Basmati Rice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly softTortillaShell: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'soft tortilla shell',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly flaxSeedCereal: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Flax seed cereal',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly hotdogBunPotato: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Hotdog Bun',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {
            [u.unit.name]: {
                calories: 150,
                sodium: 280,
            }
        },
    })
}
