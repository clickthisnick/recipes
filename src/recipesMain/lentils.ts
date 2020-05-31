import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [LentilHalfCup]},
        ]
    }

    public init() {
        this.generateRecipes();
    }
}

class LentilHalfCup extends Recipe {
    constructor() {
        super();
    }

    public generateRecipe() {
        this.addIngredients([
            i.lentils(.50, u.cup),
            i.water(1, u.cup),
            i.driedOnion(2, u.dash),
            i.tandoriMasalla(3, u.dash),
            i.salt(1, u.dash),
        ]);
        this.addSteps([
            ['Put in', i.lentils(), 'in instant pot',],
            ['Put in', i.water()],
            ['Season with', i.tandoriMasalla(), i.driedOnion(), i.salt()],
            [Timer.pressureCook(0, 5, 'm')],
        ]);
    }
}
