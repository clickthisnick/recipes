import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../constants/equipment';
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
            e.blender().add([
                [i.pittedDates(40, u.unit), 'checking that there are no pits'],
                i.cacaoPowderUnsweetened(1, u.cup),
                i.collagenPowder(2, u.cup),
                i.water(1, u.cup)
            ]),
            ['Blend for 30 seconds, stir, repeat until dough like'],
            e.blender().add([
                [i.cashewButter(56, u.tbsp), '(2 full 16 ounce containers)']
            ]),
            ['Blend for 10 seconds, stir, repeat until dough like'],
            ['Take a tbsp of batter and cut on cutting board, repeat until no more batter. Makes around 60'],
            [Timer.set(60, 'm', 'Put on plastic cutting board and put into freezer')],
                [Async.step, 'Wash blender while still able to. (Wait a day and its 200% harder to clean)'],
            ['Transfer pieces into plastic container and keep in freezer'],
        ];
    }
}
