export interface IUnitObj {
    name: string;
}

interface IIngredientsUnits {
    unit: string;
    quantity: number;
}

export interface IAllIngredientUnits {
   [name: string]: IIngredientsUnits[];
}

export class Units {
    public static readonly cup: IUnitObj = {
        name: 'cup'
    };
    public static readonly bunch: IUnitObj = {
        name: 'bunch'
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
        name: 'Tbsp'
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
    public static readonly fluid_ounce: IUnitObj = {
        name: 'fluid ounce'
    };
    public static readonly unit: IUnitObj = {
        name: 'unit'
    };
    public static readonly slice: IUnitObj = {
        name: 'slice'
    };
    public static readonly scoop: IUnitObj = {
        name: 'scoop'
    };

    public static readonly inches: IUnitObj = {
        name: 'inches'
    };

    public static readonly thousandSecondCounts: IUnitObj = {
        name: 'thousand second counts'
    };

    private static smymbolMap = {
        "smallerThanOuter": "multiply",
        "biggerThanOuter": "divide",
    }

    private static conversionTable = {
        [Units.cup.name]: {
            [Units.tsp.name]: {
                count: 48,
                symbol: Units.smymbolMap['smallerThanOuter']
            },
            [Units.tbsp.name]: {
                count: 16,
                symbol: Units.smymbolMap['smallerThanOuter']
            },
            [Units.ounce.name]: {
                count: 8.446808,
                symbol: Units.smymbolMap['smallerThanOuter']
            }
        },
        [Units.ounce.name]: {
            [Units.cup.name]: {
                count: 8.446808,
                symbol: Units.smymbolMap['smallerThanOuter']
            }
        },
        [Units.tbsp.name]: {
            [Units.cup.name]: {
                count: 16,
                symbol: Units.smymbolMap['biggerThanOuter']
            },
            [Units.tsp.name]: {
                count: 3,
                smybol: Units.smymbolMap['smallerThanOuter']
            }
        },
        [Units.tsp.name]: {
            [Units.cup.name]: {
                count: 48,
                symbol: Units.smymbolMap['biggerThanOuter']
            },
            [Units.tbsp.name]: {
                count: 3,
                symbol: Units.smymbolMap['biggerThanOuter']
            }
        }
    }

    public static greatCommonDenominator(allIngredientUnits: IAllIngredientUnits) {
        // Just take the first ingredient unit and call it common
        Object.keys(allIngredientUnits).forEach(key => {
            let ingredientUnits = allIngredientUnits[key];
            let commonUnit = ''
            let commonQuantity = 0;

            ingredientUnits.forEach(ingredientUnit => {
                // Skip if no units
                if (ingredientUnit.unit === null) {
                    if (ingredientUnit.quantity === 0 ) {
                        return;
                    } else {
                        throw new Error(`Ingredient had null unit but not null quantity. ${ingredientUnit}`)
                    }
                }

                // The first actual unit/quantity we find make that the baseline
                if (commonUnit === '') {
                    commonUnit = ingredientUnit.unit;
                    commonQuantity += ingredientUnit.quantity;
                    return
                }

                // If the unit is the same as the commonUnit then just add the quantity
                if (commonUnit == ingredientUnit.unit) {
                    commonQuantity += ingredientUnit.quantity
                    return;
                }
                
                let conversion = Units.conversionTable[ingredientUnit.unit][commonUnit]
    
                if (conversion.symbol == 'multiply') {
                    commonQuantity += ingredientUnit.quantity * conversion.count
                }
    
                if (conversion.symbol == 'divide') {
                    commonQuantity += ingredientUnit.quantity / conversion.count
                } 
            });

            allIngredientUnits[key] = [{
                'unit': commonUnit,
                'quantity': commonQuantity
            }]
        });

        return allIngredientUnits;
    }
}
