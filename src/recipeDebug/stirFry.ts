import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            StirFry
        ]
    }
}

class StirFry extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['This makes 5 french toast slices']),
            e.pan().preheat(4, 2),
            text.set(["Peel and cut", i.carrots(2, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.oliveOil(1, u.tbsp),
                i.carrots(),
            ]),
            Timer.set(2, 'm'),
            text.set(["Cut", i.yellowOnion(2, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.yellowOnion(),
            ]),
            Timer.set(2, 'm'),
            text.set(["Cut", i.broccoli(2, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.broccoli(),
            ]),
            Timer.set(1, 'm'),
            text.set(["Cut", i.whiteMushroom(5, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.whiteMushroom(),
            ]),
            Timer.set(4, 'm'),
            text.set(["Cut", i.cabbage(1, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.cabbage(),
            ]),
            Timer.set(3, 'm'),
            Timer.end(),
        ]
    }
}
