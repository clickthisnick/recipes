import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.variations = [
            {'recipe': [Sushi]},
        ]
     }
}

class Sushi extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['This recipe makes 2 rolls worth of rice'],
            ['Rinse ', i.sushiRice(.5, u.cup), 'under water for 2 minutes'],
            ['Put', i.sushiRice(), 'in instantpot'],
            ['Put', i.water(.5, u.cup), 'in instantpot'],
            [Timer.set(12, 'm', 'Cook rice in instant pot on low pressure')],
            [Timer.naturalPressRelease(10, 'm')],
            ['Unplug instant pot heat'],
            ['Put', i.appleCiderVinegar(1, u.tbsp), 'in instant pot'],
            ['Put', i.seasonedRiceVinegar(1, u.tbsp), 'in instant pot'],
            ['Stir instant pot mixture'],
            [Timer.set(30, 'm', 'Cover instant pot in tinfoil with poked holes and set in fridge')],
            ['Cook', i.salmon(.25, u.pound), 'on all sides briefly, about 2 min'],
            ['Spoon', i.sushiRice(), 'on', i.seaweed(1, u.unit), 'leaving about an inch of', i.seaweed(), 'uncovered'],
            ['Spread out rice with spoon'],
            ['Put', i.avacado(1, u.unit), 'and', i.salmon(), 'in the middle of the', i.sushiRice()],
            ['Tightly wrap and wet the uncovered inch of', i.seaweed(), 'and overlap the roll'],
            ['Put water on the outside of the uncovered', i.seaweed(), 'aswell so it sticks'],
            ['Optionally, if the', i.sushiRice(), 'is still warm, put rolls into freezer for 5 min'],
            ['Dip in ', i.soySauce(1, u.unit)]
        ];
    }
}
