import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { MeatItems } from './meat';

export class OilItems extends MeatItems {
    public static readonly sesameOil: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Sesame Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            calories: {},
            sodium: {},
        }
    })

    public static readonly oliveOil: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Olive Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            calories: {
                [u.tbsp.name]: 119.34,
                [u.tsp.name]: 39.78,
            },
            sodium: {
                [u.tbsp.name]: .3,
                [u.tsp.name]: .1,
            }
        }
    })

    public static readonly vegetableOil: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Vegetable Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            calories: {},
            sodium: {},
        }
    })
}
