import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer} from '../class/timer';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
constructor() {
    super();
    this.variations = [
        BuffaloKaleBowlWhiteRice, BuffaloKaleBowlBrownRice
    ]
}
}

class BuffaloKaleBowlBrownRice extends Recipe {
constructor() {
    super();
    this.steps = [
        e.instantPot().add([
            i.brownRice(1, u.cup),
            i.water(1.5, u.cup)
        ]),
        e.instantPot().pressureCook(9, 15, 'm'),
        Timer.end(),
        Timer.set(19, 'm', 'Wait'),
        Timer.end(),
        e.pan().preheat(7),
        text.set(['Put away', i.brownRice()]),
        text.set(['Wash', i.kale(1, u.unit)]),
        text.set(['Rinse', i.blackBeans(2, u.tbsp), 'in sink with strainer (So bean juice doesn\'t get on counter)'],),
        Timer.end(),
        e.pan().add([
            i.chilliOil(2, u.tbsp),
            i.kale(),
        ]),
        Timer.set(2.5, 'm', 'Sautee kale'),
        text.set(['Put kale away']),
        Timer.end(),
        Timer.set(2.5, 'm', 'Stir and keep sauteeing kale'),
        Timer.end(),
        Timer.set(5, 'm', 'release instant pot pressure'),
        Timer.end(),
        text.set(['Open steam valve']),
        i.whiteRice().mixIn([
            i.curryPowder(.5, u.tbsp)
        ]),
        text.set(['In a bowl mix', i.blackBeans(), i.brownRice(), i.kale(), i.wingTimeMediumBuffaloSauce(1.5, u.tbsp)]),
    ]
}
}

class BuffaloKaleBowlWhiteRice extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.whiteRice(1, u.cup),
                i.water(1.5, u.cup)
            ]),
            e.instantPot().pressureCook(9, 5, 'm'),
            Timer.end(),
            Timer.set(9, 'm', 'Wait'),
            Timer.end(),
            e.pan().preheat(7),
            text.set(['Put away', i.brownRice()]),
            text.set(['Wash', i.kale(1, u.unit)]),
            text.set(['Rinse', i.blackBeans(2, u.tbsp), 'in sink with strainer (So bean juice doesn\'t get on counter)'],),
            Timer.end(),
            e.pan().add([
                i.chilliOil(2, u.tbsp),
                i.kale(),
            ]),
            Timer.set(2.5, 'm', 'Sautee kale'),
            text.set(['Put kale away']),
            Timer.end(),
            Timer.set(2.5, 'm', 'Stir and keep sauteeing kale'),
            Timer.end(),
            Timer.set(5, 'm', 'release instant pot pressure'),
            Timer.end(),
            text.set(['Open steam valve']),
            i.whiteRice().mixIn([
                i.curryPowder(.5, u.tbsp)
            ]),
            text.set(['In a bowl mix', i.blackBeans(), i.brownRice(), i.kale(), i.wingTimeMediumBuffaloSauce(1.5, u.tbsp)]),
        ]
    }
}
