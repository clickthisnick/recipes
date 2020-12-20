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
        this.recipeGroup = c.meal;
        this.recipeName = 'Eggs'
        this.variations = [
            ThawedHomemadeSausageEggs
        ]
    }
}

export class ThawedHomemadeSausageEggs extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add(
                i.homemadeItalianSausage(1, u.pound),
            ),
            text.set(['Add lid on pan']),
            e.pan().cook(7, 'm', 4),
            Timer.end(),
            e.pan().add(
                i.egg(6, u.unit),
            ),
            e.pan().cook(2, 'm', 4),
            Timer.end(),
            e.pan().stir(),
            e.pan().cook(2, 'm', 4),
            Timer.end(),
        ];
    }
}
