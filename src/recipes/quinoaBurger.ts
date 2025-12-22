import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            QuinoaBurger
        ]
    }
}

export class QuinoaBurger extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.toasterOven().add([
                i.quinoaBurger(2, u.unit),
            ]),
            e.toasterOven().cook(8, 'm', 450),        
            Timer.end(),
            e.toasterOven().broil(1, 'm', 450),
            Timer.end(),
            text.set(['Flip']),
            e.toasterOven().broil(1, 'm', 450),
            Timer.end(),

        ];
    }
}
