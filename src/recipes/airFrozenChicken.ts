import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'AirFrozenChicken';
        this.recipeGroup = c.chicken;
        this.addIngredients([
            i.chickenDrumstickPackage(),
            i.oldBay()
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Open', this.get(i.chickenDrumstickPackage())],
            ['Put chicken in glass bowl in sink'],
            ['Run water until hot'],
            ['Fill bowl with hot water'],
            [Timer.set(30, 'm')],
            [Timer.airFry(12, 'm', 'chicken', 400)],
            ['Mix chicken and sprinkle', this.get(i.oldBay())],
            [Timer.airFry(10, 'm', 'chicken', 350)],
        ]);
        this.printRecipe();
    }
}
