export interface IItemObj {
    name: string;
    putAwayTime: number;
    takeOutTime: number;
    cleanSteps: string;
    quantity: number;
    unit: IItemObj | null;
    wash: boolean;
    isTakoutUnitable: boolean;
}

export interface IItem {
    (quantity?: number, unit?: IItemObj): IItemObj;
}

export class Items {
    public static readonly cup: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Measuring Cup',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly honey: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Honey',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly oldBay: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Old Bay Seasoning',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly chickenDrumstickPackage: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Chicken Drumstick Package',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly chickenBreastPackage: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Chicken Breast Package',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly seconds: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Seconds',
        putAwayTime: 0,
        takeOutTime: 0,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly timer: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Timer',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly water: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Water',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly tsp: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Measuring tsp',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring tsp spoon in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly tbsp: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Measuring tbsp',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring tbsp spoon in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly vegetableOil: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Vegetable Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly avacado: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Avacado',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
    })

    public static readonly leek: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Leek',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly sirachaSauce: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Siracha Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put siracha back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly hoisonSauce: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Hoison Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put hoison back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly parmessanCheese: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Parmessan Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put parmessan cheese back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly salt: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly pepperFlake: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Pepper Flake',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pepper flake back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly lime: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Lime',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
    })

    public static readonly romaTomato: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Roma Tomato',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly serranoChilli: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Serrano Chilli',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly cilantro: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Cilantro',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: false,
    })

    public static readonly spaghettiSauce: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Spaghetti Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly blackPepper: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Black Pepper',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly egg: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Egg',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put eggs back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly butter: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Butter',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put butter back on right of sink',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly spiriliazer: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Spirilizer',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put sprilizer in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly breadFlour: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Bread Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put bread flour back in cuboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly dryActiveYeast: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Active Dry Yeast',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put dry active yeast back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly kosherSalt: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Kosher Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put kosher salt back in cubboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly cinnamon: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Cinnamon',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put cinnamon back in cubboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly brownSugar: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Brown Sugar',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put brown sugar back in cubboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly redOnion: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Red Onion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly scallion: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Scallion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly bellPepper: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Bell Pepper',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly garlicClove: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Garlic Clove',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
    })

    public static readonly crimniMushroom: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Crimini Mushroom',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly zuchinni: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Zuchinni',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly soySauce: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Soy Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly padThaiSauce: IItem = (quantity: number = 1, unit: IItemObj) => ({
        name: 'Pad Thai Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pad thai sauce back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })
}
