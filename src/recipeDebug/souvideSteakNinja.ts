import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Text as text } from '../class/text';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'SouvideSteak'
        this.recipeGroup = c.meal;
        this.variations = [
            NinjaSouvideSteak
        ]
     }
}

class NinjaSouvideSteak extends Recipe {
    constructor() {
        super();
        this.steps = [
            i.topSirloin(1, u.pound).seasonWith([
                i.thyme(2, u.dash),
                i.blackPepper(2, u.dash),
            ]),
            Timer.set(60, 'm', 'Souvide steak at 132 degrees'),
            Timer.end(),
            e.ninja().preheat(500),
            Timer.end(),
            e.ninja().add(i.topSirloin()),
            e.ninja().cook(1.5, 'm', 500),
            Timer.end(),
            text.set(['Flip steak']),
            e.ninja().cook(1.5, 'm', 500),
            Timer.end(),
            Timer.set(15, 'm', 'Let steak rest'),
            Timer.end(),
            i.topSirloin().seasonWith(i.steakSauce(1, u.unit))
        ];
    }
}
