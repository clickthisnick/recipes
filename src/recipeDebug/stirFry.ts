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
        this.recipeName = 'StirFry'
        this.variations = [
            SitrFryChicken,
            StirFryVegan,
        ]
    }
}

class SitrFryChicken extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().preheat(4, 2),
            i.chickenThigh(1, u.pound).cutIntoSlices(),
            Timer.end(),
            e.pan().add([
                i.oliveOil(1, u.tbsp),
                i.soySauce(1, u.tsp),
                i.pepperFlake(1, u.tsp),
                i.chickenThigh(),
            ]),
            e.pan().cook(4, "m", 4),
            i.carrots(2, u.unit).peel(),
            i.carrots().cutIntoThinSlices(),
            i.celery(2, u.stick).cutIntoSlices(),
            i.whiteMushroom(4, u.unit).cutIntoThinSlices(),
            text.set(["Cut", i.Groups.onion(1, u.unit)]),
            Timer.end(),
            text.set(['Remove chicken from pan']),
            e.pan().add([
                i.Groups.onion(),
                i.carrots(),
                i.celery(),
                i.whiteMushroom(),
            ]),
            e.pan().cook(3, "m", 4),
            Timer.end(),
        ]
    }
}


class StirFryVegan extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().preheat(4, 2),
            text.set(["Peel and cut", i.carrots(2, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.oliveOil(1, u.tbsp),
                i.carrots(),
            ]),
            Timer.set(2, 'm'),
            text.set(["Cut", i.yellowOnion(2, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.yellowOnion(),
            ]),
            Timer.set(2, 'm'),
            text.set(["Cut", i.broccoli(2, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.broccoli(),
            ]),
            Timer.set(1, 'm'),
            text.set(["Cut", i.whiteMushroom(5, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.whiteMushroom(),
            ]),
            Timer.set(4, 'm'),
            text.set(["Cut", i.cabbage(1, u.unit)]),
            Timer.end(),
            e.pan().add([
                i.cabbage(),
            ]),
            Timer.set(3, 'm'),
            Timer.end(),
        ]
    }
}
