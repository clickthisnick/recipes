import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Lentils';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.lentils(.25, u.cup),
            i.water(.75, u.cup),
            i.driedOnion(1, u.empty),
            i.tandoriMasalla(1, u.empty),
            i.salt(1, u.empty),
            i.instaPot(1, u.empty),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put in', this.get(i.lentils()), 'in an', this.get(i.instaPot())],
            ['Put in', this.get(i.water())],
            ['Season with', this.get(i.tandoriMasalla()), this.get(i.driedOnion()), this.get(i.salt())],
            [Timer.set(10, 'm', 'Turn on saute for 10 minutes')],
            ['Stir occasionally'],
        ]);
        this.printRecipe();
    }
}
