import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.variations = [
            scrambledSteakEggsYams
         ]
     }
}

class scrambledSteakEggsYams extends Recipe {
    constructor() {
        super();
        this.steps = [
            i.sweetPotatoes(1, u.unit).dice(),
            i.sweetPotatoes().seasonWith([
                i.redPepperFlakes(1, u.tsp),
                i.blackPepper(.5, u.tsp),
                i.lawlrySaltFree(1, u.tsp),
            ]),
            e.pan(0).add([
                i.ingredient('Seasoned dice sweet potato')
            ]),
            e.pan(0).cook(15, 'm', 7),
            i.whiteOnion(1, u.unit).dice(),
            e.bowl().add([
                i.egg(4, u.unit),
                i.water(4, u.tbsp),
            ]),
            e.bowl().whisk(),
            e.bowl().add(i.whiteOnion()),
            e.pan(1).add(i.ingredient("egg mixture")),
            e.pan(1).cook(10, 'm', 5),
            i.flankSteak(.75, u.pound).seasonWith([
                i.lawlrySaltFree(1, u.tsp),
                i.blackPepper(.5, u.tsp),
                i.salt(.25, u.tsp),
            ]),
            e.pan(2).add([
                i.ingredient("Season flank steak"),
            ]),
            e.pan(2).cook(2, 'm', 5),
            Timer.end(),
            i.flankSteak().flip(),
            e.pan(2).cook(2, 'm', 5),
            Timer.end(),
            Timer.end(),
            Timer.end(),
            Timer.end(),
            Timer.end(),
        ];
    }
}
