import { Recipe } from '../../../class/recipe';
import { Items as i } from '../../../constants/items';
import { Timer } from '../../../class/timer';
import { Units as u } from '../../../constants/units';

export class LentilPenne extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.penneLentil(8, u.ounce),
            i.spaghettiSauce(25, u.ounce),
            i.water(1, u.cup),
            i.oliveOil(1, u.ounce),
        ]);
        this.addSteps([
            ['Add', i.oliveOil(1, u.ounce)],
            ['Add', i.water(1, u.cup)],
            ['Add', i.penneLentil()],
            ['Add', i.spaghettiSauce()],
            ['Stir'],
            [Timer.pressureCook(0, 11, 'm', true)],
            ['Release steam valve and serve'],
        ]);
    }
}
