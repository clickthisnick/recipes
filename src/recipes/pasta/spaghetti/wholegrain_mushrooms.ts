import { Recipe } from '../../../class/recipe';
import { Items as i } from '../../../constants/items';
import { Timer } from '../../../class/timer';
import { Units as u } from '../../../constants/units';
import { Async } from '../../../class/async';

export class WholeGrainSpaghettiMushroom extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addSteps([
            ['Add', i.chilliOil(1, u.tsp), i.babyBella(8, u.ounce), 'to instant pot'],
            [Timer.instantPotSautee(9, 'm', i.babyBella(), true)],
            [Async.step, 'season with', i.dash(1, u.unit)],
            ['Remove', i.babyBella(), 'from instant pot'],
            ['Add', i.water(.5, u.cup)],
            ['Add', i.spaghettiSauce(25, u.ounce)],
            ['Add', i.spaghettiWholeGrain(8, u.ounce)],
            ['Add', i.water(.5, u.cup), '(Don\'t stir)'],
            [Timer.pressureCook(0, 8, 'm', true)],
            ['Release steam valve and serve'],
        ]);
    }
}
