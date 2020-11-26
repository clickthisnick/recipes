import { IItem, Item } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { VegetableItems } from './vegetable';

export class DesertItems extends VegetableItems {
    public static readonly fudgeStrippedCookie: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Fudge Stripped Cookie',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly miniaturePeanutButterCups: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Miniature Peanut Butter Cups',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly orangeFrosting: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Orange Frosting',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })
}
