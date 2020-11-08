import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [PizzaDough]},
        ]
     }
}

class PizzaDough extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Put warm', i.water(12, u.ounce), 'at 110 F into bowl and stir'],
            ['Put', i.dryActiveYeast(2.25, u.tsp), 'in a bowl'],
            ['Put', i.sugar(.125, u.tsp), 'in the bowl'],
            ['In another bowl put', i.archerFlour(3.5, u.cup)],
            [Timer.set(20, 'm', 'Wait for yeast to get cloudy')],
            ['Pour yeast mixture into flour bowl and mix'],
            ['Knead the dough about 7 times'],
            ['Break dough in half and place in one in oiled red joesph containers (16oz) and the other in the mixing bowl.'],
            [Timer.set(1.5, 'h', 'Let dough rise')],
            ['Break the pizza dough in half again'],
            ['Either freeze the dough with olive oil around it or use it now for pizza'],
        ];
    }
}