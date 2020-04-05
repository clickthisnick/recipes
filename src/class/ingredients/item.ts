import { IUnitObj } from '../../constants/units';

export interface IEstimates {
    calories?: number;
    sodium?: number;
    cost?: number;
}

export interface IEstimatesMissing {
    calories: string[];
    sodium: string[];
    cost: string[];
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
