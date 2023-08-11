import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.pizza;
        this.addIngredients([
            i.italianSausage(),
            i.Groups.onion(),
            i.pizzaSauce(),
            i.pizzaCrust(),
            i.mozzarellaCheese()
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Preheat oven to 400'],
            ['Cook in pan for 10 minutes the', this.get(i.italianSausage()), 'and', this.get(i.Groups.onion())],
            ['Strain sausage in yellow pasta strainer to remove excess grease'],
            ['Get out', this.get(i.pizzaCrust())],
            ['Put', this.get(i.pizzaSauce()), 'on the pizza crust'],
            ['Put the italian sausage on the pizza'],
            ['Put', this.get(i.mozzarellaCheese()), 'on the pizza'],
            [Timer.set(12, 'm', 'Cook pizza for 12 minutes @ 400 oven')],
        ]);
        this.printRecipe();
    }
}
