import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { FruitItems } from './fruit';

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

    public static readonly topSirloin: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Top Sirloin',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {
        }
    })

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
