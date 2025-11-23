import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Timer} from '../class/timer';
import { Text as text} from '../class/text';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            RedRoastedPotatoes,
        ]
    }
}

class RedRoastedPotatoes extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Wash', i.redPotatoes(1, u.pound), 'and cut into equal size wedges so they cook evenly']),
            text.set(['Pat dry thoroughly (helps crisping).']),
            i.garlicClove(3, u.unit).mince(),

            e.largeBowl().add([
                i.redPotatoes(),
                i.oliveOil(2, u.tsp),
                i.rosemary(1, u.tsp),
                i.sage(1, u.tsp),
                i.salt(1, u.tsp),
                i.blackPepper(1, u.tsp),
            ]),

            e.ninja().cook(8, 'm',400),
            Timer.end(),

            text.set(['Flip potatoes']),
            
            e.ninja().cook(8, 'm',400),
            Timer.end(),
        ]
    }
}
