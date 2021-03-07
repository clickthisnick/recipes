import { IItem, Item } from './item';
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

    public static readonly coconutOil = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Coconut Oil', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
            }, // nutrition
            unit, // unit
            {
                'wholeFoods': ['https://www.amazon.com/365-Everyday-Value-Organic-Coconut/dp/B074H5BV9Y']
            }, // purchase links
        )
    )

    public static readonly oliveOil = (quantity: number = 0, unit: IUnitObj | null = null) => (
        new Item(
            'Olive Oil', // name
            10, // putAwayTime
            10, // takeOutTime
            '',  // cleanSteps
            quantity, // quantity
            false, // wash
            false, // isTakoutUnitable
            false, // isMeatProduct
            {
                [u.tbsp.name]: {
                    calories: 119.34,
                    sodium: .3,
                },
                [u.tsp.name]: {
                    calories: 39.78,
                    sodium: .1,
                }
            }, // nutrition
            unit, // unit
            {
                'wholeFoods': ['https://www.amazon.com/365-Everyday-Value-Unfiltered-Californian/dp/B074HKKC3W']
            }, // purchase links
        )
    )

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
