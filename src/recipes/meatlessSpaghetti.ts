import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer} from '../class/timer';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            AbbotPeaProteinSpaghetti,
            WalnutMeatlessSpaghetti,
            WalnutMeatlessSpaghettiNoMushrooms,
        ]
    }
}

const PAN_TEMPERATURE=7

class AbbotPeaProteinSpaghetti extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pot().add([
                i.water(30, u.ounce),
            ]),
            e.pan().cook(6, 'm', 9),
                e.pan().add([
                    i.avocadoOil(1, u.spray),
                    i.abbotPeaItalianSausage(1, u.bag)
                ]),
                e.pan().cook(5, 'm', 5),
                Timer.end(),    
            Timer.end(),
            text.set(['Break', i.lentilSpaghetti(8, u.ounce), 'into 3 even sections']),
            e.pan().cook(14, 'm', 7),
                e.pan().cook(10, 'm', 7),
                Timer.end(),
                e.pan().add([
                    i.spaghettiSauce(1, u.bag),
                ]),
                e.pan().cook(2, 'm', 7),
                Timer.end(),
            Timer.end(),
        ];
    }
}

class WalnutMeatlessSpaghetti extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add([
                i.oliveOil(1, u.tbsp),
            ]),
            e.pan().cook(1, 'm', PAN_TEMPERATURE),
            Timer.end(),
            e.pan().add([
                i.whiteOnion(1, u.unit),
            ]),
            e.pan().cook(5, 'm', PAN_TEMPERATURE),
            Timer.end(),
            e.pan().add([
                i.garlicClove(3, u.clove),
            ]),
            e.pan().cook(1, 'm', PAN_TEMPERATURE),
            Timer.end(),
            e.pot().add([
                i.lentilSpaghetti(),
                i.water(16, u.ounce),
            ]),
            e.pot().cookWithLid(12, 'm', 9),
                e.pan().add([
                    i.shitatkeMushroom(8, u.ounce),
                ]),
                e.pan().cook(9, 'm', PAN_TEMPERATURE),
                Timer.end(),
                e.pan().add([
                    i.walnut(.33, u.cup),
                ]),
                e.pan().cook(2, 'm', PAN_TEMPERATURE),
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
                e.pan().cook(30, 's', PAN_TEMPERATURE),
                Timer.end(),
                e.pan().add([
                    i.soySauce(2, u.tsp),
                    i.nutritionalYeast(1, u.tbsp),
                    i.balsamicVinegar(.5, u.tsp),
                    i.spaghettiSauce(1, u.unit),
                ]),
            Timer.end(),
            e.pan().cook(8, 'm', PAN_TEMPERATURE),
            Timer.end(),
            e.pan().add([
                i.lentilSpaghetti(),
            ]),
        ];
    }
}


class WalnutMeatlessSpaghettiNoMushrooms extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add([
                i.oliveOil(1, u.tbsp),
            ]),
            e.pan().cook(1, 'm', PAN_TEMPERATURE),
            Timer.end(),
            e.pan().add([
                i.whiteOnion(1, u.unit),
            ]),
            e.pan().cook(5, 'm', PAN_TEMPERATURE),
            Timer.end(),
            e.pan().add([
                i.garlicClove(3, u.clove),
            ]),
            e.pan().cook(1, 'm', PAN_TEMPERATURE),
            Timer.end(),
            e.pot().add([
                i.lentilSpaghetti(),
                i.water(16, u.ounce),
            ]),
            e.pot().cookWithLid(3, 'm', 9),
                e.pan().add([
                    i.walnut(.33, u.cup),
                ]),
                e.pan().cook(2, 'm', PAN_TEMPERATURE),
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
                e.pan().cook(30, 's', PAN_TEMPERATURE),
                Timer.end(),
                e.pan().add([
                    i.nutritionalYeast(1, u.tbsp),
                    i.spaghettiSauce(1, u.unit),
                ]),
            Timer.end(),
            e.pan().cook(8, 'm', PAN_TEMPERATURE),
            Timer.end(),
            e.pan().add([
                i.lentilSpaghetti(),
            ]),
        ];
    }
}
