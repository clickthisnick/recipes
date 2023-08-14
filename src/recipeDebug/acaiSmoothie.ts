import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            AcaiBowlSmoothie,
            MixedBerrySmoothie,
        ]
    }
}

class AcaiBowlSmoothie extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bulletMixer().add([
                i.almondMilk(170, u.gram),
                i.peanutButter(75, u.gram),
                i.acaiFrozenMix(2, u.unit),
                i.frozenStrawberry(123, u.gram),
                i.banana(.5, u.unit), // maybe frozen would work
            ]),
            e.bulletMixer().mix(),
        ];
    }
}

class MixedBerrySmoothie extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bulletMixer().add([
                i.almondMilk(170, u.gram),
                i.peanutButter(40, u.gram),
                i.frozenBlueberry(50, u.gram),
                i.frozenStrawberry(123, u.gram),
            ]),
            e.bulletMixer().mix(),
        ];
    }
}