import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            Sausage, Chicken
        ]
    }
}

export class Sausage extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Seasoning for 1 lb of pork']),
            e.bowl().add([
                i.parsley(2, u.tsp),
                //i.italianSeasoning(2, u.tsp),
                i.marjoram(1, u.tsp),
                i.blackPepper(1.5, u.tsp),
                i.wholeFennelSeeds(.5, u.tsp),
                i.paprika(.5, u.tsp),
                i.redPepperFlakes(1, u.tsp),
                // i.salt(2, u.tsp),
                i.salt(.5, u.tsp),
                i.garlicClove(1, u.tsp),
                i.onionGranules(1, u.tsp),
            ]),
            text.set(['Air tight 8 ounces into freezer safe bags'])
        ];
    }
}

export class Chicken extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Seasoning for Add 1/3 of 14 oz tofu to every 1.5 lb of chicken']),
            text.set(['Seasoning for 1.5 lb of chicken']),
            e.bowl().add([
                i.chilliPowder(3, u.tsp),
                i.onionGranules(2, u.tsp),
                i.paprika(1, u.tsp),
                i.garlicGranules(1, u.tsp),
                i.cumin(1, u.tsp),
                i.blackPepper(10, u.crack),
            ]),
            text.set(['Air tight 8 ounces into freezer safe bags'])
        ];
    }
}
