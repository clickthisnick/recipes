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
                return `${ingObj.quantity} ${ingObj.name}s`;
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
        // Dont return a quantity or unit if you just want the name using 0
        if (quantity === 0) {
          return '';
        }

        const sDifferentSpellingMap: IsDifferentSpellingMap  = {
          "dash": "dashes",
        }

        let quantityString = `${quantity}`;

        if (`${quantity}`.endsWith('.75')) {
          quantityString = `${quantity-.75}¾`;
        }
        if (`${quantity}`.endsWith('.5')) {
          quantityString = `${quantity-.5}½`;
        }
        if (`${quantity}`.endsWith('.33')) {
          quantityString = `${quantity-.33}⅓`;
        }
        if (`${quantity}`.endsWith('.3333333333333333')) {
          quantityString = `${quantity-.3333333333333333}⅓`;
        }
        if (`${quantity}`.endsWith('.25')) {
          quantityString = `${quantity-.25}¼`;
        }
        if (`${quantity}`.endsWith('.125')) {
          quantityString = `${quantity-.125}⅛`;
        }

        if (quantityString.startsWith('0')) {
          quantityString = quantityString.substring(1);
        }

        let unitString: string = unit;

        if (quantity > 1) {
          if (unitString in sDifferentSpellingMap) {
              unitString = sDifferentSpellingMap[unitString];
          } else {
            unitString = `${unitString}s`
          }
        }

        return `${quantityString} ${unitString}`;
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
