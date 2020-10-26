import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../constants/equipment';
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
}

class BuffaloKaleBowl extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.brownRice(1, u.cup),
                i.water(1.5, u.cup)
            ]),
            [Timer.pressureCook(9, 15, 'm', true)],
                [Async.step, Timer.set(19, 'm', 'Wait', true)],
                    [Async.step, Async.step, 'Put away', i.brownRice()],
                    [Async.step, Async.step, 'Wash', i.kale(1, u.unit)],
                    [Async.step, Async.step, 'Rinse', i.blackBeans(2, u.tbsp), 'in sink with strainer (So bean juice doesnt get on counter)'],
                [Async.step, Timer.preheatPan(7)],
                [Async.step, e.pan().add([
                    i.chilliOil(2, u.tbsp),
                    i.kale()
                ])],
                [Async.step, Timer.panSautee(5, 'm', 'kale', true)],
                    [Async.step, Async.step, 'Put kale away'],
            [Timer.naturalPressRelease(5, 'm')],
            ['Open steam valve'],
            i.item('rice').mixIn(i.curryPowder(.5, u.tbsp)),
            ['Take inner instant pot bowl out and put on stove. Put away instant pot.'],
            ['In a bowl mix', i.blackBeans(), i.brownRice(), i.kale(), i.wingTimeMediumBuffaloSauce(1.5, u.tbsp)],
        ]
    }
}
