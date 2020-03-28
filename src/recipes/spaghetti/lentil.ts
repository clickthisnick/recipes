import { Recipe } from '../../class/recipe';
import { Items as i } from '../../constants/items';
import { Timer } from '../../class/timer';
import { Units as u } from '../../constants/units';

export class Lentil extends Recipe {
    public generateRecipe() {
        this.recipeId = 'lentil';
        this.addIngredients([
            i.spaghettiLentil(8, u.ounce),
            i.spaghettiSauce(25, u.ounce),
            i.water(1, u.cup),
        ]);
        this.addSteps([
            ['Add', i.water(.5, u.cup)],
            ['Add', i.spaghettiSauce()],
            ['Add', i.spaghettiLentil()],
            ['Add', i.water(.5, u.cup), '(Don\'t stir)'],
            [Timer.pressureCook(10, 'm', true)],
            ['Release steam valve and serve'],
        ]);
    }
}
