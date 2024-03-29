import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.pasta;
        this.addIngredients([
            i.zuchinni(2),
            i.Groups.mushroom(3),
            i.garlicClove(2),
            i.parmesanCheese(.25, u.cup),
            i.vegetableOil(2, u.second),
            i.spiriliazer(),
            i.blackPepper(),
            i.butter(2, u.tbsp),
            i.pepperFlake(.25, u.tsp),
            i.salt(.25, u.tsp),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.vegetableOil()), 'in pantelligent on 4'],
            ['Chop', this.get(i.garlicClove())],
            ['Put in', this.get(i.Groups.mushroom()), 'and garlic clove'],
            [Timer.set(3, 'm')],
            [this.get(i.spiriliazer()), this.get(i.zuchinni())],
            ['Put zuchinni in pan'],
            [Timer.set(5, 'm')],
            ['Put in',this.get(i.pepperFlake(.25))],
            [Timer.set(2, 'm')],
            ['Top with', this.get(i.butter())],
            ['Top with', this.get(i.parmesanCheese(.25))],
            ['Season with', this.get(i.blackPepper()), 'and', this.get(i.salt(.25))],
        ]);
        this.printRecipe();
    }
}
