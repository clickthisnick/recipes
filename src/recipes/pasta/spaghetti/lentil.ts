import { Recipe } from '../../../class/recipe';
import { Items as i } from '../../../constants/items';
import { Timer } from '../../../class/timer';
import { Units as u } from '../../../constants/units';

export class LentilSpaghetti extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addSteps([
            ['Add', i.water(.5, u.cup)],
            ['Add', i.spaghettiSauce(25, u.ounce)],
            ['Add', i.spaghettiLentil(8, u.ounce)],
            ['Add', i.water(.5, u.cup), '(Don\'t stir)'],
            [Timer.pressureCook(15, 10, 'm', true)],
            ['Release steam valve and serve'],
        ]);
    }
}
