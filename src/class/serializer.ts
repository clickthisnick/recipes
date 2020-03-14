import { IItemObj } from './ingredients/item';
import { Units as u } from '../constants/units';

export class Serializer {
    public static turnIngObjIntoStr(ingObj: IItemObj, includeUnit = false): string {
        // If unit is noUnitQuantity just display the name
        if (ingObj.unit !== null && ingObj.unit.name === u.noUnitQuantity.name) {
            return ingObj.name;
        }

        // Return the name if unit is "unit"
        if (ingObj.unit !== null) {
          if (ingObj.unit.name === u.unit.name) {
            if (ingObj.quantity > 1) {
                return `${ingObj.quantity} ${ingObj.name}s`;
            }

            return `${ingObj.name}`;
          }
        }

        // Any quantity over 1 is considered many
        const ingName = ingObj.quantity > 1 ? `${ingObj.name}s` : ingObj.name;

        // Return the correct unit
        let unitQuantity: String = '';
        if (includeUnit && ingObj.unit !== null) {
          unitQuantity = this.convertUnitIntoStr(ingObj.unit.name, ingObj.quantity);
        }

        return `${unitQuantity} ${ingName}`;
    }

    public static convertUnitIntoStr(unit: string, quantity: number): string {
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