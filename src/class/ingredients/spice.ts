import { IItem } from './item';
import { IUnitObj } from '../../constants/units';
import { SauceItems } from './sauce';

export class SpiceItems extends SauceItems {

    public static readonly oldBay: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Old Bay Seasoning',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly tandoriMasalla: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Tandori Masalla',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly paprika: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Paprika',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly salt: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly pepperFlake: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Pepper Flake',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pepper flake back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly lawlrySaltFree: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Lawlry Salk Free Seasoning',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
    })

    public static readonly chilliPowder: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Chilli Powder',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
    })

    public static readonly blackPepper: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Black Pepper',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly kosherSalt: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Kosher Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put kosher salt back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly cinnamon: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Cinnamon',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put cinnamon back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
    })

    public static readonly garlicPowder: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Garlic Powder',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
    })

    public static readonly driedOnion: IItem = (quantity: number = 1, unit: IUnitObj) => ({
        name: 'Dried Onion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
    })

}