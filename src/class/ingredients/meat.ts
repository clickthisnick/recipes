import { IItem } from './item';
import { IUnitObj } from '../../constants/units';
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
    })
}
