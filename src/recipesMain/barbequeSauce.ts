import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [BarbequeSauce]},
        ]
    }

    public init() {
        this.generateRecipes();
    }
}

class BarbequeSauce extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.tomatoPaste(12, u.ounce),
            i.appleCiderVinegar(1.5, u.cup),
            i.worcestershireSauce(2, u.tbsp),
            i.liquidSmoke(1, u.tbsp),
            i.smokedPaprika(2, u.tsp),
            i.garlicPowder(1, u.tsp),
            i.onionPowder(.5, u.tsp),
            i.seaSalt(.5, u.tsp),
            i.chilliPowder(.25, u.tsp),
            i.cayennePepper(.25, u.tsp),
            i.monkFruit(1/8, u.tsp),
            i.water(1.5, u.cup),
        ])
        this.addSteps([
            ['Get out sauce pan'],
            ['Add', i.tomatoPaste()],
            ['Add', i.appleCiderVinegar()],
            ['Add', i.worcestershireSauce()],
            ['Add', i.liquidSmoke()],
            ['Add', i.smokedPaprika()],
            ['Add', i.garlicPowder()],
            ['Add', i.onionPowder()],
            ['Add', i.seaSalt()],
            ['Add', i.chilliPowder()],
            ['Add', i.cayennePepper()],
            ['Add', i.monkFruit()],
            ['Add', i.water()],
            [Timer.set(5, 'm', 'Put sauce pan on heat 5 until boil')],
            [Timer.set(20, 'm', 'Put sauce pan on heat 3 with lid')],
        ]);
    }
}
