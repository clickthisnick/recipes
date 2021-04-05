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
            EggPepperBuckets
        ]
    }
}

class EggPepperBuckets extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add(i.avacadoOil(1, u.second)),
            e.pan().preheat(6, 2),
            text.set(['Cut into 4 horitzontal buckets the', i.greenBellPepper(1, u.unit)]),
            Timer.end(),
            e.pan().add(i.greenBellPepper()),
            e.pan().cook(2, 'm'),
            Timer.end(),
            text.set(['Flip', i.greenBellPepper()]),
            text.set(['Crack', i.egg(4, u.unit), 'and put into the horizontal slices of', i.greenBellPepper()]),
            e.pan().cook(3, 'm'),
            i.ingredient('egg').season([
                i.smokedPaprika(1, u.dash),
                i.chilliPowder(1, u.dash),
                i.blackPepper(1, u.dash),
                i.seaSalt(1, u.dash),
            ]),
            Timer.end(),
            text.set(['Flip', i.greenBellPepper()]),
            i.ingredient('egg').season([
                i.smokedPaprika(1, u.dash),
                i.chilliPowder(1, u.dash),
                i.blackPepper(1, u.dash),
                i.seaSalt(1, u.dash),
            ]),
            e.pan().cook(1, 'm'),
            Timer.end(),
            Timer.set(1, 'm', 'For runny serve immediatly, otherwise let rest a minute'),
            Timer.end(),
        ];
    }
}
