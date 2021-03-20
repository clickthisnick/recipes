// This appears to be unused, but it is used as the init point of all items which extend it

import { VegetableItems } from '../class/ingredients/vegetable';
import { IUnitObj } from './units';
import { Items as i } from './items';
import { Item } from '../class/ingredients/item';

function returnItem(itemName, quantity, unit, subItems: Item[]) {
    // This functions attempts to take a group of items, and returns a singular item back
    // The reason why it exists is if you have a recipe that just needs "meat" but you don't care if its chickenThighs or beef
    // Then you can use this to just return meat, then in shopping mode - you get all the options for "meat" and you can choose the one you best see fit at the time
    const mainItem = i.item(itemName, quantity, unit)
    let lowestPerishableLimit: number | undefined = undefined;

    for (let idx = 0; idx < subItems.length; idx++) {
        const ingredient = subItems[idx];

        // Set if its a meat product
        if (ingredient.isMeatProduct) {
            mainItem.isMeatProduct = ingredient.isMeatProduct;
        }

        // Set a perishable limit from the lowest limit of the group of items
        // Since its a group it _should_ roughly be the same though
        if (lowestPerishableLimit === undefined) {
            if (ingredient.perishableLimit) {
                lowestPerishableLimit = ingredient.perishableLimit;
            }
        } else {
            if (ingredient.perishableLimit) {
                if (ingredient.perishableLimit < lowestPerishableLimit) {
                    lowestPerishableLimit = ingredient.perishableLimit;
                }
            }
        }

        const puchaseLinks = ingredient.purchaseLinks;
        if (puchaseLinks) {
            Object.keys(puchaseLinks).forEach(element => {
                if (mainItem.purchaseLinks) {
                    const linkKey = ingredient.name + ' ' + element;
                    mainItem.purchaseLinks[linkKey] = puchaseLinks[element];
                }
            })
        }

        if (lowestPerishableLimit) {
            mainItem.perishableLimit = lowestPerishableLimit;
        }

    }

    return mainItem;
}

export class Items extends VegetableItems {
    public static readonly Groups = {
        chicken: (quantity: number = 0, unit: IUnitObj | null = null) => {
            return returnItem('chicken', quantity, unit, [
                i.chickenBreast(),
                i.chickenThigh(),
            ])
        },
        mushroom: (quantity: number = 0, unit: IUnitObj | null = null) => {
            return returnItem('mushroom', quantity, unit, [
                i.whiteMushroom(),
                i.babyBellaMushroom(),
            ])
        },
        onion: (quantity: number = 0, unit: IUnitObj | null = null) => {
            return returnItem('onion', quantity, unit, [
                i.whiteOnion(),
                i.redOnion(),
            ])
        }
    }
}
