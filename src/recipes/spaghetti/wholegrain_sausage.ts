import { Recipe } from '../../class/recipe';
import { Items as i } from '../../constants/items';
import { Timer } from '../../class/timer';
import { Units as u } from '../../constants/units';

export class WholeGrainSausage extends Recipe {
    public generateRecipe() {
        this.recipeId = 'whole grainsausage';
        this.addIngredients([
            i.italianSausage(4, u.ounce),
            i.spaghettiWholeGrain(8, u.ounce),
            i.spaghettiSauce(25, u.ounce),
            i.water(1, u.cup),
        ]);
        this.addSteps([
            ['Add', i.italianSausage(), 'to instant pot'],
            [Timer.instantPotSautee(4, 'm', i.italianSausage(0))],
            ['Remove', i.italianSausage(0), 'from instant pot'],
            ['Add', i.water(.5, u.cup)],
            ['Add', i.spaghettiSauce()],
            ['Add', i.spaghettiWholeGrain()],
            ['Add', i.water(.5, u.cup), '(Don\'t stir)'],
            [Timer.pressureCook(8, 'm', true)],
            ['Release steam valve and serve'],
        ]);
        this.printRecipe();
    }
}
