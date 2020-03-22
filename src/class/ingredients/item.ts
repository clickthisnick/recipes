import { IUnitObj, ICalorieUnitObj } from '../../constants/units';

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
    calorie: ICalorieUnitObj;
}

export interface IItem {
    (quantity?: number, unit?: IUnitObj): IItemObj;
}
