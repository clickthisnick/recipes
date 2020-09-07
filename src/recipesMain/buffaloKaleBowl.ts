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
        this.variations = [
            {'recipe': [BuffaloKaleBowl]},
        ]
     }

    public init() {
        this.generateRecipes();
    }
}

class BuffaloKaleBowl extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.kale(1, u.unit),
            i.chilliOil(2, u.tbsp),
            i.blackBeans(2, u.tbsp),
            i.wingTimeMediumBuffaloSauce(1.5, u.tbsp),
            i.curryPowder(.5, u.tbsp),
            i.brownRice(1, u.cup),
            i.water(1.5, u.cup)
        ]);
        this.addSteps([
            ['Put', i.brownRice(), 'in instant pot'],
            ['Put in', i.water()],
            [Timer.pressureCook(9, 15, 'm', true)],
                [Async.step, Timer.set(19, 'm', 'Wait', true)],
                    [Async.step, Async.step, 'Put away', i.brownRice()],
                    [Async.step, Async.step, 'Wash', i.kale()],
                    [Async.step, Async.step, 'Rinse', i.blackBeans(), 'in sink with strainer (So bean juice doesnt get on counter)'],
                [Async.step, Timer.preheatPan(7)],
                [Async.step, 'Put in', i.chilliOil(), 'in pan'],
                [Async.step, 'put', i.kale(), 'in pan'],
                [Async.step, Timer.panSautee(5, 'm', 'kale', true)],
                    [Async.step, Async.step, 'Put kale away'],
            [Timer.naturalPressRelease(5, 'm')],
            ['Open steam valve'],
            ['Mix in', i.curryPowder(), 'into rice'],
            ['Take inner instant pot bowl out and put on stove. Put away instant pot.'],
            ['In a bowl mix', i.blackBeans(), i.brownRice(), i.kale(), i.buffaloSauce()],
        ]);
    }
}