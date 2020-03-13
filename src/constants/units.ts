export interface IUnitObj {
    name: string;
}

export class Units {
    public static readonly cup: IUnitObj = {
        name: 'cup'
    };
    public static readonly dash: IUnitObj = {
        name: 'dash'
    };
    public static readonly noUnitQuantity: IUnitObj = {
        name: ''
    };
    public static readonly tsp: IUnitObj = {
        name: 'tsp'
    };
    public static readonly tbsp: IUnitObj = {
        name: 'tbsp'
    };
    public static readonly second: IUnitObj = {
        name: 'second'
    };
    public static readonly pound: IUnitObj = {
        name: 'pound'
    };
    public static readonly ounce: IUnitObj = {
        name: 'ounce'
    };
    public static readonly unit: IUnitObj = {
        name: 'unit'
    };
    public static readonly slice: IUnitObj = {
        name: 'slice'
    };
}
