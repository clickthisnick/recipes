import { IItem } from './item';
import { IUnitObj } from '../../constants/units';

export class AnimalItems {

    public static readonly chickenBreastPackage: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Chicken Breast Package',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly chickenDrumstickPackage: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Chicken Drumstick Package',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly chickenThighPackage: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Chicken Thigh Package',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly salmon: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Salmon',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly sirloinTop: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Sirloin Top',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly italianSausage: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Italian Sausage',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly mozzarellaCheese: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Mozzarella Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly plainYogurt: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Plain Yogurt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly parmessanCheese: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Parmessan Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put parmessan cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly cheddarCheese: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Cheedar Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put monterey jack cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly pepperJackCheese: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Pepper Jack Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put monterey jack cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly montereyJackCheese: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Monterey Jack Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put monterey jack cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly porkRoast: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Pork Roast',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly bonelessRibClubSteak: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Boneless Rib Club Steak',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly egg: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Egg',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put eggs back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly eggWhite: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Egg White',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put egg whites back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly ham: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Ham',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put ham back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly honey: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Honey',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly butter: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Butter',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put butter back on right of sink',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })

    public static readonly eggPasta: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Egg Pasta',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: true,
    })
}
