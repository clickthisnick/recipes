import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'carnivore';
        this.recipeGroup = c.component;
        this.variations = [
            ChickenThighs, BaconEggs
        ]
    }
}

class ChickenThighs extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add([
                i.butter(1, u.tsp),
            ]),
            e.pan().cook(1, 'm', 5),
            Timer.end(),
            e.pan().add([
                i.chickenThigh(1.5, u.pound),
            ]),
            e.pan().cook(4, 'm', 5),
            Timer.end(),
            text.set(['Flip', i.chickenThigh()]),
            e.pan().cook(4, 'm', 5),
            Timer.end(),
            i.chickenThigh().seasonWith([
                i.blackPepper(4, u.crack),
                i.salt(.5, u.tsp),
            ]),
            text.set(['Flip', i.chickenThigh()]),
            e.pan().cook(3, 'm', 7),
            Timer.end(),
            i.chickenThigh().seasonWith([
                i.blackPepper(4, u.crack),
                i.salt(.5, u.tsp),
            ]),
            text.set(['Flip', i.chickenThigh()]),
            e.pan().cook(3, 'm', 7),
            Timer.end(),
        ];
    }
}

class BaconEggs extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add([
                i.butter(1, u.tsp),
            ]),
            e.pan().cook(1, 'm', 5),
                i.bacon(4, u.slice).cutIntoStrips(),
            Timer.end(),
            e.pan().add([
                i.bacon(),
            ]),
            e.pan().cook(4, 'm', 7),
            Timer.end(),
            text.set(['Flip', i.bacon()]),
            e.pan().cook(4, 'm', 7),
                e.bowl().add([
                    i.egg(4, u.unit),
                ]),
                e.bowl().stir(),
            Timer.end(),
            text.set(['Remove bacon from pan']),
            Timer.set(2, 'm', 'Turn pan heat off'),
            Timer.end(),
            e.pan().add([
                i.egg(),
            ]),
            e.pan().cook(4, 'm', 5),
            Timer.end(),
            text.set(['Push eggs in from side']),
            e.pan().cook(3, 'm', 5),
            Timer.end(),
            text.set(['Scramble Eggs into 1/2 inch strips']),
            e.pan().cook(1, 'm', 5),
            Timer.end(),
        ];
    }
}
