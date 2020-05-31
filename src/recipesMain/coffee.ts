import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.variations = [
            {'recipe': [Coffee]},
         ]
     }

     public init() {
         this.generateRecipes();
     }
}

class Coffee extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.coffeeGrounds(5, u.scoop),
        ]);
        this.addSteps([
            ['Fill up teapot with water'],
            [Timer.set(10, 'm', 'Turn stove to "HIGH" (after 9) and wait for whistle')],
            [Async.step, 'Put', i.coffeeGrounds(), 'into french press bag'],
            [Async.step, 'Put french press bag into french press'],
            ['Once teapot whistles - pour water into french press until water level reaches silver chrome part'],
            [Timer.set(4, 'm', 'Put top onto french press')],
            ['Push french press top down'],
            ['Put 1 scoop collagen into a cup'],
            ['Pour 2 inches of coffee'],
            ['Stir collagen'],
            ['If iced coffee - Fill cup with ice'],
            ['Pour coffee into cup, 1 inch from top'],
            ['Top off with creamer and stir'],
        ]);
    }
}
