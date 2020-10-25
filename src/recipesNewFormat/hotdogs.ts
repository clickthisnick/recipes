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
        this.recipeName = 'Hotdog'
        this.variations = [
            {'recipe': [AidellsCajunSausage]},
        ]
     }
}

class AidellsCajunSausage extends Recipe {
    constructor() {
        super();
        this.steps = [
            [Timer.preheatPan(5)],
            ['Put in', i.water(1, u.cup), 'and', i.sausageAidellsCajun(4, u.unit)],
            [Timer.set(8, 'm', 'cook', true)],
            [Async.step, 'Cut', i.whiteOnion(1, u.unit), 'into slices'],
            ['Drain pan'],
            ['Turn heat to 7'],
            [Timer.set(2, 'm', 'brown hotdog', true)],
            [Timer.set(2, 'm', 'flip + brown hotdog', true)],
            ['Take out', i.sausageAidellsCajun(), 'and put on plate'],
            ['Put', i.hotdogBunPotato(4, u.unit), 'in pan'],
            [Timer.set(2, 'm', 'toast hotdog bun')],
            [Timer.set(1, 'm', 'flip + toast hotdog bun')],
            ['Assemble hotdog'],
        ];
    }
}
