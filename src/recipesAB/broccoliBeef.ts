import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.addIngredients([
            i.oliveOil(1, u.tbsp),
            i.flankSteak(.5, u.pound),
            i.garlicClove(3, u.unit),
            i.greenOnion(4, u.unit),
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
            [Timer.preheatPan(5)],
            ['Add', i.oliveOil(), 'to pan'],
            ['Cut', i.flankSteak(.5), 'into strips'],
            [Timer.panSear(6, 'm', i.flankSteak(0))],
            ['Put beef in pyrex bowl'],
            ['Put', i.greenOnion(), ',', i.garlicClove(), ',', i.shallot(), 'in same pan.'],
            [Timer.panSear(1, 'm', '')],
            ['Add', i.broccoli(), 'in same pan with cover.'],
            [Timer.panSear(5, 'm', '')],
            ['In a bowl mix', i.arrowRootStarch(), ',', i.water(.75), ',', i.aminosCoconut(.25), ',', i.groundGinger(), ',', i.redPepperFlakes()],
            [Timer.set(4, 'm', 'Once broccoli is done, remove cover and add sauce. Continue cooking.')],
            [Timer.set(2, 'm', 'Add beef and finish cooking.')],
        ]);
        this.printRecipe();
    }
}
