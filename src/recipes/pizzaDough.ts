import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'PizzaDough';
        this.recipeGroup = c.bread;
        this.addIngredients([
            i.dryActiveYeast(),
            i.archerFlour(),
            i.sugar(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 12 ounces warm water 110 F into bowl and stir'],
            ['In a bowl put 2 1/4 teaspoons', this.get(i.dryActiveYeast()), 'and 1/8 teaspoon sugar in the bowl'],
            ['In another bowl put 3 1/2 cups', this.get(i.archerFlour())],
            ['Wait for yeast to get cloudy, 20 min'],
            ['Pour yeast mixture into flour bowl and mix'],
            ['Knead the dough about 7 times'],
            ['Break dough in half and place in one in oiled red joesph containers (16oz) and the other in the mixing bowl.'],
            ['Let sit for (1.5 hr)'],
            ['Break the pizza dough in half again'],
            ['Either freeze the dough with olive oil around it or use it now for pizza'],
        ]);
        this.printRecipe();
    }
}
