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
    name!: string
    putAwayTime!: number
    takeOutTime!: number
    cleanSteps!: string
    quantity!: number
    unit!: IUnitObj
    wash!: boolean
    isTakeoutUnitable!: boolean
    isMeatProduct!: boolean
    nutrition!: any
    purchaseLinks!: IStorePurchaseLink
    perishableLimit!: number

    constructor(item: any) {
        Object.assign(this, item)
    }

    // ------------------------
    // HELPERS
    // ------------------------

    private hasAmount(): boolean {
        return !!(this.quantity && this.unit && this.unit.name)
    }

    private formatName(): string {
        return this.hasAmount()
            ? `${this.quantity} ${this.unit.name} ${this.name}`
            : `the ${this.name}`
    }

    private createStep(
        textParts: (string | number)[],
        opts?: {
            includeSelf?: boolean
            equipment?: any[]
        }
    ): IStep {
        const step = istep()

        step.text = textParts.join(' ').replace(/\s+/g, ' ').trim()

        if (opts?.includeSelf !== false) {
            step.ingredients.push(this)
        }

        if (opts?.equipment) {
            step.equipment.push(...opts.equipment)
        }

        return step
    }

    private knifeTools() {
        return [e.cuttingBoard(), e.knife()]
    }

    private combineAction(action: string, ingredients: Ingredient[]): IStep {
        const step = istep()

        step.text = `${action} ${s.turnIngObjIntoStr(this, true)} with the following`
        step.ingredients.push(this)
        step.disappearWhen = 'childrenGone'

        ingredients.forEach((ingredient) => {
            const child = istep()
            child.ingredients.push(ingredient)
            child.text = `${s.lazyIngredientIdx} ${child.ingredients.length - 1}`
            child.time += ingredient.takeOutTime
            step.children.push(child)
        })

        return step
    }

    // ------------------------
    // GROUP ACTIONS
    // ------------------------

    public seasonWith(ingredients: Ingredient[]): IStep {
        return this.combineAction('Season', ingredients)
    }

    public mixIn(ingredients: Ingredient[]): IStep {
        return this.combineAction('Mix in', ingredients)
    }

    // ------------------------
    // SIMPLE ACTIONS
    // ------------------------

    public flip(): IStep {
        return this.createStep(['Flip the', this.name])
    }

    public cutInHalf(): IStep {
        return this.createStep(
            ['Cut', this.formatName(), 'in half'],
            { equipment: this.knifeTools() }
        )
    }

    public peel(): IStep {
        return this.createStep(
            ['Peel', this.formatName()],
            { equipment: [e.peeler()] }
        )
    }

    public juice(): IStep {
        return this.createStep(
            ['Juice', this.formatName()],
            { equipment: [e.knife()] }
        )
    }

    public chop(): IStep {
        return this.createStep(
            ['Chop', this.formatName()],
            { equipment: this.knifeTools() }
        )
    }

    public cube(): IStep {
        return this.createStep(
            ['Cube', this.formatName()],
            { equipment: this.knifeTools() }
        )
    }

    public rinse(): IStep {
        return this.createStep(
            ['Rinse', this.formatName()],
            { equipment: this.knifeTools() }
        )
    }

    public dice(): IStep {
        return this.createStep(
            ['Dice', this.formatName()],
            { equipment: this.knifeTools() }
        )
    }

    public mince(): IStep {
        return this.createStep(
            ['Mince', this.formatName()],
            { equipment: this.knifeTools() }
        )
    }

    public cutIntoStrips(): IStep {
        return this.createStep(
            ['Cut', this.formatName(), 'into strips'],
            { equipment: this.knifeTools() }
        )
    }

    public cutIntoOneInchPieces(): IStep {
        return this.createStep(
            ['Cut', this.formatName(), 'into one inch pieces'],
            { equipment: this.knifeTools() }
        )
    }

    public cutIntoHalfInchStrips(): IStep {
        return this.createStep(
            ['Cut', this.formatName(), 'into half inch strips'],
            { equipment: this.knifeTools() }
        )
    }

    public cutIntoThinSlices(): IStep {
        return this.createStep(
            ['Slice', this.formatName(), 'thinly'],
            { equipment: this.knifeTools() }
        )
    }

    public cutIntoSlices(): IStep {
        return this.createStep(
            ['Cut', this.formatName(), 'into slices'],
            { equipment: this.knifeTools() }
        )
    }

    public patDry(): IStep {
        return this.createStep(
            ['Pat', this.formatName(), 'dry with paper towels']
        )
    }
}