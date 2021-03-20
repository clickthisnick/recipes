import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            BakedZiti
        ]
    }
}

class BakedZiti extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Put', i.water(6, u.cup), '(1.5 quarts) in pot']),
            Timer.set(10, 'm', 'Boil water on heat 7 with lid'),
            Timer.end(),
            text.set(['Put in', i.ziti(16, u.ounce), 'in water']),
            text.set(['Put in', i.oliveOil(1, u.tbsp), 'in water']),
            Timer.set(3, 'm', 'Put sauce pan on heat 7 on another burner'),
            text.set(['mince', i.garlicClove(4, u.unit), i.Groups.onion(1, u.unit)]),
            Timer.end(),
            text.set(['Put', i.italianSausage(16, u.ounce), 'into pan']),
            Timer.set(5, 'm', 'Cook sausage'),
            text.set(['Put in', i.garlicClove(), 'and', i.Groups.onion()]),
            Timer.end(),
            Timer.set(5, 'm', 'Cook pan mixture'),
            text.set(['Preheat oven to 350']),
            text.set(['Put in italian seasoning into pan mixture']),
            Timer.end(),
            Timer.set(1, 'm', 'Cook pan mixture'),
            text.set(['Put', i.spaghettiSauce(16, u.ounce), 'into pan mixture']),
            Timer.end(),
            Timer.set(1, 'm', 'Cook pan mixture'),
            text.set(['Drain noodles']),
            Timer.end(),
            text.set(['Spread a thin layer of the sauce in the bottom of a 9x13-inch casserole pan']),
            text.set(['Dot the surface with half the', i.ricottaCheese(8, u.ounce)]),
            text.set(['Put a spoonful of sauce into the pasta, stir, and then add the pasta into the casserole.']),
            text.set(['Pour the rest of the sauce over the pasta, dot the remaining', i.ricottaCheese(7, u.ounce), 'over the pasta, and sprinkle', i.mozzarellaCheese(8, u.ounce), i.parmesanCheese(3, u.ounce), 'on top.']),
            text.set(['At this point you could refrigerate or freeze, or bake']),
            Timer.set(25, 'm', 'Bake in oven until light brown and cheese is melted'),
            Timer.end()
        ];
    }
}
