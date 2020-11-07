import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [LeekMushroom]},
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
            text.set(['Cut', i.babyBellaMushroom(5, u.unit)]),
            e.pan().add([
                i.leek(),
                i.garlicClove(),
                i.babyBellaMushroom(),
            ]),
            e.pan().cook(5, 'm'),
            e.pan().add([
                i.soySauce(1, u.tsp),
                i.sirachaSauce(.5, u.tbsp),
                i.pepperFlake(.25, u.tbsp),
                i.hoisonSauce(1, u.tsp),
            ]),
            e.pan().cook(2, 'm'),
        ];
    }
}


