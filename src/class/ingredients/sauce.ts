import { IItem } from './item';
import { IUnitObj } from '../../constants/units';
import { OilItems } from './oil';

export class SauceItems extends OilItems {
    public static readonly coconutCream: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Coconut Cream',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly soySauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Soy Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly padThaiSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pad Thai Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pad thai sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly pizzaSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pizza Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly sirachaSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Siracha Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put siracha back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly hoisonSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Hoison Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put hoison back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly spaghettiSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Spaghetti Sauce',
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
