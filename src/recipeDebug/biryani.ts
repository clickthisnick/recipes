import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'rice';
        this.recipeGroup = c.component;
        this.variations = [
            Biryani
        ]
    }
}

class Biryani extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bowl().add([
                i.plainYogurt(.5, u.cup),
                i.gramMasala(1, u.tsp),
                i.chilliPowder(1, u.tsp),
                i.gingerPowder(.5, u.tsp), // i.gingerPaste(.5, u.tsp),
                i.garlicPowder(.5, u.tsp), // i.garlicPaste(.5, u.tsp),
                i.salt(1, u.tsp),
                i.turmeric(.25, u.tsp),
                i.lemonJuice(1, u.tbsp),
                i.mintLeaf(2, u.tbsp),
                i.cilantro(2, u.tbsp),
            ]),
            Timer.set(30, 'm', 'Let chicken marinade'),
            Timer.end(),
            
            // e.instantPot().add([
            //     i.whiteRice(1, u.cup),
            //     i.water(1.5, u.cup)
            // ]),
            // e.instantPot().pressureCook(9, 5, 'm'),
            // Timer.set(5, 'm', 'let pressure release'),
            // Timer.end()
        ];
    }
}
