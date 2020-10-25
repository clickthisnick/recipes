import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.mealheavycleanup;
        this.variations = [
            {'recipe': [BakedZiti]},
        ]
     }
}

class BakedZiti extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Put', i.water(6, u.cup), '(1.5 quarts) in pot'],
            [Timer.set(10, 'm', 'Boil water on heat 7 with lid')],
            ['Put in', i.ziti(16, u.ounce), 'in water'],
            ['Put in', i.oliveOil(1, u.tbsp), 'in water'],
            [Timer.set(3, 'm', 'Put sauce pan on heat 7 on another burner', true)],
                [Async.step, 'mince', i.garlicClove(4, u.unit), i.redOnion(1, u.unit)],
            ['Put', i.italianSausage(16, u.ounce), 'into pan'],
            [Timer.set(5, 'm', 'Cook sausage', true)],
                [Async.step, 'Put in', i.garlicClove(), 'and', i.redOnion()],
            [Timer.set(5, 'm', 'Cook pan mixture', true)],
                [Async.step, 'Preheat oven to 350'],
            ['Put in italian seasoning into pan mixture'],
            [Timer.set(1, 'm', 'Cook pan mixture')],
            ['Put', i.spaghettiSauce(16, u.ounce), 'into pan mixture'],
            [Timer.set(1, 'm', 'Cook pan mixture')],
                [Async.step, 'Drain noodles'],
            ['Spread a thin layer of the sauce in the bottom of a 9x13-inch casserole pan'],
            ['Dot the surface with half the', i.ricottaCheese(8, u.ounce)],
            ['Put a spoonful of sauce into the pasta, stir, and then add the pasta into the casserole.'],
            ['Pour the rest of the sauce over the pasta, dot the remaining', i.ricottaCheese(7, u.ounce), 'over the pasta, and sprinkle', i.mozzarellaCheese(8, u.ounce), i.parmessanCheese(3, u.ounce), 'on top.'],
            ['At this point you could refrigerate or freeze, or bake'],
            [Timer.set(25, 'm', 'Bake in oven until light brown and cheese is melted')],
        ];
    }
}
