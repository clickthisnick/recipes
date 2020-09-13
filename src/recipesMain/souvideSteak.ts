import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.variations = [
            {'recipe': [SouvideSteak]},
        ]
     }

     public init() {
         this.generateRecipes()
     }
}

class SouvideSteak extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.topSirloin(1, u.pound),
            i.salt(1, u.unit),
            i.blackPepper(1, u.unit),
        ]);
        this.addSteps([
            ['Rub the', i.topSirloin(), 'with', i.salt(), i.blackPepper()],
            [Timer.set(60, 'm', 'Dry brine at least an hour in the fridge')],
            [Timer.set(60, 'm', 'Souvide steak at 127 degrees')],
            [Timer.set(1, 'm', 'Souvide steak on largest side')],
            [Timer.set(1, 'm', 'Souvide steak on 2nd largest side')],
            [Timer.set(30, 's', 'Souvide steak on 3rd largest side')],
            [Timer.set(30, 's', 'Souvide steak on 4th largest side')],
            [Timer.set(15, 'm', 'Let steak sit for at least 15 min')],
        ]);
    }
}
