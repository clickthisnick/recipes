import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.snack;
        this.recipeName = 'CinnamonRolls'
        this.variations = [
            CinnamonRolls
        ]
    }
}

export class CinnamonRolls extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bowl().add([
                i.water(1, u.cup),
                i.appleSauce(4, u.tbsp),
            ]),
            Timer.set(40, 's', 'Microwave milk mixture'),
            Timer.end(),
            e.bowl().add([
                i.dryActiveYeast(2.25, u.tsp),
                i.coconutSugar(2, u.tsp),
                i.salt(.25, u.tsp),
            ]),
            Timer.set(10, 'm', 'Let yeast activate'),
            Timer.end(),
            e.kitchenAidMixingBowl().add([
                i.item('yeast mixture'),
                i.allPurposeFlour(3, u.cup),
            ]),
            Timer.set(1, 'm', 'Mix on speed 2'),
            Timer.end(),
            Timer.set(1, 'm', 'Switch to bread hook, Run kitchen aid of speed 2'),
            Timer.end(),
            Timer.set(1, 'h', 'Cover with upside down pyrex bowl'),
            Timer.end(),
            text.set(['Grease upside down pyrex bowl with coconut oil']),
            e.bowl().add([
                i.coconutOil(3, u.tbsp),
                i.coconutSugar(.25, u.cup),
                i.cinnamon(1, u.tbsp),
            ]),
            Timer.set(70, 's', 'Microwave filling mixture'),
            text.set(['Butter a glass baking pan']),
            Timer.end(),
            Timer.set(7, 'm', 'Preheat oven to 350'),
            text.set(['Flatten dough into a rectangle about 1/4 inch think']),
            text.set(['Spread filling mixture on dough']),
            text.set(['Roll up dough']),
            text.set(['Cut into individual rolls and place on baking sheet']),
            text.set(['Put baking sheet above oven']),
            Timer.end(),
            Timer.set(23, 'm', 'Cook cinnamon rolls'),
            Timer.end(),
        ];
    }
}
