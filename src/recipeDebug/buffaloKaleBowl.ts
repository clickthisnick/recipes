import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer, Timer as timer} from '../class/timer';
import { Text as text} from '../class/text';
// import { time as t } from '../class/time';

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
            e.instantPot().pressureCook(9, 15, 'm'),
            Timer.end(),
            timer.set(19, 'm', 'Wait'),
            Timer.end(),
            e.pan().preheat(7),
            text.set(['Put away', i.brownRice()]),
            text.set(['Wash', i.kale(1, u.unit)]),
            text.set(['Rinse', i.blackBeans(2, u.tbsp), 'in sink with strainer (So bean juice doesnt get on counter)'],),
            timer.end(),
            // [e.pan().add([
            //     i.chilliOil(2, u.tbsp),
            //     i.kale(),
            // ])],
            // //[Timer.panSautee(5, 'm', 'kale')],
            // ['Put kale away'],
            // //[Timer.naturalPressRelease(5, 'm')],
            // ['Open steam valve'],
            // i.item('rice').mixIn(i.curryPowder(.5, u.tbsp)),
            // ['In a bowl mix', i.blackBeans(), i.brownRice(), i.kale(), i.wingTimeMediumBuffaloSauce(1.5, u.tbsp)],
        ]
    }
}
