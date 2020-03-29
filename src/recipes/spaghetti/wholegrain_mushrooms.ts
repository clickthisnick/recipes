import { Recipe } from '../../class/recipe';
import { Items as i } from '../../constants/items';
import { Timer } from '../../class/timer';
import { Units as u } from '../../constants/units';
import { WholeGrain } from './wholegrain';

export class WholeGrainMushroom extends Recipe {
    constructor() {
        super();
        this.recipeId = 'mushrooms';
        this.compoundRecipeId = `${new WholeGrain().recipeId}${this.recipeId}`;
    }
    public generateRecipe() {
        this.addIngredients([
            i.crimniMushroom(8, u.ounce),
            i.spaghettiWholeGrain(8, u.ounce),
            i.spaghettiSauce(25, u.ounce),
            i.chilliOil(1, u.tsp),
            i.water(1, u.cup),
        ]);
        this.addSteps([
            ['Add', i.chilliOil(), i.crimniMushroom(), 'to instant pot'],
            [Timer.instantPotSautee(5, 'm', i.crimniMushroom(0))],
            ['Remove', i.crimniMushroom(0), 'from instant pot'],
            ['Add', i.water(.5, u.cup)],
            ['Add', i.spaghettiSauce()],
            ['Add', i.spaghettiWholeGrain()],
            ['Add', i.water(.5, u.cup), '(Don\'t stir)'],
            [Timer.pressureCook(8, 'm', true)],
            ['Release steam valve and serve'],
        ]);
    }
}
