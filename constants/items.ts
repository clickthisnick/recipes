export interface IItemObj {
    name: string,
    putAwayTime: number,
    takeOutTime: number,
    cleanSteps: string,
    quantity: number | null,
    unit: object | null,
    wash: boolean,
    isTakoutUnitable: boolean,
}

export interface IItem {
    (quantity?: number, unit?: object): IItemObj;
}

export class Items {
    public static readonly cup: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Measuring Cup',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly water: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Water',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly tsp: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Measuring tsp',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring tsp spoon in dishwasher',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly tbsp: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Measuring tbsp',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring tbsp spoon in dishwasher',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly vegetableOil: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Vegetable Oil',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly avacado: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Avacado',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
    });

    public static readonly leek: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Leek',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    });

    public static readonly sirachaSauce: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Siracha Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put siracha back in refridgerator',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly hoisonSauce: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Hoison Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put hoison back in refridgerator',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly parmessanCheese: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Parmessan Cheese',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put parmessan cheese back in refridgerator',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly salt: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly pepperFlake: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Pepper Flake',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pepper flake back in cupboard',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly lime: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Lime',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
    });

    public static readonly romaTomato: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Roma Tomato',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    });

    public static readonly serranoChilli: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Serrano Chilli',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    });

    public static readonly cilantro: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Cilantro',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: false,
    });

    public static readonly blackPepper: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Black Pepper',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly egg: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Egg',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put eggs back in refridgerator',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly butter: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Butter',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put butter back on right of sink',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly spiriliazer: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Spirilizer',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put sprilizer in dishwasher',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly breadFlour: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Bread Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put bread flour back in cuboard',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly dryActiveYeast: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Active Dry Yeast',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put dry active yeast back in refridgerator',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly kosherSalt: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Kosher Salt',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put kosher salt back in cubboard',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly cinnamon: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Cinnamon',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put cinnamon back in cubboard',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly brownSugar: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Brown Sugar',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put brown sugar back in cubboard',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    });

    public static readonly redOnion: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Red Onion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly scallion: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Scallion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly bellPepper: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Bell Pepper',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly garlicClove: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Garlic Clove',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
    })

    public static readonly crimniMushroom: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Crimini Mushroom',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly zuchinni: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Zuchinni',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity || null,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
    })

    public static readonly soySauce: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Soy Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put soy sauce back in refridgerator',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })

    public static readonly padThaiSauce: IItem = (quantity: number | null = null, unit: object) => ({
        name: 'Pad Thai Sauce',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put pad thai sauce back in refridgerator',
        quantity: quantity || null,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
    })
}
