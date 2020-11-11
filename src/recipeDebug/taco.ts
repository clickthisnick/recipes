import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [GroundBeefTaco]},
        ]
    }
}

class GroundBeefTaco extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add(i.groundBeef8020(1, u.pound)),
            e.pan().cook(6, 'm', 6),
            text.set(['Dice', i.redOnion(.5, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.cumin(4, u.dash),
                i.chilliPowder(2, u.dash),
                i.onionGranules(4, u.dash),
                i.garlicPowder(4, u.dash),
                i.water(.24, u.cup),
            ]),
            e.pan().stir(),
            e.pan().cook(4, 'm', 6),
            Timer.end(),
            i.item('taco').season([
                i.softTortillaShell(4, u.unit),
                i.mozzarellaCheese(1, u.unit),
                i.salsa(1, u.unit),
                i.hotSauce(1, u.unit),
                i.sourCream(1, u.unit),
                i.redOnion(),
            ])
        ];
    }
}
