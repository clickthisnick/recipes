import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Equipment as e } from '../constants/equipment';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.variations = [
            {'recipe': [Coffee]},
         ]
     }
}

class Coffee extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.teapot().add(i.water(12, u.thousandSecondCounts)),
            [Timer.set(8.5, 'm', 'Turn stove to "HIGH" (after 9) and wait for whistle')],
            [Async.step, 'Put', i.coffeeGrounds(5, u.scoop), 'into french press bag'],
            [Async.step, 'Put french press bag into french press'],
            ['Once', e.teapot(), 'whistles - pour water into french press until water level reaches silver chrome part'],
            [Timer.set(4, 'm', 'Put top onto french press')],
            ['Push french press top down'],
            e.coffeecup().add([
                i.collagenPowder(1, u.scoop),
                i.item('coffee', 2, u.inches),
            ]),
            e.coffeecup().stir(),
            ['If iced coffee - Fill cup with ice'],
            ['Pour coffee into cup, 1 inch from top'],
            ['Top off with creamer and stir'],
        ];
    }
}
