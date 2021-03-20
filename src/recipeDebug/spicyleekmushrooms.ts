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
            LeekMushroom
        ]
    }
}

class LeekMushroom extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add(
                i.avacadoOil(3, u.second)
            ),
            e.pan().cook(2, 'm', 6),
            text.set(['Cut in half', i.leek(2, u.unit)]),
            text.set(['Cut leek in strips and soak in glass bowl of water']),
            text.set(['Chop', i.garlicClove(2, u.unit)]),
            text.set(['Cut', i.Groups.mushroom(5, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.leek(),
                i.garlicClove(),
                i.Groups.mushroom()
            ]),
            e.pan().cook(5, 'm'),
            Timer.end(),
            e.pan().add([
                i.soySauce(1, u.tsp),
                i.sirachaSauce(.5, u.tbsp),
                i.pepperFlake(.25, u.tbsp),
                i.hoisonSauce(1, u.tsp),
            ]),
            e.pan().cook(2, 'm'),
            Timer.end(),
        ];
    }
}


