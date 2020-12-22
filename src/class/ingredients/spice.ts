import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { SauceItems } from './sauce';

export class SpiceItems extends SauceItems {

    public static readonly oldBay: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly tandoriMasalla: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly paprika: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly vanillaExtract: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Vanilla Extract',
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

    public static readonly hotPaprika: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Hot Paprika',
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

    public static readonly coconutSugar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Coconut Sugar',
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

    public static readonly sugar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly cumin: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly turmeric: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly thyme: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Dried Thyme',
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

    public static readonly monkFruit: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Monk Fruit',
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

    public static readonly smokedPaprika: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Smoked Paprika',
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

    public static readonly worcestershireSauce: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Worcestershire Sauce',
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

    public static readonly gramMasala: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly salt: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            
        },
    })

    public static readonly seaSalt: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Sea Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        nutrition: {
            
        },
    })

    public static readonly pepperFlake: IItem = (quantity: number = 0, unit: IUnitObj) => ({
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

    public static readonly lawlrySaltFree: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'lawlry salk free seasoning',
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

    public static readonly dash: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'dash seasoning',
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

    public static readonly cacaoPowderUnsweetened: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'unsweetened cacao powder',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        nutrition: {
            [u.tbsp.name]: {
                servings: 38,
                serving_size: 1,
                calories: 15,
                sodium: 0,
                sugar: 0,
                protein: 1, 
            }
        },
    })

    public static readonly chilliPowder: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'chilli powder',
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

    public static readonly cayennePepper: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'cayenne pepper',
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

    public static readonly blackPepper: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'black pepper',
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

    public static readonly parsley: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Parsley',
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

    public static readonly curryPowder: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'curry powder',
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

    public static readonly kosherSalt: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'kosher salt',
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

    public static readonly cinnamon: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'cinnamon',
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

    public static readonly wholeFennelSeeds: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Whole Fennel Seeds',
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

    public static readonly marjoram: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Marjoram',
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

    public static readonly italianSeasoning: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Italian Seasoning',
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

    public static readonly powderedSugar: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Powdered Sugar',
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

    public static readonly garlicPowder: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'garlic powder',
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

    public static readonly onionPowder: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'onion powder',
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

    public static readonly onionGranules: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'onion granules',
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

    public static readonly driedOnion: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Dried Onion',
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

}
