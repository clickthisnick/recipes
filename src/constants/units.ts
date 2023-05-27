import { Ingredient } from '../class/ingredients/ingredient';

export interface IUnitObj {
    name: string;
    isEquipment: boolean;
    properName: string;
    equipmentUnits: string[];
}

export interface Ingredients {
   // Key is the ingredient name
   [name: string]: Ingredient;
}

export class Units {
    public static readonly none: IUnitObj = {
        name: 'none',
        isEquipment: false,
        properName: 'none',
        equipmentUnits: [],
    };
    public static readonly cup: IUnitObj = {
        name: 'cup',
        isEquipment: true,
        properName: 'measuring cup',
        equipmentUnits: ['¼', '⅓', '½', '1'],
    };
    public static readonly ml: IUnitObj = {
        name: 'ml',
        isEquipment: true,
        properName: 'milliliter',
        equipmentUnits: [],
    };
    public static readonly bag: IUnitObj = {
        name: 'bag',
        isEquipment: true,
        properName: 'bag',
        equipmentUnits: [''],
    };
    public static readonly container: IUnitObj = {
        name: 'container',
        isEquipment: true,
        properName: 'container',
        equipmentUnits: [''],
    };
    public static readonly sprigs: IUnitObj = {
        name: 'sprigs',
        isEquipment: false,
        properName: 'sprigs',
        equipmentUnits: [],
    };
    public static readonly spoon: IUnitObj = {
        name: 'spoon',
        isEquipment: true,
        properName: 'spoon',
        equipmentUnits: [''],
    };
    public static readonly bunch: IUnitObj = {
        name: 'bunch',
        isEquipment: false,
        properName: 'bunch',
        equipmentUnits: [],
    };
    public static readonly dash: IUnitObj = {
        name: 'dash',
        isEquipment: false,
        properName: 'dash',
        equipmentUnits: [],
    };
    public static readonly handful: IUnitObj = {
        name: 'handful',
        isEquipment: false,
        properName: 'handful',
        equipmentUnits: [],
    };
    public static readonly clove: IUnitObj = {
        name: 'clove',
        isEquipment: false,
        properName: 'clove',
        equipmentUnits: [],
    };
    public static readonly noUnitQuantity: IUnitObj = {
        name: '',
        isEquipment: false,
        properName: '',
        equipmentUnits: [],
    };
    public static readonly tsp: IUnitObj = {
        name: 'tsp',
        isEquipment: true,
        properName: 'measuring tsp',
        equipmentUnits: ['¼', '⅓', '½', '1'],
    };
    public static readonly tbsp: IUnitObj = {
        name: 'Tbsp',
        isEquipment: true,
        properName: 'measuring tbsp',
        equipmentUnits: ['¼', '⅓', '½', '1'],
    };
    public static readonly stick: IUnitObj = {
        name: 'stick',
        isEquipment: false,
        properName: 'stick',
        equipmentUnits: [],
    };
    public static readonly strand: IUnitObj = {
        name: 'strand',
        isEquipment: false,
        properName: 'strand',
        equipmentUnits: [],
    };
    public static readonly second: IUnitObj = {
        name: 'second',
        isEquipment: false,
        properName: 'second',
        equipmentUnits: [],
    };
    public static readonly pound: IUnitObj = {
        name: 'pound',
        isEquipment: false,
        properName: 'pound',
        equipmentUnits: [],
    };
    public static readonly ounce: IUnitObj = {
        name: 'ounce',
        isEquipment: false,
        properName: 'ounce',
        equipmentUnits: [],
    };
    public static readonly gram: IUnitObj = {
        name: 'gram',
        isEquipment: false,
        properName: 'gram',
        equipmentUnits: [],
    };
    public static readonly fluid_ounce: IUnitObj = {
        name: 'fluid ounce',
        isEquipment: false,
        properName: 'fluid_ounce',
        equipmentUnits: [],
    };
    public static readonly lemon: IUnitObj = {
        name: 'lemon',
        isEquipment: false,
        properName: 'lemon',
        equipmentUnits: [],
    };
    public static readonly unit: IUnitObj = {
        name: 'unit',
        isEquipment: false,
        properName: 'unit',
        equipmentUnits: [],
    };
    public static readonly half: IUnitObj = {
        name: 'half',
        isEquipment: false,
        properName: 'unit',
        equipmentUnits: [],
    };
    public static readonly slice: IUnitObj = {
        name: 'slice',
        isEquipment: false,
        properName: 'slice',
        equipmentUnits: [],
    };
    public static readonly scoop: IUnitObj = {
        name: 'scoop',
        isEquipment: false,
        properName: 'scoop',
        equipmentUnits: [],
    };
    public static readonly crack: IUnitObj = {
        name: 'crack',
        isEquipment: false,
        properName: 'crack',
        equipmentUnits: [],
    };

    public static readonly inches: IUnitObj = {
        name: 'inches',
        isEquipment: false,
        properName: 'inches',
        equipmentUnits: [],
    };

    public static readonly thousandSecondCounts: IUnitObj = {
        name: 'thousand second counts',
        isEquipment: false,
        properName: 'thousandSecondCounts',
        equipmentUnits: [],
    };

    private static conversionTable = {
        [Units.cup.name]: {
            [Units.tsp.name]: {
                count: 1/48, // 48 tsp in a cup
            },
            [Units.tbsp.name]: {
                count: 1/16, // 16 tbsp in a cup
            },
            [Units.ounce.name]: {
                count: 1/8, // 8 ounce in a cup
            }
        },
        [Units.ounce.name]: {
            [Units.cup.name]: {
                count: 1/8, // 8 ounce in a cup
            },
            [Units.pound.name]: {
                count: 16, // 16 ounce in a pound
            }
        },
        [Units.pound.name]: {
            [Units.cup.name]: {
                count: 1/128, // 1/128 pound in a cup
            },
            [Units.ounce.name]: {
                count: 1/16, // 1/16 pound in an ounce
            }
        },
        [Units.tbsp.name]: {
            [Units.cup.name]: {
                count: 16, // 16 tbsp in a cup
            },
            [Units.tsp.name]: {
                count: 1/3, // 1/3 tbsp in a tsp
            }
        },
        [Units.tsp.name]: {
            [Units.cup.name]: {
                count: 48, // 48 tsp in a cup
            },
            [Units.tbsp.name]: {
                count: 3, // 3 tsp in a tbp
            }
        }
    }

    public static setPricingTable(ingredient: Ingredient) {
        // Builds out a complete pricing table for every compatible unit on the ingredient itself

        // First check if there are any purchaseLinks which include the pricing data...
        if (!ingredient.purchaseLinks) {
            return
        }

        Object.keys(ingredient.purchaseLinks).forEach(storeKey => {
            const store = ingredient.purchaseLinks[storeKey]

            Object.keys(store).forEach(purchaseDescription => {
                const purchaseArray = store[purchaseDescription]

                purchaseArray.forEach(purchase => {
                    purchase.priceConversionTable = {}

                    // We need to take the price and divide by the quantity unit to get a price per unit
                    purchase.priceConversionTable[purchase.quantity_unit.name] = (purchase.price / purchase.quantity).toFixed(3)

                    // This is the base cost per unit of quantity. We need to multiple this by the unit conversion rate to get the price per other units
                    const baseQuantityPrice = purchase.priceConversionTable[purchase.quantity_unit.name]

                    // If there's no conversion for this unit just return. We have done all that we can do
                    if (!this.conversionTable.hasOwnProperty(purchase.quantity_unit.name)) {
                        return
                    }

                    // Now also set the price for every known conversion for the unit
                    Object.keys(this.conversionTable[purchase.quantity_unit.name]).forEach(convertableUnitName => {
                        const conversionRate = this.conversionTable[purchase.quantity_unit.name][convertableUnitName]

                        let pricePerUnit = 0

                        pricePerUnit = baseQuantityPrice * conversionRate.count

                        if (pricePerUnit !== 0) {
                            purchase.priceConversionTable[convertableUnitName] = pricePerUnit.toFixed(3)
                        }

                    })
                });
            });
        });
    }

    public static combineIngredientUnits(ingredient_1: Ingredient, ingredient_2: Ingredient) {
        // Returns the common unit and amount between two ingredients

        function isWholeNumber(n) {
            return (n - Math.floor(n)) === 0;
        }

        function convert(conversion, ingredient) {
            // This converts the ingredient to the same unit as the conversion
            return ingredient.quantity * conversion.count
        }

        // Throw an error if a conversion is missing
        if (!Units.conversionTable.hasOwnProperty(ingredient_1.unit.name)) {
            throw new Error(`Unit conversion table does not have ${ingredient_1.unit.name}`)
        }

        if (!Units.conversionTable[ingredient_1.unit.name].hasOwnProperty(ingredient_2.unit.name)) {
            throw new Error(`Unit conversion table for ${ingredient_1.unit.name} does not have ${ingredient_2.unit.name}`)
        }

        // If I convert unit 1 into 2 what is it
        const one_two_conversion = Units.conversionTable[ingredient_1.unit.name][ingredient_2.unit.name]

        // If I convert unit 2 into 1 what is it
        const two_one_conversion = Units.conversionTable[ingredient_2.unit.name][ingredient_1.unit.name]

        const unit_two_amount = convert(one_two_conversion, ingredient_2)
        const unit_one_amount = convert(two_one_conversion, ingredient_1)

        let quantity = 0;
        let unit = ingredient_1.unit;

        // console.log(`unit_two_amount ${unit_two_amount}`)
        // console.log(`unit_two_amount whole ${isWholeNumber(unit_two_amount)}`)
        // console.log(`unit_one_amount ${unit_one_amount}`)
        // console.log(`unit_one_amount whole ${isWholeNumber(unit_one_amount)}`)

        // Use whatever unit is a whole number and the least amount
        if (isWholeNumber(unit_two_amount) && isWholeNumber(unit_one_amount)) {
            if (unit_two_amount < unit_one_amount) {
                quantity = unit_two_amount + ingredient_1.quantity
                unit = ingredient_1.unit
            } else {
                quantity = unit_one_amount + ingredient_2.quantity
                unit = ingredient_2.unit
            }
        } else if (isWholeNumber(unit_two_amount) && unit_two_amount <= 5) { // If unit two is a whole number and its not more than 3 (pain in the butt)
            quantity = unit_two_amount + ingredient_1.quantity
            unit = ingredient_1.unit
        } else if (isWholeNumber(unit_one_amount) && unit_one_amount <= 5) { // If unit one is a whole number and its not more than 3 (pain in the butt)
            quantity = unit_one_amount + ingredient_2.quantity
            unit = ingredient_2.unit
        } else { // If no whole numbers under 3 then just return empty object
            return false
        }

        return {
            quantity: quantity,
            unit: unit
        }
    }
}
