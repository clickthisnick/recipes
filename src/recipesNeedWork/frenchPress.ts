import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.coffee;
        this.addIngredients([
            i.coffeeGrounds(1.5, u.tbsp),
            i.sugar()
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put water in teapot'],
            ['Put teapot on oven on high heat'],
            ['Put', this.get(i.coffeeGrounds()), 'in small french press'],
            ['When teapot whistles, pour water into french press up to silver line'],
            ['Put top on french press'],
            [Timer.set(4, 'm')],
            ['Press down french press slowly'],
            ['Pour in cup'],
            ['Spoon in level spoonful of sugar'],
        ]);
        this.printRecipe();
    }
}
