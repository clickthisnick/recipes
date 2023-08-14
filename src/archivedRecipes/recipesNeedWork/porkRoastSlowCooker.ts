import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.pork;
        this.addIngredients([
            i.porkRoast(),
            i.lawlrySaltFree(),
            i.chilliPowder(),
            i.garlicPowder(),
            i.oliveOil(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.porkRoast()), 'in bowl'],
            ['Cover pork roast with', this.get(i.lawlrySaltFree()), 'on both sides'],
            ['Cover pork roast with', this.get(i.chilliPowder()), 'on both sides'],
            ['Cover pork roast with', this.get(i.garlicPowder()), 'on both sides'],
            ['Put pork roast in ziplock bag'],
            ['Put', this.get(i.oliveOil()), 'in bag'],
            [Timer.set(8, 'h', 'Put ziplock bag in refrigerator for 8 hours')],
            [Timer.set(270, 'm', 'Put pork roast in slow cooker on low for 4 and a half hours')],
            [Timer.set(10, 'm', 'Take pork roast out of slow cooker and let sit for 10 minutes')],
            ['Trim excess fat'],
        ]);
        this.printRecipe();
    }
}
