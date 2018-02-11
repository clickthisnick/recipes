import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Timer } from '../class/timer';

export class AirFryChickenBreast extends Recipe {
    constructor() {
        super();
        this.recipeName = AirFryChickenBreast.name;
        this.addIngredients([
            i.chickenBreastPackage(),
            i.oldBay()
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Sprinkle Chicken top and bottom with', this.get(i.oldBay())],
            ['Cook in airfryer @ 400 deg for 13 minutes', this.get(i.chickenBreastPackage())],
            [Timer.set(5, 'm', 'Let chicken sit')],
        ]);
        this.printRecipe();
    }
}

const recipe = new AirFryChickenBreast();

recipe.generateRecipe();
