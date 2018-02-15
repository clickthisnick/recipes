import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Timer } from '../class/timer';

export class AirFryChickenThigh extends Recipe {
    constructor() {
        super();
        this.recipeName = AirFryChickenThigh.name;
        this.addIngredients([
            i.chickenThighPackage(),
            i.oldBay()
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Sprinkle Chicken top and bottom with', this.get(i.oldBay())],
            ['Cook in airfryer @ 370 deg for 12 minutes', this.get(i.chickenThighPackage())],
            [Timer.set(5, 'm', 'Flip chicken and cook for 5 minutes @ 370')],
        ]);
        this.printRecipe();
    }
}

const recipe = new AirFryChickenThigh();

recipe.generateRecipe();
