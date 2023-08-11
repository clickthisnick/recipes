import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.snack;
        this.addIngredients([
            i.frozenTatorTots(),
            i.lawlrySaltFree()
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Open', this.get(i.frozenTatorTots())],
            ['Put one layer of tator tots in airfryer and sprinkle', this.get(i.lawlrySaltFree())],
            [Timer.ovenCook(19, 'm', 'tator tots', 400)],
        ]);
        this.printRecipe();
    }
}
