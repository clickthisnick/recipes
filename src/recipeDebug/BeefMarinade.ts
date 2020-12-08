import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'BeefMarinade'
        this.variations = [
            OneLbBeefMarinade, TwoLbBeefMarinade
        ]
     }
}

export class TwoLbBeefMarinade extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['This recipe is for 2 lb of meat']),
            e.bowl().add([
                i.appleCiderVinegar(.25, u.cup),
                i.aminosCoconut(.25, u.cup),
                i.avacadoOil(2, u.tbsp),
                i.garlicPowder(2, u.tsp),
                i.blackPepper(2, u.tsp),
                i.onionPowder(1, u.tsp),
                i.paprika(1, u.tsp),
                //i.seaSalt(.5, u.tsp),
            ]),
        ];
    }
}

export class OneLbBeefMarinade extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['This recipe is for 1 lb of meat']),
            e.bowl().add([
                i.appleCiderVinegar(1/8, u.cup),
                i.aminosCoconut(1/8, u.cup),
                i.avacadoOil(1, u.tbsp),
                i.garlicPowder(1, u.tsp),
                i.blackPepper(1, u.tsp),
                i.onionPowder(.5, u.tsp),
                i.paprika(.5, u.tsp),
                //i.seaSalt(.25, u.tsp),
            ]),
        ];
    }
}
