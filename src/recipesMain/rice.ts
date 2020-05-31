import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.recipeName = 'Rice'
        this.variations = [
            {'recipe': [Rice1Cup, RiceHalfCup]}
        ]
    }

    public init() {
        this.generateRecipes();
    }
}

class Rice1Cup extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.brownRice(1, u.cup),
            i.water(1.5, u.cup)
        ]);
        this.addSteps([
            ['Put', i.brownRice(), 'in instant pot'],
            ['Put in', i.water()],
            [Timer.pressureCook(9, 15, 'm', true)],
            [Timer.naturalPressRelease(5, 'm')],
            ['Open steam valve'],
        ]);
    }
}

class RiceHalfCup extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.brownRice(.5, u.cup),
            i.water(1, u.cup)
        ]);
        this.addSteps([
            ['Put', i.brownRice(), 'in instant pot'],
            ['Put in', i.water()],
            [Timer.pressureCook(0, 7, 'm', true)],
            [Timer.set(3, 'm', 'let sit without opening steam valve')],
            ['Open steam valve'],
        ]);
    }
}
