import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Text as text} from '../class/text';

// 1570 Calories - Green Giant / Super Veggie / Nutty Pudding
export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            GreenGiant, SuperVeggie, NuttyPudding2Days, SweetPotato3Days, NuttyPudding8Days, SweetPotato8Days, SuperVeggie8Days
        ]
    }
}

class SweetPotato1Days extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.oven().preheat(425),
            Timer.end(),
            e.pan().add([
                i.sweetPotatoes(300, u.gram),
                i.oliveOil(1, u.tbsp),
            ]),
            e.pan().cook(30, 'm', 425),
            Timer.end(),
            text.set(["300g of sweet potato per serving"]),
        ];
    }
}

class SweetPotato3Days extends Recipe {
    constructor() {
        super();

        const recipe = new SweetPotato1Days()
        recipe.multiplyIngredients(3)

        this.steps = recipe.steps;
    }
}

class GreenGiant extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.mug().add([
                // 2 Tbsp chlorella powder, yielding 13.5mg spermidine
                i.chlorellaPowder(4, u.halftbsp), // 60 tablets https://www.plantpills.co.uk/chlorella-tablets
                i.aminoComplex(7.6, u.gram),
                i.creatine(2.5, u.gram),
                i.water(8, u.ounce),
            ])
        ];
    }
}

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
            e.oven(0).preheat(425),
            Timer.end(),
            e.pot(0).cookWithLidSlightlyOff(21, 'm', 7, "lentils", "clicked"), // 20 min for black/ 23 min for green total
                text.set(['Put on redlight therapy cap.']),
                text.set(['Drink a glass of water with morning pills']),
                e.pan(0).add([
                    i.ingredient("frozen cauliflower/shitake mushroom", 1, u.smallstainlesssteelcontainer),
                    i.frozenBroccoli(1, u.largestainlesssteelcontainer)
                ]),
                // Cook pan until lentils are done
                e.pan(0).cookWithLid(15, 'm', 5, "broccoli", "clicked"),
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
                //i.lime(1, u.unit),
                // These are now in nutty pudding
                // i.hempSeed(1, u.tbsp),
                // i.chiaSeed(2, u.tbsp),
                //i.freshGinger(3, u.gram),
                //i.garlicClove(1, u.unit),
                i.oliveOil(1, u.tbsp),
                i.appleCiderVinegar(1, u.tbsp),
            ]),
            e.pan(1).add([
                i.sweetPotatoes(300, u.gram),
                i.oliveOil(1, u.tbsp),
            ]),
            e.pan(1).cook(25, 'm', 425),
            Timer.end(),
            text.set(["300g of sweet potato per serving"]),
        ];
    }
}

class NuttyPudding1Days extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bulletMixer().add([
                i.pomegranateJuice(56.7, u.gram),
                i.almondMilk(125, u.gram),
                i.water(30, u.gram),
                i.ingredient('NuttyPudding mixture'),
                i.cherry(3, u.unit),
                // blend for 1 minute on low
                // blend for 1 minute on low
            ]),
            text.set(["Blend for 30 seconds on low"]),
            e.bulletMixer().mix(),
            e.bulletMixer().add([
                i.strawberry(61.5, u.gram), //i.strawberry(123, u.gram),
            ]),
            text.set(["Blend for 30 seconds on low"]),
            e.bulletMixer().mix(),
            text.set(["Put 410g into blue iron flask"]),
        ];
    }
}

class NuttyPudding2Days extends Recipe {
    constructor() {
        super();

        const recipe = new NuttyPudding1Days()
        recipe.multiplyIngredients(2)

        this.steps = recipe.steps;
    }
}

class SweetPotato8Days extends Recipe {
    constructor() {
        super();

        const recipe = new SweetPotato1Days()
        recipe.multiplyIngredients(8)

        this.steps = recipe.steps;
        this.hideFromCookingView = true;
    }
}

class NuttyPudding8Days extends Recipe {
    constructor() {
        super();

        const recipe = new NuttyPudding1Days()
        recipe.multiplyIngredients(8)

        this.steps = recipe.steps;
        this.hideFromCookingView = true;
    }
}

class SuperVeggie8Days extends Recipe {
    constructor() {
        super();

        const recipe = new SuperVeggie()
        recipe.multiplyIngredients(8)

        this.steps = recipe.steps;
        this.hideFromCookingView = true;
    }
}
