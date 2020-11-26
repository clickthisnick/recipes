import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [ThaiCoconutSoup]},
        ]
    }
}

class ThaiCoconutSoup extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Dice', i.whiteOnion(1, u.unit)]),
            text.set(['Dice', i.carrots(1.5, u.unit)]),
            text.set(['Dice', i.celery(1.5, u.unit)]),
            e.instantPot().add([
                i.chickenThigh(1, u.pound),
                i.whiteOnion(),
                i.carrots(),
                i.celery(),
                i.curryPowder(1, u.tbsp),
                i.chickenStock(32, u.ounce),
            ]),
            text.set(['Set instant pot to manual cook for 30 minutes']),
            text.set(['Remove and shred chicken']),
            e.instantPot().add([
                i.chickenThigh(),
                i.whiteRice(.25, u.cup),
                i.coconutMilk(8, u.ounce),
            ]),
            text.set(['Top with', i.cilantro(1, u.unit)]),
            text.set(['Top with', i.sirachaSauce(1, u.unit)]),
        ];
    }
}
