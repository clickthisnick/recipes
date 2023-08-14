import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            DateBalls,
            PeanutSludge,
        ]
     }
}

class PeanutSludge extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.kitchenAidMixingBowl().add([
                i.water(.25, u.cup),
                i.cacaoPowderUnsweetened(1, u.tbsp),
            ]),
            e.kitchenAidMixingBowl().mixWithFlatBeater(3, 1),
            Timer.end(),
            e.kitchenAidMixingBowl().add([
                i.peanutButter(6, u.ounce),
            ]),
            e.kitchenAidMixingBowl().mixWithFlatBeater(5, 2),
            Timer.end(),
            Timer.set(45, 'm', 'Put in freezer'),
            Timer.end(),
        ];
    }
}


class DateBalls extends Recipe {
    constructor() {
        super();
        this.steps = [
            // Technically cashew butter should be 4 cups (64 tbsp) but this is easier since it's 2 full containers
            text.set(['Put', i.pittedDates(20, u.unit), 'in a', e.bowl()]),
            Timer.set(5, 'm', 'Soak the dates'),
            Timer.end(),
            i.pittedDates().dice(),
            e.kitchenAidMixingBowl().add([
                i.pittedDates(),
                i.cacaoPowderUnsweetened(.5, u.cup), // Use the same utensil
                i.collagenPowder(.5, u.cup),
                i.collagenPowder(.5, u.cup),
                i.water(.5, u.cup),
                i.water(.5, u.cup),
                i.water(.5, u.cup),
            ]),
            e.kitchenAidMixingBowl().mixWithFlatBeater(2, 3),
            Timer.end(),
            e.kitchenAidMixingBowl().add([
                //[i.cashewButter(16, u.ounce), '(1 full 16 ounce containers)']
                i.peanutButter(16, u.ounce),
            ]),
            e.kitchenAidMixingBowl().mixWithFlatBeater(0, 2),
            Timer.end(),
            e.kitchenAidMixingBowl().mixWithFlatBeater(1, 1),
            Timer.end(),
            text.set(['Take a tbsp of batter and put on cutting board, repeat until no more batter. Makes around 60']),
            Timer.set(60, 'm', 'Put on plastic cutting board and put into freezer'),
            Timer.end(),
            text.set(['Transfer pieces into plastic container and keep in freezer']),
        ];
    }
}
