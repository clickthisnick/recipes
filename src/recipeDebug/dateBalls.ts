import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            DateBalls
        ] 
     }
}

class DateBalls extends Recipe {
    constructor() {
        super();
        this.steps = [
            // Technically cashew butter should be 4 cups (64 tbsp) but this is easier since it's 2 full containers
            Timer.set(5, 'm', 'Soak 20 dates in a bowl'), 
            Timer.end(),
            i.pittedDates(20, u.unit).dice(),
            e.kitchenAidMixingBowl().add([
                i.pittedDates(),
                i.cacaoPowderUnsweetened(.5, u.cup),
                i.collagenPowder(1, u.cup),
                i.water(1, u.cup),
                i.water(.33, u.cup),
            ]),
            e.kitchenAidMixingBowl().mixWithWhisk(1),
            Timer.end(),
            e.kitchenAidMixingBowl().add([
                //[i.cashewButter(16, u.ounce), '(1 full 16 ounce containers)']
                i.peanutButter(16, u.ounce),
            ]),
            e.kitchenAidMixingBowl().mixWithWhisk(1),
            Timer.end(),
            text.set(['Take a tbsp of batter and put on cutting board, repeat until no more batter. Makes around 60']),
            Timer.set(120, 'm', 'Put on plastic cutting board and put into freezer'),
            Timer.end(),
            text.set(['Transfer pieces into plastic container and keep in freezer']),
        ];
    }
}
