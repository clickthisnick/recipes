import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer} from '../class/timer';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            MeatlessTaco,
        ]
    }
}

class MeatlessTaco extends Recipe {
    constructor() {
        super(); 
        // TODO add make rice
        this.steps = [
           i.whiteMushroom(8, u.ounce).cutIntoSlices(),
           i.blackBeans(13, u.ounce).rinse(),
           i.organicBlackKalamataOlives(16, u.unit).cutInHalf(),
           e.pan().add([
                i.whiteMushroom(),
                i.oliveOil(2, u.tsp),
           ]),
           e.pan().cook(13, 'm', 6),
           text.set(['Stir occasionally, until browned']),
           Timer.end(),
           e.pan().add([i.blackBeans()]),
           e.pan().cook(2, 'm', 6),
           Timer.end(),
           e.pan().add([

                i.organicBlackKalamataOlives()
           ]),
           e.pan().cook(30, 's', 6),
           Timer.end(),
           text.set(['Add cooked rice to pan. TODO add rice cooking in recipe']),
        ];
    }
}
