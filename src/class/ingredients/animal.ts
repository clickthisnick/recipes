import { IItem, Item } from './item';
import { IUnitObj, Units as u } from '../../constants/units';

export class AnimalItems {

    public static readonly item = (name: string, quantity: number = 0, unit: any = null) => (
        new Item(
            name,
            10,
            10,
            '',
            quantity,
            false,
            false,
            false,
            {},
            unit,
        )
    )

    public static readonly chickenBreastPackage: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name:'Chicken Breast Package',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly chickenDrumstickPackage: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Chicken Drumstick Package',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly chickenThigh: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Chicken Thigh',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly salmon: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Salmon',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly italianSausage: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Italian Sausage',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {
            calories: {
                [u.ounce.name]: 92.13625,
                [u.pound.name]: 1474.18,
            },
            sodium: {},
        },
    })

    public static readonly mozzarellaCheese: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Mozzarella Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly ricottaCheese: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Ricotta Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly plainYogurt: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Plain Yogurt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly parmessanCheese: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Parmessan Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put parmessan cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly cheddarCheese: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Cheedar Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put monterey jack cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly pepperJackCheese: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pepper Jack Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put monterey jack cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly montereyJackCheese: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Monterey Jack Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put monterey jack cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly porkRoast: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pork Roast',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly porkChops: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Pork Roast',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly bonelessRibClubSteak: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Boneless Rib Club Steak',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly egg: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Egg',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put eggs back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly eggWhite: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Egg White',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put egg whites back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly ham: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Ham',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put ham back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly honey: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Honey',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly butter: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Butter',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put butter back on right of sink',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })

    public static readonly eggPasta: IItem = (quantity: number = 0, unit: IUnitObj) => ({
        name: 'Egg Pasta',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
        nutrition: {},
    })
}
