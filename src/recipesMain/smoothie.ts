import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'Fruit Smoothie';
        this.recipeGroup = c.meal;
     }

     public init() {
         this.generateRecipes([
            {'recipe': [Smoothie]},
         ]);
     }
}

class Smoothie extends Recipe {
    constructor() {
        super();
        this.recipeId = 'default';
    }
    public generateRecipe() {
        this.addIngredients([
            i.almondMilk(1, u.cup),
            i.frozenBerries(1.5, u.cup),
            // Change to a better measurement
            i.plainYogurt(.33, u.cup),
        ]);

        this.addSteps([
            ['Get out nutribullet'],
            ['Add', i.plainYogurt(), i.frozenBerries(), i.almondMilk()],
            // TODO add measurement
            ['Blend until berries are smooth'],
        ]);
    }
}
