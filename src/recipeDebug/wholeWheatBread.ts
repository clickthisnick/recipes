import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.snack;
        this.recipeName = 'WholeWheatBread'
        this.variations = [
            WholeWheatBread
        ]
    }
}

export class WholeWheatBread extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.kitchenAidMixingBowl().add([
                i.wholeWheatFlour(3.5, u.cup),
                i.dryActiveYeast(4, u.tsp),
            ]),
            e.kitchenAidMixingBowl().mixWithDoughHook(1),
            Timer.end(),
            e.bowl().add([
                i.water(2.5, u.cup),
            ]),
            e.bowl().microwave(1.05),
            Timer.end(),
            e.kitchenAidMixingBowl().add([
                i.ingredient('Microwaved water')
            ]),
            e.kitchenAidMixingBowl().mixWithDoughHook(1),
            Timer.end(),
            Timer.set(10, 'm', 'Cover the kitchenaid bowl'),
            Timer.end(),
            e.oven().preheat(350),
                e.kitchenAidMixingBowl().add([
                    i.salt(1, u.tbsp),
                    i.coconutOil(1/3, u.cup),
                    i.honey(1/3, u.cup),
                    i.lemonJuice(4, u.tsp)
                ]),
                e.kitchenAidMixingBowl().mixWithDoughHook(1),
                Timer.end(),
            Timer.end(),
            e.kitchenAidMixingBowl().add([
                i.wholeWheatBread(2.5, u.cup),
            ]),
            e.kitchenAidMixingBowl().mixWithDoughHook(3),
                text.set(['Grease 2 bread pans']),
            Timer.end(),
            text.set(['Turn off oven']),
            Timer.set(1, 'm', 'wait for oven to get less warm'),
            Timer.end(),
            Timer.set(20, 'm', 'Put dough in bread pans and put in oven'),
            Timer.end(),
            Timer.set(30, 'm', 'Turn oven to 350'),
            Timer.end()
        ];
    }
}
