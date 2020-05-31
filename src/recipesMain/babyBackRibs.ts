import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [BabyBackRibs]},
         ]
     }

     public init() {
        this.generateRecipes();
     }
}

class BabyBackRibs extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.babyBackRibs(1.5, u.pound),
            i.water(1.5, u.cup),
            i.liquidSmoke(3, u.tbsp),
            i.appleCiderVinegar(.33, u.cup),
            i.barbecueSauce(1, u.cup),
        ]);

        this.addSteps([
            ['Put trivet in instant pot'],
            ['Add', i.water(), i.liquidSmoke(), i.appleCiderVinegar(), 'into instant pot'],
            ['Remove silver skin from ribs'],
            ['Rub dry rub all over', i.babyBackRibs()],
            ['Put', i.babyBackRibs(), 'meat side facing outer edge of instant pot'],
            [Timer.pressureCook(9.5, 25, 'm', true)],
            [Timer.naturalPressRelease(10, 'm', true)],
                [Async.step, 'Preheat oven to broil on 400 degrees'],
            ['Release instant pot pressure'],
            ['Rub', i.barbecueSauce(), 'over', i.babyBackRibs(0)],
            [Timer.set(2, 'm', 'Broil ribs')]
        ]);
    }
}
