import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer} from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            MeatlessSpaghetti,
        ]
    }
}

class MeatlessSpaghetti extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add([
                i.oliveOil(1, u.tbsp),
            ]),
            e.pan().cook(1, 'm', 6),
            Timer.end(),
            e.pan().add([
                i.whiteOnion(1, u.unit),
            ]),
            e.pan().cook(5, 'm', 6),
            Timer.end(),
            e.pan().add([
                i.garlicClove(3, u.clove),
            ]),
            e.pan().cook(1, 'm', 6),
            Timer.end(),
            e.pot().cookWithLid(12, 'm', 6),
                e.pan().add([
                    i.shitatkeMushroom(8, u.ounce),
                ]),
                e.pan().cook(9, 'm', 6),
                Timer.end(),
                e.pot().add([
                    i.lentilSpaghetti(),
                    i.water(16, u.ounce),
                ]),
                e.pan().add([
                    i.walnut(.33, u.cup),
                ]),
                e.pan().cook(2, 'm', 6),
                Timer.end(),
                e.pan().add([
                    i.wholeFennelSeeds(1.5, u.tsp),
                    i.smokedPaprika(.5, u.tsp),
                    i.sweetPaprika(.5, u.tsp),
                    i.redPepperFlakes(.5, u.tsp),
                    i.garlicPowder(.5, u.tsp),
                    i.onionPowder(.5, u.tsp),
                    i.driedOregano(.5, u.tsp),
                    i.driedThyme(.25, u.tsp),
                    i.blackPepper(.25, u.tsp),
                    i.kosherSalt(.5, u.tsp),
                ]),
                e.pan().cook(30, 's', 6),
                Timer.end(),
                e.pan().add([
                    i.soySauce(2, u.tsp),
                    i.nutritionalYeast(1, u.tbsp),
                    i.balsamicVinegar(.5, u.tsp),
                    i.spaghettiSauce(1, u.unit),
                ]),
            Timer.end(),
            e.pan().cook(8, 'm', 6),
            Timer.end(),
            e.pan().add([
                i.lentilSpaghetti(),
            ]),
        ];
    }
}
