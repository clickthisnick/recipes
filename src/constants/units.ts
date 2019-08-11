export interface IUnitObj {
    name: string;
}

export class Units {
    public static readonly cup: IUnitObj = {
        name: 'x (1 Cup)'
    };
    public static readonly dash: IUnitObj = {
        name: 'dash'
    };
    public static readonly noUnitQuantity: IUnitObj = {
        name: ''
    };
    public static readonly halfCup: IUnitObj = {
        name: 'x (1/2 Cup)'
    };
    public static readonly thirdCup: IUnitObj = {
        name: 'x (1/3 Cup)'
    };
    public static readonly fourthCup: IUnitObj = {
        name: 'x (1/4 Cup)'
    };
    public static readonly tsp: IUnitObj = {
        name: 'x (1 tsp)'
    };
    public static readonly tbsp: IUnitObj = {
        name: 'x (1 tbsp)'
    };
    public static readonly seconds: IUnitObj = {
        name: 'Seconds'
    };
    public static readonly pounds: IUnitObj = {
        name: 'Pounds'
    };
}
