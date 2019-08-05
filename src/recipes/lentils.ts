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
            i.instaPot(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put in 1/4 cup', this.get(i.lentils()), 'in an', this.get(i.instaPot())],
            ['Put in 3/4 cup', this.get(i.water())],
            ['Season with', this.get(i.tandoriMasalla()), this.get(i.driedOnion()), this.get(i.salt())],
            [Timer.set(5, 'm', 'Turn on saute for 10 minutes')],
            ['Stir occasionally'],
        ]);
        this.printRecipe();
    }
}
