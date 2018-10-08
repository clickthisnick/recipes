import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Lentils';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.lentils(),
            i.water(),
            i.driedOnion(),
            i.tandoriMasalla(),
            i.salt(),
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put in 1/4 cup in a pot', this.get(i.lentils())],
            ['Put in 3 1/4 cup in a pot', this.get(i.water())],
            [Timer.set(3, 'm', 'Turn on heat to 3 with no lid for 3 minutes')],
            ['Season with tandori masalla, dried onion, and salt'],
            [Timer.set(2.5, 'm', 'Turn on heat to 3 with no lid for 2.5 minutes')],
            [Timer.set(2.5, 'm', 'Turn on heat to 8 with no lid for 2.5 minutes')],
            [Timer.set(2, 'm', 'Turn on heat to 8 with no lid for 2 minutes')],
            ['Season with', this.get(i.tandoriMasalla()), this.get(i.driedOnion()), this.get(i.salt())]
        ]);
        await this.printRecipe();
    }
}
