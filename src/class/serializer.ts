import { IItemObj, Item } from './ingredients/item';
import { Units as u } from '../constants/units';

export class Serializer {
    public static turnIngObjIntoStr(ingObj: IItemObj | Item, includeUnit = false): string {
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
        let unitQuantity: String = '';
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

        let quantityString: string = `${quantity}`;

        if (`${quantity}`.endsWith('.75')) {
          quantityString = `${quantity-.75}¾`;
        }
        if (`${quantity}`.endsWith('.5')) {
          quantityString = `${quantity-.5}½`;
        }
        if (`${quantity}`.endsWith('.33')) {
          quantityString = `${quantity-.33}⅓`;
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
          unitString = `${unitString}s`;
        }

        return `${quantityString} ${unitString}`;
     }
}
