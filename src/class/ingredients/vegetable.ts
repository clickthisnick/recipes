import { IItem } from './item';
import { IUnitObj, Units as u } from '../../constants/units';
import { SpiceItems } from './spice';

export class VegetableItems extends SpiceItems {

    public static readonly vitalWheatGluten: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Vital Wheat Gluten',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly coffeeGrounds: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Coffee Grounds',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly bakingPowder: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Baking Powder',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly instaPot: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'InstaPot',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly whiteVinegar: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'White Vinegar',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly frozenStirFryVeggies: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Frozen Stirfry Veggies',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly almondFlour: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Almond Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly allPurposeFlour: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Flour (All Purpose) Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly archerFlour: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Archer Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly buckwheatFlour: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Buckwheat Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly beyondBurger: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Beyond Burger',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })


    public static readonly briocheHamburgerBun: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Brioche Hamburger Bun',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put measuring cup in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly lentils: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Lentils',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly pizzaCrust: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Pizza Crust',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly popcorn: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Popcorn',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly carrots: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Carrots',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly frozenTatorTots: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Frozen Tator Tots',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly almondMilk: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Almond Milk',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly kale: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Kale',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly cookingSpray: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Cooking Spray',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly asparagus: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Asparagus',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly bread: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Bread',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly timer: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Timer',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly water: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Water',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {
            [u.cup.name]: 0,
            [u.tsp.name]: 0,
            [u.tbsp.name]: 0,
            [u.ounce.name]: 0,
            [u.pound.name]: 0,
            [u.unit.name]: 0,
        },
    })

    public static readonly aminosCoconut: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Aminos Coconut',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly blackBeans: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Black Beans',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly avacado: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Avacado',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly cauliflower: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Cauliflower',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly leek: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Leek',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly lime: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Lime',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly romaTomato: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Roma Tomato',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly pickleHotdogSlice: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Pickle',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly groundGinger: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Ground Ginger',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly shallot: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Shallot',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly serranoChilli: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Serrano Chilli',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly cilantro: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Cilantro',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly spiriliazer: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Spirilizer',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Rinse and put sprilizer in dishwasher',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly breadFlour: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Bread Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put bread flour back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly wheatBreadFlour: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Wheat Bread Flour',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put bread flour back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly dryActiveYeast: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Active Dry Yeast',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put dry active yeast back in refridgerator',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly brownSugar: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Brown Sugar',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: 'Put brown sugar back in cupboard',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: false,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly greenOnion: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Green Onion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly redPepperFlakes: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Red Pepper Flakes',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly whiteOnion: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'White Onion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly redOnion: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Red Onion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly scallion: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Scallion',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly bellPepper: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Bell Pepper',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly arrowRootStarch: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Arrow Root Starch',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly broccoli: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Broccoli',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly tomatoPaste: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Tomato Paste',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly garlicClove: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Garlic Clove',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: false,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly crimniMushroom: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Crimini Mushroom',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })

    public static readonly zuchinni: IItem = (quantity: number = .00001, unit: IUnitObj) => ({
        name: 'Zuchinni',
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity: quantity,
        unit: unit || null,
        wash: true,
        isTakoutUnitable: true,
        isMeatProduct: false,
        calorie: {},
    })
}
