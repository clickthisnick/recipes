import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            Guacamole
        ]
    }
}

class Guacamole extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Cut', i.avocadoLarge(1, u.unit), 'in half and remove the put']),
            e.largeBowl().add([i.avocadoLarge()]),
            text.set(['Mash the avacado with a fork to be as smooth or as chunk as you want']),
            text.set(['Chop the', i.romaTomato(2, u.unit), i.yellowOnion(.5, u.unit), i.cilantro(3, u.tbsp), i.jalapeno(1, u.unit), i.garlicClove(2, u.clove), i.lime(1, u.unit), i.seaSalt(.5, u.tsp)]),
            text.set(['Mix all the ingredients together']),
        ];
    }
}
