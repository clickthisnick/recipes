import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'protein balls';
        this.recipeGroup = c.component;
     }

     public init() {
         this.generateRecipes([
             {'recipe': [ProteinBalls]},
         ]);
     }
}

class ProteinBalls extends Recipe {
    constructor() {
        super();
        this.recipeId = 'asparagus';
    }
    public generateRecipe() {
        this.addIngredients([
            i.cashewButter(1, u.cup),
            i.collagenPowder(.5, u.cup),
            i.cacaoPowderUnsweetened(.25, u.cup),
            i.pittedDates(10, u.unit),
            i.water(4, u.tbsp),
        ]);
        this.addSteps([
            [Timer.set(5, 'm', 'Soak dates in a bowl')],
            ['Put', i.cashewButter(), i.collagenPowder(), i.cacaoPowderUnsweetened(), i.water(), 'in blender'],
            ['Blend for 5 seconds'],
            ['Put in', i.pittedDates()],
            ['Blend for 5 seconds, stir, repeat until dough like'],
            ['Take a tbsp of batter and cut on cutting board, repeat until no more batter. Makes 15'],
            ['Put in freezer']
        ]);
    }
}
