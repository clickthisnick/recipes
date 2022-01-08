import { IUnitObj } from '../../constants/units';
import { IStep, istep } from '../step';
import { Serializer as s } from '../serializer';
import { Equipment as e } from '../equipment';

export interface IEstimates {
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

interface IStorePurchaseLink {
    [store: string]: IPurchaseLink,
}

interface IPurchaseLink {
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
    unit: IUnitObj | null;
    wash: boolean;
    isTakoutUnitable: boolean;
    isMeatProduct: boolean;
    nutrition: INutrition;
}

export interface IItem {
    (quantity?: number, unit?: IUnitObj): IItemObj;
}

export class Ingredient {
    name: string
    putAwayTime: number
    takeOutTime: number
    cleanSteps: string
    quantity: number
    unit: IUnitObj
    wash: boolean
    isTakoutUnitable: boolean
    isMeatProduct: boolean
    nutrition: any
    purchaseLinks: IStorePurchaseLink
    perishableLimit?: number // The number of days we want to keep the item before we should use it. The goal is to use before the perishable limit which may or may not be the expiration date.

    // Containers are a singleton
    constructor(
        name: string,
        putAwayTime: number,
        takeOutTime: number,
        cleanSteps: string,
        quantity: number,
        wash: boolean,
        isTakoutUnitable: boolean,
        isMeatProduct: boolean,
        nutrition: any,
        unit: IUnitObj,
        purchaseLinks: IStorePurchaseLink,
        perishableLimit?: number,
    ) {
        this.name = name
        this.putAwayTime = putAwayTime
        this.takeOutTime = takeOutTime
        this.cleanSteps = cleanSteps
        this.quantity = quantity
        this.wash = wash
        this.isTakoutUnitable = isTakoutUnitable
        this.isMeatProduct = isMeatProduct
        this.nutrition = nutrition
        this.unit = unit
        this.purchaseLinks = purchaseLinks
        this.perishableLimit = perishableLimit
    }

    public seasonWith(ingredients: any): IStep {
        let addIStep = istep()

        if (Array.isArray(ingredients)) {
            addIStep.text = ['Season', s.turnIngObjIntoStr(this, true), 'with the following'].join(' ')
            addIStep.ingredients.push(this)
            addIStep.disappearWhen = 'childrenGone'
            ingredients.forEach((ingredient) => {
                let addIngredient = istep()
                addIngredient.text = ['•', s.turnIngObjIntoStr(ingredient, true)].join(' ')
                addIngredient.ingredients.push(ingredient)
                addIngredient.time += ingredient.takeOutTime
                addIStep.children.push(addIngredient)
            })

            return addIStep
        }

        addIStep.text = ['Season', this.name, 'with', s.turnIngObjIntoStr(ingredients)].join(' ')
        addIStep.ingredients.push(ingredients)
        return addIStep
    }

    public mixIn(ingredients: any): IStep {
        let addIStep = istep()

        addIStep.text = ['Mix in', ingredients, 'with', this.name].join('' )

        addIStep.ingredients.push(this)
        addIStep.ingredients.push(ingredients)
        return addIStep;
    }

    public flip(): IStep {
        let addIStep = istep()

        addIStep.text = ['Flip the', this.name].join('' )

        addIStep.ingredients.push(this)
        return addIStep;
    }

    public cutInHalf(): IStep {
        let addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Cut', this.quantity, this.unit.name, this.name, 'in half'].join(' ')
        } else {
            addIStep.text = ['Cut the', this.name, 'in half'].join(' ')
        }
        addIStep.ingredients.push(this)
        addIStep.equipment.push(e.cuttinBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public peel(): IStep {
        let addIStep = istep()

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
        let addIStep = istep()

        if (this.quantity && this.unit && this.unit.name) {
            addIStep.text = ['Dice', this.quantity, this.unit.name, this.name].join(' ')
        } else {
            addIStep.text = ['Dice the', this.name].join(' ')
        }

        addIStep.ingredients.push(this)
        addIStep.equipment.push(e.cuttinBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public cutIntoStrips(): IStep {
        let addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Cut',  this.quantity, this.unit.name, this.name, 'into strips'].join(' ')
        } else {
            addIStep.text = ['Cut the', this.name, 'into strips'].join(' ')
        }
        addIStep.equipment.push(e.cuttinBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public cutIntoThinSlices(): IStep {
        let addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Slice',  this.quantity, this.unit.name, this.name, 'thinly'].join(' ')
        } else {
            addIStep.text = ['Slice', this.name, 'thinly'].join(' ')
        }
        addIStep.equipment.push(e.cuttinBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public cutIntoSlices(): IStep {
        let addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Cut',  this.quantity, this.unit.name, this.name, 'into slices'].join(' ')
        } else {
            addIStep.text = ['Cut the', this.name, 'into slices'].join(' ')
        }
        addIStep.equipment.push(e.cuttinBoard())
        addIStep.equipment.push(e.knife())

        return addIStep;
    }

    public patDry(): IStep {
        let addIStep = istep()

        if (this.unit) {
            addIStep.text = ['Pat',  this.quantity, this.unit.name, this.name, 'dry with paper towels'].join(' ')
        } else {
            addIStep.text = ['Pat', this.name, 'dry with paper towels'].join(' ')
        }

        return addIStep;
    }
}
