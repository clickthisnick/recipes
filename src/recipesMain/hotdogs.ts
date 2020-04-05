import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'hotdog';
        this.recipeGroup = c.meal;
     }

     public init() {
         this.generateRecipes([
             {'recipe': [AidellsCajunSausage]},
         ]);
     }
}

class AidellsCajunSausage extends Recipe {
    constructor() {
        super();
        this.recipeId = 'AidellsCajunSausage';
    }
    public generateRecipe() {
        this.addIngredients([
            i.sausageAidellsCajun(4, u.unit),
            i.hotdogBun(4, u.unit),
            i.whiteOnion(1, u.unit),
            i.water(1, u.cup),
        ]);
        this.addSteps([
            [Timer.preheatPan(5)],
            ['Put in', i.water(), 'and', i.sausageAidellsCajun()],
            [Timer.set(8, 'm', 'cook', true)],
            [Async.step, 'Cut', i.whiteOnion(), 'into slices'],
            ['Take out', i.sausageAidellsCajun(0), 'and put on plate'],
            ['Put', i.hotdogBun(), 'in pan'],
            [Timer.set(2, 'm', 'toast')],
            ['Assemble hotdog'],
        ]);
    }
}
