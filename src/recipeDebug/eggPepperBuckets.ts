import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [EggPepperBuckets]},
        ]
    }
}

class EggPepperBuckets extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add(i.avacadoOil(2, u.second)),
            e.pan().preheat(6, 2),
            text.set(['Cut into 4 horitzontal buckets the', i.bellPepper(1, u.unit)]),
            Timer.end(),
            e.pan().add(i.bellPepper()),
            e.pan().cook(2, 'm'),
            Timer.end(),
            text.set(['Flip', i.bellPepper()]),
            text.set(['Crack', i.egg(4, u.unit), 'and put into the horizontal slices of', i.bellPepper()]),
            e.pan().cook(3, 'm'),
        ];
    }
}
