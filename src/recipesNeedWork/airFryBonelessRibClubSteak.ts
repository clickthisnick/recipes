import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.beef;
        this.addIngredients([
            i.bonelessRibClubSteak(),
            i.blackPepper(),
            i.salt(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Open the package with', this.get(i.bonelessRibClubSteak())],
            ['Season both sides with', this.get(i.blackPepper()), 'and', this.get(i.salt())],
            ['Put pan on heat 8 to preheat for 3 minutes'],
            [Timer.set(30, 's', 'Put steak in preheated pan')],
            [Timer.set(30, 's', 'Flip steak in pan')],
            [Timer.set(4, 'm', 'Put steak in airfryer @ 370 deg')],
            ['Flip steak'],
            [Timer.set(3, 'm', 'Put steak in airfryer @ 370 deg until correct temperature')],

        ]);
        this.printRecipe();
    }
}
