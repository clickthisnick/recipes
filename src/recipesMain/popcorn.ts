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
            {'recipe': [Popcorn]},
        ]
    }

    public init() {
        this.generateRecipes();
    }
}

class Popcorn extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.popcorn(4, u.tbsp),
            i.salt(1, u.unit),
            i.oliveOil(1, u.tbsp),
            i.dash(1, u.unit),
        ]);
        this.addSteps([
            ['Put', i.oliveOil(), 'in pot'],
            ['Put in 3', i.popcorn(0), 'kernels'],
            [Timer.set(4.5, 'm', 'Turn stove to heat 5')],
            ['Once 3 kernels pop, turn stove to heat 4'],
            ['Put in', i.popcorn()],
            ['Cook until popped (write this down)'],
            ['Season with', i.dash(), i.salt()],
        ]);
    }
}
