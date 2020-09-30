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

     public init() {
         this.generateRecipes()
     }
}

class Sushi extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.sushiRice(.5, u.cup),
            i.water(.5, u.cup),
            i.appleCiderVinegar(1, u.tbsp),
            i.seasonedRiceVinegar(1, u.tbsp),
            //i.salt(0.375, u.tsp),
            //i.sugar(.5, u.tbsp),
            i.avacado(1, u.unit),
            i.soySauce(1, u.unit),
            i.salmon(.25, u.pound),
            i.seaweed(1, u.unit),
        ]);
        this.addSteps([
            ['This recipe makes 2 rolls worth of rice'],
            ['Rinse ', i.sushiRice(), 'under water for 2 minutes'],
            ['Put', i.sushiRice(0), 'in instantpot'],
            ['Put', i.water(), 'in instantpot'],
            [Timer.set(12, 'm', 'Cook rice in instant pot on low pressure')],
            [Timer.naturalPressRelease(10, 'm')],
            ['Unplug instant pot heat'],
            ['Put', i.appleCiderVinegar(), 'in instant pot'],
            ['Put', i.seasonedRiceVinegar(), 'in instant pot'],
            // ['Put', i.salt(), 'in glass bowl'],
            // ['Put', i.sugar(), 'in glass bowl'],
            //[Timer.set(1, 'm', 'Micowave for one minute then stir')],
            ['Stir instant pot mixture'],
            [Timer.set(30, 'm', 'Cover instant pot in tinfoil with poked holes and set in fridge')],
            ['Cook', i.salmon(), 'on all sides briefly, about 2 min'],
            ['Spoon', i.sushiRice(0), 'on', i.seaweed(), 'leaving about an inch of seaweed uncovered'],
            ['Spread out rice with spoon'],
            ['Put', i.avacado(), 'and', i.salmon(0), 'in the middle of the', i.sushiRice(0)],
            ['Tightly wrap and wet the uncovered inch of seaweed and overlap the roll'],
            ['Put water on the outside of the uncovered seaweed aswell so it sticks'],
            ['Optionally, if the rice is still warm, put rolls into freezer for 5 min'],
            ['Dip in ', i.soySauce()]
        ]);
    }
}
