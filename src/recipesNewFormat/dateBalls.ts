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
}

class DateBalls extends Recipe {
    constructor() {
        super();
        this.steps = [
            // Technically cashew butter should be 4 cups (64 tbsp) but this is easier since it's 2 full containers
            [Timer.set(5, 'm', 'Soak 40 dates in a bowl')], 
            ['Put into blender', i.pittedDates(40, u.unit), 'checking that there are no pits'],
            ['Put into blender', i.cacaoPowderUnsweetened(1, u.cup)],
            ['Put into blender', i.collagenPowder(2, u.cup)],
            ['Put into blender', i.water(1, u.cup)],
            ['Blend for 30 seconds, stir, repeat until dough like'],
            ['Put into blender 2 full 16 ounce container of ', i.cashewButter(56, u.tbsp)],
            ['Blend for 10 seconds, stir, repeat until dough like'],
            ['Take a tbsp of batter and cut on cutting board, repeat until no more batter. Makes around 60'],
            [Timer.set(60, 'm', 'Put on plastic cutting board and put into freezer')],
                [Async.step, 'Wash blender while still able to. (Wait a day and its 200% harder to clean)'],
            ['Transfer pieces into plastic container and keep in freezer'],
        ];
    }
}
