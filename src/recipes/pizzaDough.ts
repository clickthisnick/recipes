import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'PizzaDough';
        this.recipeGroup = c.component;
        this.addIngredients([
            i.dryActiveYeast(2.25, u.tsp),
            i.archerFlour(3.5, u.cup),
            i.sugar(.125, u.tsp),
            i.water(12, u.ounce),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put warm', i.water(), 'at 110 F into bowl and stir'],
            ['Put', i.dryActiveYeast(), 'in a bowl'],
            ['Put', i.sugar(), 'in the bowl'],
            ['In another bowl put', i.archerFlour()],
            [Timer.set(20, 'm', 'Wait for yeast to get cloudy')],
            ['Pour yeast mixture into flour bowl and mix'],
            ['Knead the dough about 7 times'],
            ['Break dough in half and place in one in oiled red joesph containers (16oz) and the other in the mixing bowl.'],
            [Timer.set(1.5, 'h', 'Let dough rise')],
            ['Break the pizza dough in half again'],
            ['Either freeze the dough with olive oil around it or use it now for pizza'],
        ]);
        this.printRecipe();
    }
}
