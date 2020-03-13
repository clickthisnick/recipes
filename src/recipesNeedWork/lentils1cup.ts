import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Lentils1Cup';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.lentils(.50, u.cup),
            i.water(1, u.cup),
            i.driedOnion(2, u.dash),
            i.tandoriMasalla(3, u.dash),
            i.salt(1, u.dash),
            i.instaPot(1, u.noUnitQuantity),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put in', this.get(i.lentils()), 'in an', this.get(i.instaPot())],
            ['Put in', this.get(i.water())],
            ['Season with', this.get(i.tandoriMasalla()), this.get(i.driedOnion()), this.get(i.salt())],
            [Timer.set(5, 'm', 'Turn on pressure cook for 5 minutes')],
        ]);
        this.printRecipe();
    }
}
