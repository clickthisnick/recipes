import { Ingredient } from './ingredients/ingredient';
import { Units as u } from '../constants/units';
import { IStep } from './step';

export interface IsDifferentSpellingMap {
  [name: string]: string;
}

export class Serializer {
    public static turnIngObjIntoStr(ingObj: Ingredient, includeUnit = false): string {
        // lowercase the name so it doesn't look weird
        ingObj.name = ingObj.name.toLowerCase()
        // If unit is noUnitQuantity just display the name
        if (ingObj.unit && ingObj.unit.name === u.noUnitQuantity.name) {
            return ingObj.name;
        }

        // Return the name if unit is "unit"
        if (ingObj.unit) {
          if (ingObj.unit.name === u.unit.name) {
            if (ingObj.quantity > 1) {
              const nameSplit = ingObj.name.split(' ')
              // Special plural spelling
              if (["tomato"].includes(nameSplit[nameSplit.length - 1])) {
                return `${ingObj.quantity} ${ingObj.name}es`;
              } else {
                return `${ingObj.quantity} ${ingObj.name}s`;
              }
            }

            return `${ingObj.name}`;
          }
        }

        // Any quantity over 1 is considered many
        // const ingName = ingObj.quantity > 1 ? `${ingObj.name}s` : ingObj.name;
        // The unit gets the plural not the item itself
        const ingName = ingObj.name;

        // Return the correct unit
        let unitQuantity = '';
        if (includeUnit && ingObj.unit) {
          unitQuantity = this.convertUnitIntoStr(ingObj.unit.name, ingObj.quantity);
        }

        return `${unitQuantity} ${ingName}`;
    }

    public static convertUnitIntoStr(unit: string, quantity: number): string {
        if (quantity === 0) return '';

        // Map of fractions to Unicode characters
        const fractionMap: Record<number, string> = {
            0.125: '⅛',
            0.25: '¼',
            0.33: '⅓',
            0.3333333333333333: '⅓',
            0.5: '½',
            0.75: '¾',
        };

        // Map of units with irregular plurals
        const differentSpellingMap: Record<string, string> = {
            dash: 'dashes',
        };

        // Split quantity into integer and fractional part
        const integerPart = Math.floor(quantity);
        const fractionPart = quantity - integerPart;

        // Find closest fraction
        let fractionStr = '';
        for (const [key, value] of Object.entries(fractionMap)) {
            if (Math.abs(fractionPart - Number(key)) < 0.01) {
                fractionStr = value;
                break;
            }
        }

        // Build quantity string and remove leading zero if present
        const quantityString = `${integerPart}${fractionStr}`.replace(/^0/, '');

        // Handle pluralization
        let unitString = quantity > 1
            ? differentSpellingMap[unit] || `${unit}s`
            : unit;

        return `${quantityString} ${unitString}`.trim();
    }


  //   public static genericAddArray(ingredients: Ingredient[], ): IStep {
  //     const addIStep = istep()

  //     function hydrateIStep(addIngredient: IStep, ingredient: Ingredient) {
  //         addIngredient.ingredients.push(ingredient)
  //         addIngredient.text = [Serializer.lazyIngredientIdx, addIngredient.ingredients.length-1].join(' ')
  //         addIngredient.time += ingredient.takeOutTime
  //         addIStep.children.push(addIngredient)

  //         // If the unit is an equipment like a cup, then add it to the equipment
  //         if (ingredient.unit && ingredient.unit.isEquipment) {
  //             const str_ = (ingredient.unit.equipmentUnits.includes(ingredient.unit.quantity)) ? `${ingredient.unit.quantity} ${ingredient.unit.properName}` : ingredient.unit.properName
  //             addIngredient.equipment.push(str_)
  //         }
  //     }

  //     let bindingWord = 'the'
  //     // If its the first
  //     if (this.firstAction) {
  //         if (['a','e','i','o','u'].includes(this.name[0])) {
  //             bindingWord = 'an'
  //         } else {
  //             bindingWord = 'a'
  //         }
  //         this.firstAction = false;
  //     }

  //     addIStep.text = ['Add the following to', bindingWord, this.name].join(' ')
  //     addIStep.disappearWhen = 'childrenGone'
  //     ingredients.forEach((ingredient) => {
  //         const addIngredient = istep()
  //         hydrateIStep(addIngredient, ingredient)
  //     })

  //     return addIStep
  // }

    public static lazyIngredientIdx = "LAZYLOADEDiidx"

    public static parseLazyLoad(steps: IStep[]) {
        // Lazily fill out any action text arrays like (.add) with the ingredient at the end
        // TODO this really needs an overhaul everything is sort of just hardcoded to work
        steps.forEach(stepz => {
          if (stepz.hasOwnProperty("children")) {
              stepz.children.forEach(child => {
                  if (child.text.startsWith(Serializer.lazyIngredientIdx)) {
                    const idx = parseInt(child.text.substring(Serializer.lazyIngredientIdx.length+1))
                    child.text = ['•', Serializer.turnIngObjIntoStr(child.ingredients[idx], true)].join(' ')
                  }
              })
          }
      })
    }
}
