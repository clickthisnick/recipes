import { IUnitObj } from '../../constants/units';

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
    }

    public season(ingredients: any): any {
        if (Array.isArray(ingredients)) {
            let finalArray: any = [];
            
            finalArray.push(['Season', this.name, 'with the following'])

            ingredients.forEach((ingredient) => {
                finalArray.push(['  >   ', ingredient])
            })

            return finalArray
        }

        return ['Season', this.name, 'with', ingredients]
    }

    public mixIn(ingredients: any): any {
        return ['Mix in', ingredients, 'with', this.name]
    }
}