import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            TwoLbChickenTeriyaki
        ]
     }
}

export class TwoLbChickenTeriyaki extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['This recipe is for 2 lb of chicken']),
            e.bowl().add([
                i.soySauce(.25, u.cup),
                i.groundGinger(2, u.tsp),
                i.sirachaSauce(.5, u.tsp),
                i.garlicClove(2, u.unit),
                i.mapleSyrup(3, u.tbsp),
                i.redPepperFlakes(2, u.tbsp),
                i.seasonedRiceVinegar(2, u.tbsp),
            ]),
            text.set(['Marinade for 24 hours'])
        ];
    }
}
