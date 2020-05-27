import { IItem } from './item';
import { IUnitObj } from '../../constants/units';
import { CarbItems } from './carb';

export class FruitItems extends CarbItems {
    public static readonly apple: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Apple',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly collagenPowder: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Collagen Powder',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly pittedDates: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Pitted Dates',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly cashewButter: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Cashew Butter',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly frozenBerries: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Frozen Berries',
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
}
