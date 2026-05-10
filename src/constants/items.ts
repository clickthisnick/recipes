import { AnimalItems } from '../class/ingredients/animal';
import { CarbItems } from '../class/ingredients/carb';
import { FruitItems } from '../class/ingredients/fruit';
import { OilItems } from '../class/ingredients/oil';
import { SauceItems } from '../class/ingredients/sauce';
import { SpiceItems } from '../class/ingredients/spice';
import { VegetableItems } from '../class/ingredients/vegetable';

import { IUnitObj, Units } from './units';
import {
    IItemObj,
    IPurchaseLink,
    IStorePurchaseLink,
    Ingredient,
} from '../class/ingredients/ingredient';

type ItemFactory = (quantity?: number, unit?: IUnitObj) => Ingredient;

type ItemGroupMap = {
    chicken: ItemFactory;
    mushroom: ItemFactory;
    onion: ItemFactory;
    cheese: ItemFactory;
};

function ingredient(
    name: string,
    quantity = 0,
    unit: IUnitObj = Units.none,
    purchaseLinks: IStorePurchaseLink = {}
): Ingredient {
    const item: IItemObj = {
        name,
        putAwayTime: 10,
        takeOutTime: 10,
        cleanSteps: '',
        quantity,
        unit,
        wash: false,
        isTakeoutUnitable: false,
        isMeatProduct: false,
        purchaseLinks,
        perishableLimit: 0,
        nutrition: {},
    };

    return new Ingredient(item);
}

const BaseItems = {
    ...AnimalItems,
    ...CarbItems,
    ...FruitItems,
    ...OilItems,
    ...SauceItems,
    ...SpiceItems,
    ...VegetableItems,

    ingredient,
};

function returnItem(
    itemName: string,
    quantity: number,
    unit: IUnitObj,
    subItems: Ingredient[]
): Ingredient {
    const mainItem = BaseItems.ingredient(itemName, quantity, unit);
    let lowestPerishableLimit = 0;

    for (const ingredient of subItems) {
        if (ingredient.isMeatProduct) {
            mainItem.isMeatProduct = ingredient.isMeatProduct;
        }

        if (
            ingredient.perishableLimit &&
            (lowestPerishableLimit === 0 || ingredient.perishableLimit < lowestPerishableLimit)
        ) {
            lowestPerishableLimit = ingredient.perishableLimit;
        }

        const purchaseLinks = ingredient.purchaseLinks;

        if (purchaseLinks && mainItem.purchaseLinks) {
            Object.keys(purchaseLinks).forEach((store) => {
                if (!(store in mainItem.purchaseLinks!)) {
                    mainItem.purchaseLinks![store] = {};
                }

                Object.keys(purchaseLinks[store]).forEach((key) => {
                    const mainItemPurchaseLinks: IPurchaseLink = mainItem.purchaseLinks![store];

                    const itemKey = `${ingredient.name} ${key}`;

                    mainItemPurchaseLinks[itemKey] = purchaseLinks[store][key];
                });
            });
        }
    }

    if (lowestPerishableLimit) {
        mainItem.perishableLimit = lowestPerishableLimit;
    }

    return mainItem;
}

function createGroup(name: string, options: () => Ingredient[]): ItemFactory {
    return (quantity = 0, unit: IUnitObj = Units.none): Ingredient => {
        return returnItem(name, quantity, unit, options());
    };
}

const Groups: ItemGroupMap = {
    chicken: createGroup('chicken', () => [BaseItems.chickenBreast(), BaseItems.chickenThigh()]),

    mushroom: createGroup('mushroom', () => [
        BaseItems.whiteMushroom(),
        BaseItems.babyBellaMushroom(),
    ]),

    onion: createGroup('onion', () => [BaseItems.whiteOnion(), BaseItems.redOnion()]),

    cheese: createGroup('cheese', () => [BaseItems.cheddarCheese(), BaseItems.mozzarellaCheese()]),
};

export const Items = {
    ...BaseItems,
    Groups,
};
