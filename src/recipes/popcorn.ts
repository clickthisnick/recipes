import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'popcorn';
        this.recipeGroup = c.component;
        this.addIngredients([
            i.popcorn(4, u.tbsp),
            i.salt(1, u.unit),
            i.chilliPowder(1, u.tbsp),
            i.dash(1, u.unit),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', i.chilliPowder(), 'in pot'],
            ['Put in 3', i.popcorn(0), 'kernels'],
            [Timer.set(4.5, 'm', 'Turn stove to heat 5')],
            ['Once 3 kernels pop, turn stove to heat 4'],
            ['Put in', i.popcorn()],
            ['Cook until popped (write this down)'],
            ['Season with', i.dash(), i.salt()],
        ]);
        this.printRecipe();
    }
}
