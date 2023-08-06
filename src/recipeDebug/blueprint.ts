import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Text as text} from '../class/text';

// 1570 Calories - Green Giant / Super Veggie / Nutty Pudding
export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'blueprint';
        this.recipeGroup = c.component;
        this.variations = [
            SuperVeggie, NuttyPudding2Days, SweetPotato
        ]
    }
}

class SweetPotato extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.oven().preheat(425),
            Timer.end(),
            e.pan().add([
                i.sweetPotatoes(4, u.unit),
                i.oliveOil(3, u.tbsp),
            ]),
            e.pan().cook(30, 'm', 425),
            Timer.end(),
        ];
    }
}

// TODO needs some work but is basically right
 // Lentils - 600 Calories
 // Olive Oil - 120 Calories
 // Hemp - 60 Calories
 // Apple Cider Vinegar - 20 Calories
 // Ginger 3G - 5 Calories
 // Garlic Clove - 4 Calories
 // Musrooms - 24 Calories
 // Broccoli - 85 Calories
 // Cauliflower - 38 Calories
 // Cumin - 22 Calories
 // 978 Calories

class SuperVeggie extends Recipe {
    constructor() {
        super();

        this.steps = [
            e.pot(0).add([
                i.blackLentils(1, u.smallstainlesssteelcontainer), // 200 grams
                i.water(1, u.smallstainlesssteelcontainer), // 3 cups
            ]),
            e.pot(0).cookWithLidSlightlyOff(21, 'm', 7, "lentils"), // 20 min for black/ 23 min for green total
                text.set(['Drink a glass of water with morning pills']),
                text.set(['Drink the green giant']),
                e.pan().add([
                    i.ingredient("broccoli/shitake mushroom", 1, u.smallstainlesssteelcontainer),
                    i.broccoli(1, u.largestainlesssteelcontainer)
                ]),
                // Cook pan until lentils are done
                e.pan().cookWithLid(14, 'm', 5, "broccoli"),
                    text.set(['Do stretch routine.']),
                    // Alex
                    // e.pan(2).add([ // tmp for partner
                    //     i.broccoli(50, u.gram),
                    //     i.cauliflower(30, u.gram),
                    // ]),
                Timer.end(),
            Timer.end(),
            i.ingredient('lentil').seasonWith([
                i.cumin(1, u.tbsp),
                i.lime(1, u.unit),
                i.oliveOil(1, u.tbsp),
                i.freshGinger(3, u.gram),
                i.appleCiderVinegar(1, u.tbsp),
                i.hempSeed(1, u.tbsp),
                i.freshGinger(3, u.gram),
                i.garlicClove(1, u.unit),
            ])
        ];
    }
}

class NuttyPudding2Days extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bulletMixer().add([
                i.pomegranateJuice(113.4, u.gram),
                i.almondMilk(210, u.gram),
                i.ingredient('NuttyPudding mixture'),
                // blend for 1 minute on low
                i.strawberry(246, u.gram),
                i.cherry(6, u.unit),
                // blend for 1 minute on low
            ]),
            e.bulletMixer().mix(),
        ];
    }
}
