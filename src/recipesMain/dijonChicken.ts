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
            {'recipe': [DijonChicken]},
        ]
     }

     public init() {
         this.generateRecipes();
     }
}

class DijonChicken extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.dijonMustard(.75, u.cup),
            i.orangeJuice(.25, u.cup),
            i.oliveOil(2, u.tbsp),
            i.garlicClove(6, u.unit),
            i.salt(2, u.tsp),
            i.chickenThigh(3, u.pound),
        ]);
        this.addSteps([
            ['Combine everything but chicken (', i.dijonMustard(), i.orangeJuice(), i.oliveOil(), i.garlicClove(), i.salt(), ') in a bowl and mix'],
            ['Put in', i.chickenThigh(), 'and leave marinated for 12 hours'],
            [Timer.ninjaCook(10, 'm', 'Cook Chicken, flip at 5 min mark', 500)]
        ]);
    }
}
