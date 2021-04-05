import { IItem, Ingredient } from './ingredient';
import { IUnitObj, Units as u, Units } from '../../constants/units';
import { CarbItems } from './carb';
import { Stores } from '../../class/stores';

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
        nutrition: {},
    })

    public static readonly collagenPowder: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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
                servings: 25,
                serving_size: 4,
                calories: 70,
                sodium: 65,
                sugar: 0,
                protein: 18, 
            }
        },
    })

    public static readonly pittedDates: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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
                servings: 6,
                serving_size: 6,
                calories: 110,
                sodium: 0,
                sugar: 25,
                protein: 1, 
            }
        },
    })

    public static readonly cashewButter = (quantity: number = 0, unit: IUnitObj = Units.none) => (
        new Ingredient(
            'Cashew Butter', // name
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
                [Stores.wholeFoods]: {
                    'conventional': [
                        {
                            price: 8.99,
                            quantity: 16,
                            quantity_unit: u.ounce,
                            link: 'https://www.amazon.com/365-Everyday-Value-Cashew-Butter/dp/B074H6R4YF/ref=sr_1_5_0o_wf_mod_primary_alm',
                            organic: false,
                        }
                    ]
                },          
            }, // purchaseLinks
            7, // perishableLimit
        )
    )

    public static readonly orangeJuice: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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
                servings: 8,
                serving_size: 7,
                calories: 110,
                sodium: 0,
                sugar: 22,
                protein: 2, 
            }
        },
        link: 'https://www.amazon.com/gp/product/B074H6QW3S/ref=afx_dp_ingress?ie=UTF8&almBrandId=VUZHIFdob2xlIEZvb2Rz&fpw=alm'
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
        nutrition: {},
    })
}
