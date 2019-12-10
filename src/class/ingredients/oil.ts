import { IItem } from './item';
import { IUnitObj } from '../../constants/units';
import { FruitItems } from './fruit';

export class OilItems extends FruitItems {
    public static readonly sesameOil: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Sesame Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly oliveOil: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Olive Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly vegetableOil: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Vegetable Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })
}
