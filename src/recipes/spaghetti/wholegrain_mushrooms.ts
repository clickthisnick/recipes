import { Recipe } from '../../class/recipe';
import { Items as i } from '../../constants/items';
import { Timer } from '../../class/timer';
import { Units as u } from '../../constants/units';
import { Async } from '../../class/async';

export class WholeGrainMushroom extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.babyBella(8, u.ounce),
            i.spaghettiWholeGrain(8, u.ounce),
            i.spaghettiSauce(25, u.ounce),
            i.chilliOil(1, u.tsp),
            i.water(1, u.cup),
            i.dash(1, u.unit),
        ]);
        this.addSteps([
            ['Add', i.chilliOil(), i.babyBella(), 'to instant pot'],
            [Timer.instantPotSautee(9, 'm', i.babyBella(0), true)],
            [Async.step, 'season with', i.dash()],
            ['Remove', i.babyBella(0), 'from instant pot'],
            ['Add', i.water(.5, u.cup)],
            ['Add', i.spaghettiSauce()],
            ['Add', i.spaghettiWholeGrain()],
            ['Add', i.water(.5, u.cup), '(Don\'t stir)'],
            [Timer.pressureCook(0, 8, 'm', true)],
            ['Release steam valve and serve'],
        ]);
    }
}
