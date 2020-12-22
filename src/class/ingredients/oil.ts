import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { MeatItems } from './meat';

export class OilItems extends MeatItems {
    public static readonly sesameOil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Sesame Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {}
    })

    public static readonly avacadoOil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Avacado Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly chilliOil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Chilli Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {
            [u.tbsp.name]: {
                calories: 119.34,
                sodium: .3,
            },
            [u.tsp.name]: {
                calories: 39.78,
                sodium: .1,
            }
        },
    })

    public static readonly coconutOil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Coconut Oil',
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

    public static readonly oliveOil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Olive Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.tbsp.name]: {
                calories: 119.34,
                sodium: .3,
            },
            [u.tsp.name]: {
                calories: 39.78,
                sodium: .1,
            }
        }
    })

    public static readonly vegetableOil: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Vegetable Oil',
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
}
