import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Timer } from '../class/timer';

export class AirFrozenChicken extends Recipe {
    constructor() {
        super();
        this.recipeName = AirFrozenChicken.name;
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
            [Timer.set(12, 'm', 'Put chicken in airfryer @ 400 deg')],
            ['Mix chicken and sprinkle', this.get(i.oldBay())],
            [Timer.set(10, 'm', 'Put chicken in airfryer @ 350 deg')],
        ]);
        this.printRecipe();
    }
}

const recipe = new AirFrozenChicken();

recipe.generateRecipe();
