import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { AnimalItems } from './animal';

export class CarbItems extends AnimalItems {

    public static readonly raoPastaElbow: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
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

    public static readonly spaghettiLentil: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
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
            'calorie': {
                [u.ounce.name]: 100,
            }
        }
    })

    public static readonly spaghettiWholeGrain: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
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
            'calorie': {
                [u.ounce.name]: 100
            }
        }
    })

    public static readonly quinoa: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
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

    public static readonly brownRice: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
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
            'calorie': {
                [u.cup.name]: 678.96
            },
            'sodium': {
                [u.cup.name]: 9.3
            }
        }
    })

    public static readonly frozenChickenWings: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
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

    public static readonly wildBasmatiRice: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
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
}
