import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
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
        nutrition: {
            [u.tbsp.name]: {
                quantity: 25,
                serving_size: 4,
                calories: 70,
                sodium: 65,
                sugar: 0,
                protein: 18, 
            }
        },
    })

    public static readonly pittedDates: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Pitted Date',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.unit.name]: {
                quantity: 6,
                serving_size: 6,
                calories: 110,
                sodium: 0,
                sugar: 25,
                protein: 1, 
            }
        },
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
        nutrition: {
            [u.tbsp.name]: {
                quantity: 14,
                serving_size: 2,
                calories: 190,
                sodium: 0,
                sugar: 1,
                protein: 4, 
            }
        },
    })

    public static readonly orangeJuice: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Orange Juice',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            [u.fluid_ounce.name]: {
                quantity: 8,
                serving_size: 7,
                calories: 110,
                sodium: 0,
                sugar: 22,
                protein: 2, 
            }
        },
        link: 'https://www.amazon.com/gp/product/B074H6QW3S/ref=afx_dp_ingress?ie=UTF8&almBrandId=VUZHIFdob2xlIEZvb2Rz&fpw=alm'
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
