import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [DateBalls]},
        ]
     }

     public init() {
         this.generateRecipes();
     }
}

class DateBalls extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.cashewButter(28, u.tbsp), // Technically should be 2 cups (32 tbsp) but this is easier since it's a full container
            i.collagenPowder(1, u.cup),
            i.cacaoPowderUnsweetened(.5, u.cup),
            i.pittedDates(20, u.unit),
            i.water(8, u.tbsp),
        ]);
        this.addSteps([
            [Timer.set(5, 'm', 'Soak 20 dates in a bowl')],
            ['Put into blender a full 16 ounce container of ', i.cashewButter()],
            ['Put into blender', i.collagenPowder()],
            ['Put into blender', i.cacaoPowderUnsweetened()],
            ['Put into blender', i.water()],
            ['Put into blender', i.pittedDates()],
            ['Blend for 10 seconds, stir, repeat until dough like'],
            ['Take a tbsp of batter and cut on cutting board, repeat until no more batter. Makes around 30'],
            [Timer.set(20, 'm', 'Put on plastic cutting board and put into freezer')],
                [Async.step, 'Wash blender while still able to. (Wait a day and its 200% harder to clean)'],
            ['Transfer pieces into plastic container and keep in freezer'],
        ]);
    }
}
