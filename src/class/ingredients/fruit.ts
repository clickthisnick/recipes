import { IItem } from './item';
import { IUnitObj } from '../../constants/units';
import { CarbItems } from './carb';

export class FruitItems extends CarbItems {
    public static readonly apple: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Apple',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly frozenBerries: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Frozen Berries',
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
