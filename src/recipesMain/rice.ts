import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'rice';
        this.recipeGroup = c.component;
    }

    public init() {
        this.generateRecipes([
            {'recipe': [Rice1Cup, RiceHalfCup]}
        ]);
    }
}

class Rice1Cup extends Recipe {
    constructor() {
        super();
        this.recipeId = 'cup';
    }
    public generateRecipe() {
        this.addIngredients([
            i.brownRice(1, u.cup),
            i.water(1.5, u.cup)
        ]);
        this.addSteps([
            ['Put', i.brownRice(), 'in instant pot'],
            ['Put in', i.water()],
            [Timer.pressureCook(15, 'm', true)],
            [Timer.set(5, 'm', 'let sit without opening steam valve')],
            ['Open steam valve'],
        ]);
    }
}

class RiceHalfCup extends Recipe {
    constructor() {
        super();
        this.recipeId = 'half cup';
    }
    public generateRecipe() {
        this.addIngredients([
            i.brownRice(.5, u.cup),
            i.water(1, u.cup)
        ]);
        this.addSteps([
            ['Put', i.brownRice(), 'in instant pot'],
            ['Put in', i.water()],
            [Timer.pressureCook(7, 'm', true)],
            [Timer.set(3, 'm', 'let sit without opening steam valve')],
            ['Open steam valve'],
        ]);
    }
}
