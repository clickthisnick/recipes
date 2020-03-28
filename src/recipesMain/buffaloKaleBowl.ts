import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'Buffalo Kale Bowl';
        this.recipeGroup = c.meal;
        this.recipeOptions = [
            {'recipe': ['default']},
         ];
     }

     public init() {
         this.generateRecipes([
            BuffaloKaleBowl
         ]);
     }
}

class BuffaloKaleBowl extends Recipe {
    public generateRecipe() {
        this.recipeId = 'default';
        this.addIngredients([
            i.kale(1, u.unit),
            i.chilliOil(2, u.tbsp),
            i.dash(1, u.unit),
            i.blackBeans(2, u.tbsp),
            i.brownSugar(1, u.cup),
            i.buffaloSauce(2, u.tbsp),
            i.curryPowder(2, u.tbsp),
            i.brownRice(1, u.cup),
            i.water(1.5, u.cup)
        ]);
        this.addSteps([
            ['Put', i.brownRice(), 'in instant pot'],
            ['Put in', i.water()],
            [Timer.pressureCook(15, 'm', true)],
            [Async.step, Timer.set(10, 'm', 'Wait')],
            [Async.step, Timer.preheatPan(7)],
            [Async.step, 'Put in', i.chilliOil(), 'in pan'],
            [Async.step, 'Put in', i.kale(), 'in pan'],
            [Async.step, Timer.panSautee(5, 'm', 'kale')],
            [Timer.set(5, 'm', 'let instant pot sit without opening steam valve')],
            ['Open steam valve'],
            ['Mix in', i.curryPowder(), 'into rice'],
            ['In a bowl mix', i.blackBeans(), i.brownRice(0), i.kale(0), i.buffaloSauce()],
        ]);
    }
}
