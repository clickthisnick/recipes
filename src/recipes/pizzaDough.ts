import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

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
            ['Put', this.get(i.dryActiveYeast(2.25, u.tsp)), 'in a bowl'],
            ['Put', this.get(i.sugar(.125, u.tsp)), 'in the bowl'],
            ['In another bowl put 3 1/2 cups', this.get(i.archerFlour())],
            ['Wait for yeast to get cloudy, 20 min'],
            ['Pour yeast mixture into flour bowl and mix'],
            ['Knead the dough about 7 times'],
            ['Break dough in half and place in one in oiled red joesph containers (16oz) and the other in the mixing bowl.'],
            ['Let sit for (1.5 hr)'],
            ['Break the pizza dough in half again'],
            ['Either freeze the dough with olive oil around it or use it now for pizza'],
            ['If freezing once in the bag, let sit for 15 minutes before sucking air out'],
        ]);
        this.printRecipe();
    }
}
