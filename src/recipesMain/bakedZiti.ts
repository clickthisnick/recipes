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
            {'recipe': [BakedZiti]},
        ]
     }

    public init() {
        this.generateRecipes();
    }
}

class BakedZiti extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.ziti(16, u.ounce),
            i.water(10, u.cup),
            i.italianSausage(16, u.ounce),
            i.spaghettiSauce(16, u.ounce),
            i.redOnion(1, u.unit),
            i.garlicClove(4, u.unit), 
            i.ricottaCheese(15, u.ounce),
            i.mozzarellaCheese(8, u.ounce),
            i.parmessanCheese(3, u.ounce),
        ]);
        this.addSteps([
            ['Put', i.water(), '(2.5 quarts) in pot'],
            [Timer.set(10, 'm', 'Boil water on heat 7 with lid')],
            ['Put in', i.ziti(), 'in water'],
            [Timer.set(3, 'm', 'Put sauce pan on heat 7 on another burner', true)],
                [Async.step, 'mince', i.garlicClove(), i.redOnion()],
            ['Put', i.italianSausage(), 'into pan'],
            [Timer.set(5, 'm', 'Cook sausage', true)],
                [Async.step, 'Put in', i.garlicClove(0), 'and', i.redOnion(0)],
            [Timer.set(5, 'm', 'Cook pan mixture', true)],
                [Async.step, 'Preheat oven to 350'],
            ['Put in italian seasoning into pan mixture'],
            [Timer.set(1, 'm', 'Cook pan mixture')],
            ['Put', i.spaghettiSauce(), 'into pan mixture'],
            [Timer.set(2, 'm', 'Cook pan mixture')],
            ['Spread a thin layer of the sauce in the bottom of a 9x13-inch casserole pan'],
            ['Dot the surface with half the', i.ricottaCheese(8, u.ounce)],
            ['Put a spoonful of sauce into the pasta, stir, and then add the pasta into the casserole.'],
            ['Pour the rest of the sauce over the pasta, dot the remaining', i.ricottaCheese(7, u.ounce), 'over the pasta, and sprinkle', i.mozzarellaCheese(), i.parmessanCheese(), 'on top.'],
            ['At this point you could refrigerate or freeze, or bake'],
            ['Bake in oven until light brown and cheese is melted, about 20-25 minutes.'],
        ]);
    }
}
