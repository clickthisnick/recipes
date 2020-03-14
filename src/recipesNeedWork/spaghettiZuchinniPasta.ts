import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'SpaghettiZuchinniPasta';
        this.recipeGroup = c.pasta;
        this.addIngredients([
            i.zuchinni(2),
            i.crimniMushroom(3),
            i.garlicClove(2),
            i.parmessanCheese(.25, u.cup),
            i.vegetableOil(2, u.second),
            i.spiriliazer(),
            i.blackPepper(),
            i.spaghettiSauce(.5),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.vegetableOil()), 'in pantelligent on 4'],
            ['Chop', this.get(i.garlicClove())],
            [Timer.set(5, 's', 'for pan to be hot')],
            ['Put in', this.get(i.crimniMushroom()), 'and', this.get(i.garlicClove())],
            [Timer.set(3, 'm', 'for vegetables to be cooked')],
            [this.get(i.spiriliazer()), this.get(i.zuchinni())],
            ['Put zuchinni in pan'],
            [Timer.set(5, 'm', 'for zuchinni to be cooked')],
            ['Put in ', this.get(i.spaghettiSauce())],
            ['Turn heat to 5'],
            [Timer.set(5, 'm', 'to be done with the recipe')],
            ['Season with', this.get(i.blackPepper())],
            ['Top with', this.get(i.parmessanCheese())]
        ]);
        this.printRecipe();
    }
}