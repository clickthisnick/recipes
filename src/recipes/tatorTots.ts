import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'TatorTots';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.frozenTatorTots(),
            i.lawlrySaltFree()
        ]);
    }

    public async generateRecipe() {
        this.prep();
        this.addSteps([
            ['Open', this.get(i.frozenTatorTots())],
            ['Put one layer of tator tots in airfryer and sprinkle', this.get(i.lawlrySaltFree())],
            [Timer.set(19, 'm', 'Cook @ 400 deg')],
        ]);
        await this.printRecipe();
    }
}
