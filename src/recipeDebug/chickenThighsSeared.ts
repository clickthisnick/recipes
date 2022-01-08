import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [ChickenThighsSeared];
    }
}

class ChickenThighsSeared extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bowl().add([
                i.onionPowder(.5, u.tsp),
                i.cumin(.5, u.tsp),
                i.paprika(.5, u.tsp),
                i.cayennePepper(.5, u.tsp),
                i.turmeric(.25, u.tsp),
                i.salt(5, u.crack),
            ]),
            e.bowl().mix(),
            e.pan().preheat(6, 4),
                e.pan().add([i.oliveOil(3, u.tsp)]),
                i.chickenThigh(1, u.pound).patDry(),
                i.chickenThigh().seasonWith([
                    i.ingredient('Bowl season mixture'),
                ]),
            Timer.end(),
            text.set(["Make sure thighs are cooked smooth side down first"]),
            e.pan().add([
                i.chickenThigh()
            ]),
            e.pan().cook(5, 'm', 6),
            Timer.end(),
            text.set(["Flip chicken thighs"]),
            e.pan().cook(6, 'm', 6),
                i.garlicClove().cutIntoStrips(),
            Timer.end(),
            e.pan().add([
                i.ingredient('Garlic slices')
            ]),
            e.pan().cook(.5, 'm', 6),
            Timer.end(),
            e.pan().add([
                i.chickenStock(.5, u.cup),
            ]),
            text.set(['Deglaze pan']),
            text.set(['Take pan off heat']),
            text.set(['Spoon sauce over chicken']),
            Timer.set(5, "m", "Let chicken thighs rest"),
            Timer.end(),
        ];
    }
}
