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
                i.almondMilk(1, u.cup),
                i.butter(3, u.tbsp),
            ]),
            Timer.set(60, 's', 'Microwave milk mixture'),
            Timer.end(),
            e.bowl().add([
                i.dryActiveYeast(2.25, u.tsp),
                i.sugar(1, u.tbsp),
                i.salt(.25, u.tsp),
            ]),
            Timer.set(10, 'm', 'Let yeast activate'),
            Timer.end(),
            e.kitchenAidMixingBowl().add([
                i.item('yeast mixture'),
                i.allPurposeFlour(3, u.cup),
            ]),
            text.set(['When dough is sticky, which to knead hook']),
            Timer.set(1, 'm', 'Let kitchenaid knead the dough'),
            Timer.end(),
            text.set(['Coat original bowl with avacado oil']),
            text.set(['Put dough in bowl']),
            Timer.set(1, 'h', 'Cover bowl'),
            Timer.end(),
            text.set(['Get out another clean bowl']),
            e.bowl().add([
                i.butter(3, u.tbsp),
                i.sugar(.25, u.cup),
                i.cinnamon(1, u.tbsp),
            ]),
            Timer.set(70, 's', 'Microwave filling mixture'),
            text.set(['Butter a glass baking pan']),
            Timer.end(),
            text.set(['Flatten dough into a rectangle about 1/4 inch think']),
            text.set(['Spread filling mixture on dough']),
            text.set(['Roll up dough']),
            text.set(['Cut into individual rolls and place on baking sheet']),
            Timer.set(8, 'm', 'Preheat oven to 350'),
            text.set(['Put baking sheet above oven']),
            Timer.end(),
            Timer.set(25, 'm', 'Cook cinnamon rolls'),
            Timer.end(),
        ];
    }
}
