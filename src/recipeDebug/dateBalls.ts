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
            Timer.set(5, 'm', 'Soak 40 dates in a bowl'), 
            Timer.end(),
            e.blender().add([
                [i.pittedDates(40, u.unit), 'checking that there are no pits'],
                i.cacaoPowderUnsweetened(1, u.cup),
                i.collagenPowder(2, u.cup),
                i.water(1, u.cup)
            ]),
            text.set(['Blend for 30 seconds, stir, repeat until dough like']),
            e.blender().add([
                [i.cashewButter(56, u.tbsp), '(2 full 16 ounce containers)']
            ]),
            text.set(['Blend for 10 seconds, stir, repeat until dough like']),
            text.set(['Remove blender base from top']),
            text.set(['Take a tbsp of batter and cut on cutting board, repeat until no more batter. Makes around 60']),
            Timer.set(120, 'm', 'Put on plastic cutting board and put into fridge'),
            Timer.end(),
            text.set(['Wash blender while still able to. (Wait a day and its 200% harder to clean)']),
            text.set(['Transfer pieces into plastic container and keep in freezer']),
        ];
    }
}
