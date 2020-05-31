import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.chinese;
        this.addIngredients([
            i.leek(2),
            i.babyBella(5),
            i.garlicClove(2),
            i.soySauce(1, u.tsp),
            i.sirachaSauce(.5, u.tbsp),
            i.pepperFlake(.25, u.tbsp),
            i.hoisonSauce(1, u.tsp),
            i.vegetableOil(3, u.second),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.vegetableOil()), 'in pantelligent on 4 / stove top on 6'],
            ['Cut in half', this.get(i.leek())],
            ['Cut leek in strips and soak in glass bowl of water'],
            ['Chop', this.get(i.garlicClove())],
            ['Cut', this.get(i.babyBella())],
            [Timer.set(5, 'm', 'put vegetables in pan')],
            ['Put in', this.get(i.soySauce())],
            ['Put in',this.get(i.sirachaSauce())],
            ['Put in',this.get(i.pepperFlake())],
            ['Put in',this.get(i.hoisonSauce())],
            [Timer.set(2, 'm')],
        ]);
        this.printRecipe();
    }
}
