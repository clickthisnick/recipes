import { IUnitObj } from '../../constants/units';

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
    nutrition: any; // Dict
}

export interface IItem {
    (quantity?: number, unit?: IUnitObj): IItemObj;
}
