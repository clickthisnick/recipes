import { IUnitObj } from '../../constants/units';
import { IStep, istep } from '../step';
import { Serializer as s } from '../serializer';
import { Text as text} from '../text';

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

interface IPurchaseLink {
    [store: string]: string[],
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

export class Item {
    name: string
    putAwayTime: number
    takeOutTime: number
    cleanSteps: string
    quantity: number
    unit?: IUnitObj | null
    wash: boolean
    isTakoutUnitable: boolean
    isMeatProduct: boolean
    nutrition: any
    purchaseLinks?: IPurchaseLink
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
        unit?: IUnitObj | null,
        purchaseLinks?: IPurchaseLink,
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

    public season(ingredients: any): IStep {
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

    public mixIn(ingredients: any): any {
        return text.set(['Mix in', ingredients, 'with', this.name])
    }

    public cutInHalf(): any {
        return text.set(['Cut the', this.name, 'in half'])
    }

    public cutIntoStrips(): any {
        return text.set(['Cut the', this.name, 'into strips'])
    }
}