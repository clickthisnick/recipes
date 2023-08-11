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
        this.recipeType = c.component;
        this.variations = [
            Zoodles
        ]
    }
}

class Zoodles extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.oven().preheat(350),
            text.set(['Get', i.zuchinni(1.5, u.unit), 'and spiralize with KitchenAid']),
            text.set(['Put', i.zuchinni(), 'in a pan and salt']),
            i.babyBellaMushroom(3, u.unit).cutIntoSlices(),
            text.set(['Put', i.babyBellaMushroom(), 'in another pan and salt and pepper']),
            Timer.end(),
            Timer.set(15, "m", "Cook zoodles"),
            Timer.end(),
        ];
    }
}
