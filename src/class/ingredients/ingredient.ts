import { IUnitObj } from '../../constants/units';
import { IStep, istep } from '../step';
import { Serializer as s } from '../serializer';
import { Equipment as e } from '../equipment';

export interface IEstimates {
    servings?: number;
    serving_size?: number;
    calories?: number;
    sodium?: number;
    sugar?: number;
    fiber?: number;
    protein?: number;
    total_cost?: number;
}

export interface IEstimatesMissing {
    calories: string[];
    sodium: string[];
    protein: string[];
    sugar: string[];
    fiber: string[];
    total_cost: string[];
}

interface INutrition {
   [unit: string]: IEstimates;
}

export interface IStorePurchaseLink {
    [store: string]: IPurchaseLink,
}

export interface IPurchaseLink {
    [store: string]: IPurchaseItem[],
}

interface IPurchaseItem {
    price: number,
    quantity: number,
    quantity_unit: IUnitObj,
    link: string,
    organic: boolean,
    discount?: IDiscount,
    priceConversionTable?: any // Keys are the unit name, value is the price per that unit
}

interface IDiscount {
    [store: string]: number,
}

export interface IItemObj {
    name: string;
    putAwayTime: number;
    takeOutTime: number;
    cleanSteps: string;
    quantity: number;
    unit: IUnitObj;
    wash: boolean;
    isTakeoutUnitable: boolean;
    isMeatProduct: boolean;
    purchaseLinks: IStorePurchaseLink;
    perishableLimit: number;
    nutrition: INutrition;
}

export interface IMeatObj extends IItemObj {
    isMeatProduct: true;
}

export interface IItem {
    (quantity?: number, unit?: IUnitObj): IItemObj;
}

export interface IIngredient{
    Ingredient: Ingredient
}

export class Ingredient {
    name: string
    putAwayTime: number
    takeOutTime: number
    cleanSteps: string
    quantity: number
    unit: IUnitObj
    wash: boolean
    isTakeoutUnitable: boolean
    isMeatProduct: boolean
    nutrition: any
    purchaseLinks: IStorePurchaseLink
    perishableLimit: number // The number of days we want to keep the item before we should use it. The goal is to use before the perishable limit which may or may not be the expiration date.

    // Containers are a singleton
    constructor(
        item :IItemObj,
    ) {
        this.name = item.name
        this.putAwayTime = item.putAwayTime
        this.takeOutTime = item.takeOutTime
        this.cleanSteps = item.cleanSteps
        this.quantity = item.quantity
        this.wash = item.wash
        this.isTakeoutUnitable = item.isTakeoutUnitable
        this.isMeatProduct = item.isMeatProduct
        this.nutrition = item.nutrition
        this.unit = item.unit
        this.purchaseLinks = item.purchaseLinks
        this.perishableLimit = item.perishableLimit
    }

    public seasonWith(ingredients: Ingredient[]): IStep {
        const addIStep = istep()

        addIStep.text = ['Season', s.turnIngObjIntoStr(this, true), 'with the following'].join(' ')
        addIStep.ingredients.push(this)
        addIStep.disappearWhen = 'childrenGone'
        ingredients.forEach((ingredient) => {
            const addIngredient = istep()
            addIngredient.ingredients.push(ingredient)
            addIngredient.text = [s.lazyIngredientIdx, addIngredient.ingredients.length-1].join(' ')
            addIngredient.time += ingredient.takeOutTime
            addIStep.children.push(addIngredient)
        })

        return addIStep
    }

    public mixIn(ingredients: Ingredient[]): IStep {
        const addIStep = istep()

        addIStep.text = ['Mix in', s.turnIngObjIntoStr(this, true), 'with the following'].join(' ')
        addIStep.ingredients.push(this)
        addIStep.disappearWhen = 'childrenGone'
        ingredients.forEach((ingredient) => {
            const addIngredient = istep()
            addIngredient.ingredients.push(ingredient)
            addIngredient.text = [s.lazyIngredientIdx, addIngredient.ingredients.length-1].join(' ')
            addIngredient.time += ingredient.takeOutTime
            addIStep.children.push(addIngredient)
        })

        return addIStep
    }

    public flip(): IStep {
        const addIStep = istep()

        addIStep.text = ['Flip the', this.name].join('' )

        addIStep.ingredients.push(this)
        return addIStep;
    }

    public cutInHalf(): IStep {
        const addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Cut', this.quantity, this.unit.name, this.name, 'in half'].join(' ')
        } else {
            addIStep.text = ['Cut the', this.name, 'in half'].join(' ')
        }
        addIStep.ingredients.push(this)
        addIStep.equipment.push(e.cuttingBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public peel(): IStep {
        const addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Peel', this.quantity, this.unit.name, this.name].join(' ')
        } else {
            addIStep.text = ['Peel the', this.name].join(' ')
        }
        addIStep.ingredients.push(this)
        addIStep.equipment.push(e.peeler())

        return addIStep;
    }

    public dice(): IStep {
        const addIStep = istep()

        if (this.quantity && this.unit && this.unit.name) {
            addIStep.text = ['Dice', this.quantity, this.unit.name, this.name].join(' ')
        } else {
            addIStep.text = ['Dice the', this.name].join(' ')
        }

        addIStep.ingredients.push(this)
        addIStep.equipment.push(e.cuttingBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public mince(): IStep {
        const addIStep = istep()

        if (this.quantity && this.unit && this.unit.name) {
            addIStep.text = ['Mince', this.quantity, this.unit.name, this.name].join(' ')
        } else {
            addIStep.text = ['Mince the', this.name].join(' ')
        }

        addIStep.ingredients.push(this)
        addIStep.equipment.push(e.cuttingBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public cutIntoStrips(): IStep {
        const addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Cut',  this.quantity, this.unit.name, this.name, 'into strips'].join(' ')
        } else {
            addIStep.text = ['Cut the', this.name, 'into strips'].join(' ')
        }
        addIStep.equipment.push(e.cuttingBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public cutIntoHalfInchStrips(): IStep {
        const addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Cut',  this.quantity, this.unit.name, this.name, 'into half inch strips'].join(' ')
        } else {
            addIStep.text = ['Cut the', this.name, 'into half inch strips'].join(' ')
        }
        addIStep.equipment.push(e.cuttingBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public cutIntoThinSlices(): IStep {
        const step = istep();

        // Build the text dynamically
        const parts = ['Slice'];
        if (this.quantity && this.unit) {
            parts.push(this.quantity.toString(), this.unit.name);
        }
        parts.push(this.name, 'thinly');
        step.text = parts.join(' ');

        // Add required equipment
        step.equipment.push(e.cuttingBoard(), e.knife());

        return step;
    }

    public cutIntoSlices(): IStep {
        const addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Cut',  this.quantity, this.unit.name, this.name, 'into slices'].join(' ')
        } else {
            addIStep.text = ['Cut the', this.name, 'into slices'].join(' ')
        }
        addIStep.equipment.push(e.cuttingBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public patDry(): IStep {
        const addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Pat',  this.quantity, this.unit.name, this.name, 'dry with paper towels'].join(' ')
        } else {
            addIStep.text = ['Pat', this.name, 'dry with paper towels'].join(' ')
        }

        return addIStep;
    }
}
