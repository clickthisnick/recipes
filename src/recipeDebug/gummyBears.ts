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
            GummyBears
        ]
    }
}

class GummyBears extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bowl().add([
                i.water(.5, u.cup),
                i.limeJuice(1, u.tbsp),
            ]),
            e.bowl().mix(),
            e.bowl().add([
                i.gelatin(3, u.tbsp),
            ]),
            e.bowl().microwave(25, "s"),
            Timer.end(),
            e.bowl().mix(),
            e.bowl().add([
                i.monkFruit(.5, u.tsp),
                i.citricAcid(.5, u.tsp),
                i.ingredient("Propel or other mix drink flavoring")
            ]),
            text.set(['Pour mixture in gummy bear molds']),
            Timer.set(15, "m", "Wait for bears to harden"),
            Timer.end(),
        ];
    }
}
