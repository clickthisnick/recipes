import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.meal;
        this.variations = [
            ThawedHomemadeSausageEggs
        ]
    }
}

export class ThawedHomemadeSausageEggs extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add([
                i.homemadeItalianSausage(8, u.ounce),
                i.Groups.mushroom(4, u.ounce),
            ]),
            e.pan().cook(7, 'm', 4),
            Timer.end(),
            e.pan().add(
                i.egg(4, u.unit),
            ),
            e.pan().cook(2, 'm', 4),
            Timer.end(),
            e.pan().stir(),
            e.pan().cook(2, 'm', 4),
            Timer.end(),
        ];
    }
}
