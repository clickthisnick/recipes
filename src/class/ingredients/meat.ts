import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { FruitItems } from './fruit';

export class MeatItems extends FruitItems {
    public static readonly flankSteak: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Flank Steak',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {
            calories: {},
            sodium: {},
        },
    })

    public static readonly babyBackRibs: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Baby Back Ribs',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {
            calories: {},
            sodium: {},
        },
    })

    public static readonly sausageAidellsCajun: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
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
            calories: {
                [u.unit.name]: 160,
            },
            sodium: {
                [u.unit.name]: 690,
            },
        },
    })
}
