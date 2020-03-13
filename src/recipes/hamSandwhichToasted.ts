import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'HamSandwich';
        this.recipeGroup = c.sandwich;
        this.addIngredients([
            i.bread(2, u.unit),
            i.butter(2, u.tbsp),
            i.ham(4, u.slice),
            i.pickleHotdogSlice(2, u.slice),
            i.pepperJackCheese(2, u.slice),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            [Timer.preheatPan(5)],
            [i.butter(), 'the', i.bread()],
            ['Put the bread on the pan'],
            ['Put the', i.pepperJackCheese(), 'on the bread'],
            ['Put pan lid on'],
            [Timer.panSear(1.5, 'm', 'bread')],
            ['Put', i.ham(), 'on the toasted bread'],
            ['Put', i.pickleHotdogSlice(), 'on the toasted bread'],
        ]);
        this.printRecipe();
    }
}
