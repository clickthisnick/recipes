import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { OilItems } from './oil';

export class SauceItems extends OilItems {
    public static readonly coconutCream: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Coconut Cream',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly soySauce: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Soy Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly padThaiSauce: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Pad Thai Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pad thai sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly pizzaSauce: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Pizza Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly sirachaSauce: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Siracha Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put siracha back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly hoisonSauce: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Hoison Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put hoison back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly spaghettiSauce: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Spaghetti Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            'calorie': {
                [u.ounce.name]: 14.4
            }
        }
    })

    public static readonly wingTimeMediumBuffaloSauce: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Buffalo Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put brown sugar back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            'calorie': {
                [u.tbsp.name]: 25,
            },
            'sodium': {
                [u.tbsp.name]: 280,
            },
        },
    })

    public static readonly buffaloSauce: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Buffalo Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put brown sugar back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })
}
