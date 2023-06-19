import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'blueprint';
        this.recipeGroup = c.component;
        this.variations = [
            AcaiBowlSmoothie
        ]
    }
}

class AcaiBowlSmoothie extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bulletMixer().add([
                i.almondMilk(130, u.gram),
                i.peanutButter(100, u.gram),
                i.acaiFrozenMix(2, u.unit),
                i.frozenStrawberry(123, u.gram),
                i.banana(.5, u.unit), // maybe frozen would work
            ]),
            e.bulletMixer().mix(),
        ];
    }
}
