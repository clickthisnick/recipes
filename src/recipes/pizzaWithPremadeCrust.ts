import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            PizzaWithPremadeCrust
        ]
    }
}

class PizzaWithPremadeCrust extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.oven().preheat(425),
            i.garlicClove(4, u.unit).dice(),
            i.whiteMushroom(1, u.pound).cutIntoThinSlices(),
            text.set(['Take out', i.pizzaCrust(2, u.unit)]),
            text.set(['Add', i.pizzaSauce(), 'to both crusts with', e.woodenSpoon()]),
            text.set(['Add', i.mozzarellaCheese(1, u.cup), 'to crust']),
            text.set(['Add', i.garlicClove(), 'to crust']),
            text.set(['Add', i.whiteMushroom(), 'to crust']),
            text.set(['Add', i.italianSeasoning(5, u.dash), 'to crust']),
            text.set(['Add', i.spinach(1, u.dash), 'to crust']),
            Timer.end(),
            e.oven().cook(14, 'm', 425),
            Timer.end(),
        ];
    }
}
