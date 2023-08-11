import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.meal;
        this.variations = [
            {'recipe': [PanSouvideSteak]},
        ]
     }
}

class PanSouvideSteak extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Rub the', i.topSirloin(1, u.pound), 'with', i.thyme(1, u.unit)],
            [Timer.set(60, 'm', 'Souvide steak at 132 degrees')],
            [Timer.set(1, 'm', 'Pan fry steak on largest side')],
            [Timer.set(1, 'm', 'Pan fry steak on 2nd largest side')],
            [Timer.set(30, 's', 'Pan fry steak on 3rd largest side')],
            [Timer.set(30, 's', 'Pan fry steak on 4th largest side')],
            [Timer.set(15, 'm', 'Let steak sit for at least 15 min')],
        ];
    }
}
