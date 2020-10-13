import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'SouvideSteak'
        this.recipeGroup = c.meal;
        this.variations = [
            {'recipe': [PanSouvideSteak, NinjaSouvideSteak]},
        ]
     }

     public init() {
         this.generateRecipes()
     }
}

class PanSouvideSteak extends Recipe {
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
            [Timer.set(60, 'm', 'Souvide steak at 133 degrees')],
            [Timer.set(1, 'm', 'Pan fry steak on largest side')],
            [Timer.set(1, 'm', 'Pan fry steak on 2nd largest side')],
            [Timer.set(30, 's', 'Pan fry steak on 3rd largest side')],
            [Timer.set(30, 's', 'Pan fry steak on 4th largest side')],
            [Timer.set(15, 'm', 'Let steak sit for at least 15 min')],
        ]);
    }
}

class NinjaSouvideSteak extends Recipe {
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
            [Timer.set(60, 'm', 'Souvide steak at 133 degrees')],
            [Timer.ninjaCook(1.5, 'm', 'Grill steak', 500)],
            ['Flip steak'],
            [Timer.ninjaCook(1.5, 'm', 'Grill steak', 500)],
            [Timer.set(15, 'm', 'Let steak rest')],
        ]);
    }
}
