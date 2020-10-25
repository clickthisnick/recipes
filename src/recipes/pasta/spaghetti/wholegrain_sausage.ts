import { Recipe } from '../../../class/recipe';
import { Items as i } from '../../../constants/items';
import { Timer } from '../../../class/timer';
import { Units as u } from '../../../constants/units';

export class WholeGrainSpaghettiSausage extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addSteps([
            ['Add', i.italianSausage(4, u.ounce), 'to instant pot'],
            [Timer.instantPotSautee(4, 'm', i.italianSausage(0))],
            ['Remove', i.italianSausage(0), 'from instant pot'],
            ['Add', i.water(.5, u.cup)],
            ['Add', i.spaghettiSauce(25, u.ounce)],
            ['Add', i.spaghettiWholeGrain(8, u.ounce)],
            ['Add', i.water(.5, u.cup), '(Don\'t stir)'],
            [Timer.pressureCook(0, 8, 'm', true)],
            ['Release steam valve and serve'],
        ]);
    }
}
