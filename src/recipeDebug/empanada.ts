import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment'
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            Empanada
        ]
    }
}

class Empanada extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.kitchenAidMixingBowl().add([
                i.wholeWheatFlour(3, u.cup),
                i.salt(.25, u.tsp),
            ]),
            e.kitchenAidMixingBowl().stir(),
            e.kitchenAidMixingBowl().add([
                i.butter(1.5, u.stick),
                i.egg(1, u.unit),
                i.water(4, u.tbsp),
            ]),
            e.kitchenAidMixingBowl().stir(),
            text.set(['Roll dough flat between 2 pieces of parchment paper']),
            Timer.set(30, 'm', 'Refridgerate dough'),
            e.pan().add([
                i.oliveOil(1, u.tbsp),
                i.yellowOnion(1, u.unit),
            ]),
            e.pan().cook(5, 'm', 4),
            text.set(['Mince', i.garlicClove(2, u.clove)]),
            Timer.end(),
            e.pan().add([
                i.garlicClove(2, u.clove),
            ]),
            e.pan().cook(1, 'm', 4),
            Timer.end(),
            e.pan().add([
                i.groundBeef8020(1, u.pound),
            ]),
            e.pan().cook(5, 'm', 4),
            Timer.end(),
            e.pan().add([
                i.tomatoPaste(1, u.tbsp),
                i.driedOregano(1, u.tsp),
                i.cumin(1, u.tsp),
                i.paprika(.5, u.tsp),
                i.blackPepper(5, u.crack),
                i.salt(5, u.crack),
                i.cannedHotCherryPepper(.5, u.cup),
            ]),
            e.pan().cook(3, 'm', 4),
            Timer.end(),
            Timer.end(),
            text.set(['Add filling to empanada']),
            text.set(['Add cheese']),
        ];
    }
}
