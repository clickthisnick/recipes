import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

// Serves 1
export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Broccoli Beef';
        this.recipeGroup = c.chinese;
        this.addIngredients([
            i.oliveOil(1, u.tbsp),
            i.flankSteak(.5, u.pound),
            i.garlicClove(3, u.clove),
            i.greenOnions(4, u.unit),
            i.shallot(1, u.unit),
            i.broccoli(1, u.unit),
            i.arrowRootStarch(2, u.tbsp),
            i.water(.75, u.cup),
            i.aminosCoconut(.25, u.cup),
            i.groundGinger(1, u.tsp),
            i.redPepperFlakes(1, u.tsp),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.oliveOil()), 'on pan on heat 5'],
            ['Cut', this.get(i.flankSteak()), 'into strips'],
            [Timer.set(6, 'm', 'Cook beef')],
            ['Put beef in pyrex bowl'],
            ['Put', this.get(i.greenOnions()), this.get(i.garlicClove()), this.get(i.shallot()), 'in same pan.'],
            [Timer.set(1, 'm', 'Cook')],
            ['Add', this.get(i.broccoli()), 'in same pan with cover.'],
            [Timer.set(5, 'm', 'Cook')],
            ['In a bowl mix', this.get(i.arrowRootStarch()), this.get(i.water()), this.get(i.aminosCoconut()), this.get(i.groundGinger()), this.get(i.redPepperFlakes())],
            [Timer.set(5, 'm', 'Once broccoli is done, remove cover and add sauce. Continue cooking.')],
            [Timer.set(2, 'm', 'Add beef and finish cooking.')],
        ]);
        this.printRecipe();
    }
}
