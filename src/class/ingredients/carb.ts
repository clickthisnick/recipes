import { IItem } from './item';
import { IUnitObj } from '../../constants/units';
import { AnimalItems } from './animal';

export class CarbItems extends AnimalItems {

    public static readonly quinoa: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Quinoa',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly brownRice: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Brown Rice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly frozenChickenWings: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Frozen Chicken Wings',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly wildBasmatiRice: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Wild Basmati Rice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })
}
