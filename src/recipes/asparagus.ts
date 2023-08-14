import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [Asparagus];
    }
}

class Asparagus extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.ninja().preheat(500),
            Timer.end(),
            e.ninja().add([
                i.asparagus(.5, u.bunch)
            ]),
            text.set(['Brush', i.asparagus(), 'with', i.oliveOil(1, u.tsp)]),
            e.ninja().cook(4, 'm', 500),
            Timer.end(),
            i.asparagus().seasonWith([
                i.dash(1, u.unit)
            ]),
        ];
    }
}
