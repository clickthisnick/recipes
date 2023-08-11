import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.component;
        this.variations = [
            PizzaDough
        ]
    }
}

class PizzaDough extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Put warm', i.water(14, u.ounce), 'at 110 F into bowl and stir']),
            e.bowl().add([
                i.dryActiveYeast(2.25, u.tsp),
                i.coconutSugar(.125, u.tsp),
            ]),
            e.kitchenAidMixingBowl().add([
                i.wholeWheatFlour(3.5, u.cup)
            ]),
            Timer.set(20, 'm', 'Wait for yeast to get cloudy'),
            Timer.end(),
            e.kitchenAidMixingBowl().add([
                i.ingredient('Yeast water')
            ]),
            e.kitchenAidMixingBowl().stir(),
            text.set(['Break dough in half and place in one in oiled red joesph containers (16oz) and the other in the mixing bowl.']),
            Timer.set(1.5, 'h', 'Let dough rise'),
            Timer.end(),
            text.set(['Break the pizza dough in half again']),
            text.set(['Either freeze the dough with olive oil around it or use it now for pizza']),
        ];
    }
}
