import { IItem } from './item';
import { IUnitObj } from '../../constants/units';
import { SauceItems } from './sauce';

export class SpiceItems extends SauceItems {

    public static readonly oldBay: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Old Bay Seasoning',
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

    public static readonly tandoriMasalla: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Tandori Masalla',
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

    public static readonly paprika: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Paprika',
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

    public static readonly sugar: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Sugar',
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

    public static readonly cumin: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Cumin',
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

    public static readonly turmeric: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Turmeric',
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

    public static readonly gramMasala: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Gram Masala',
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

    public static readonly salt: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Salt',
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

    public static readonly pepperFlake: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Pepper Flake',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pepper flake back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly lawlrySaltFree: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Lawlry Salk Free Seasoning',
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

    public static readonly dash: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Dash Seasoning',
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

    public static readonly chilliOil: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Chilli Oil',
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

    public static readonly chilliPowder: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Chilli Powder',
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

    public static readonly blackPepper: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Black Pepper',
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

    public static readonly curryPowder: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Curry Powder',
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

    public static readonly kosherSalt: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Kosher Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put kosher salt back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly cinnamon: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Cinnamon',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put cinnamon back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {},
    })

    public static readonly garlicPowder: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Garlic Powder',
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

    public static readonly driedOnion: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Dried Onion',
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
