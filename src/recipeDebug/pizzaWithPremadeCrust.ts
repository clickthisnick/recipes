import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            PizzaWithPremadeCrust
        ]
    }
}

class PizzaWithPremadeCrust extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.oven().preheat(400),
            i.garlicClove(4, u.unit).dice(),
            text.set(['Take out', i.pizzaCrust(2, u.unit)]),
            text.set(['Add', i.pizzaSauce(), 'to both crusts']),
            text.set(['Add', i.mozzarellaCheese(1, u.cup), 'to crust']),
            text.set(['Add', i.garlicClove(), 'to crust']),
            text.set(['Add', i.whiteMushroom(8, u.ounce), 'to crust']),
            text.set(['Add', i.italianSeasoning(5, u.dash), 'to crust']),
            text.set(['Add', i.spinach(1, u.dash), 'to crust']),
            Timer.end(),
            e.oven().cook(15, 'm', 400),
            Timer.end(),
        ];
    }
}
