import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'ButterChicken';
        this.recipeGroup = c.meal;
    }

    public init() {
        this.generateRecipes([
            {'recipe': [ButterChicken]},
        ]);
    }
}

class ButterChicken extends Recipe {
    constructor() {
        super();
        this.recipeId = 'butterchicken';
    }
    public generateRecipe() {
        this.addIngredients([
            i.oliveOil(1, u.tbsp),
            i.butter(1, u.tbsp),
            i.whiteOnion(1, u.unit),
            i.groundGinger(2, u.tbsp),
            i.garlicClove(5, u.unit),
            i.tomatoPaste(6, u.ounce),
            i.water(.5, u.cup),
            i.chickenThigh(2, u.pound),
            i.gramMasala(1, u.tbsp),
            i.paprika(1, u.tsp),
            // i.sugar(1, u.tbsp), This was original amount
            i.sugar(2, u.tsp),
            i.cumin(1, u.tsp),
            i.turmeric(.5, u.tsp),
            // i.salt(1, u.tsp), This was original amount
            i.salt(.5, u.tsp),
            i.blackPepper(1, u.tsp),
            i.coconutCream(.75, u.cup),
        ]);
        this.addSteps([
            ['Preheat Instant Pot with Saute on low setting'],
            ['Dice', i.whiteOnion()],
            ['Dice', i.garlicClove()],
            ['Add', i.oliveOil(), 'and', i.butter(), 'into instant pot'],
            ['Add', i.whiteOnion(0), 'and', i.groundGinger(), 'and all the', i.garlicClove(0)],
            [Timer.set(4, 'm', 'Saute in instant pot', true)],
                [Async.step, 'Cut', i.chickenThigh(), 'into 1 inch cubes'],
                [Async.step, 'Wash knife'],
                [Async.step, 'Wash cutting boards'],
            ['Add', i.tomatoPaste()],
            [Timer.set(3, 'm', 'Constantly stir')],
            ['Put', i.water(), 'in instant pot'],
            ['Put', i.chickenThigh(0), 'in instant pot'],
            ['Add spice', i.gramMasala()],
            ['Add spice', i.paprika()],
            ['Add spice', i.sugar()],
            ['Add spice', i.cumin()],
            ['Add spice', i.turmeric()],
            ['Add spice', i.salt()],
            ['Add spice', i.blackPepper()],
            [Timer.pressureCook(5, 'm')],
            [Timer.set(10, 'm', 'Let it slow release', true)],
                [Async.step, 'Put away spices'],
                [Async.step, 'Wash utensils'],
            ['Stir in', i.coconutCream()],
            [Timer.set(3, 'm', 'Saute on medium')],
        ]);
    }
}
