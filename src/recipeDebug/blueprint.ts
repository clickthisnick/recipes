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
            GreenGiant, SuperVeggie, NuttyPudding, NuttyPudding2Days, PillsMorning, SweetPotato
        ]
    }
}

// Collagen - 70 Calories
// Cocoa Falvanoids - 6 Calories
// Amino Complex - 25 Calories
// Cinnamon - 6 Calories
// Creatine - ?
// Chlorella - 48 Calories
// 155 Calories
class GreenGiant extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.mug().add([
                // 2 Tbsp chlorella powder, yielding 13.5mg spermidine
                i.chlorellaPowder(4, u.halftbsp),
                i.ingredient('20 grams of collagen peptides (about 6 half tsbp)'), //i.collagenPeptides(20, u.gram),
                i.cinnamon(1, u.tsp),
                i.aminoComplex(7.6, u.gram),
                i.creatine(2.5, u.gram),
                i.ingredient('.5 grams of cocoa flavanols (2 measurements with the obtuse (rounded) end brushed off)'), // i.cocoaFlavanols(.5, u.gram),
                i.water(8, u.ounce),
            ])
        ];
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
            e.strainer().add([
                i.blackLentils(1, u.cup),
            ]),
            text.set(["Wash lentils with water and look for rocks"]),
            e.pot(0).add([
                i.blackLentils(),
                i.water(3, u.cup),
            ]),
            e.pot(0).cookWithLidSlightlyOff(21, 'm', 7), // 20 min for black/ 23 min for green total
                text.set(['Drink a glass of water with morning pills']),
                text.set(['Drink the green giant']),
                e.pan().add([
                    i.shitatkeMushroom(50, u.gram), // put in first so they defrost more
                    i.broccoli(250, u.gram),
                    i.cauliflower(150, u.gram),
                ]),
                // Cook pan until lentils are done
                e.pan().cookWithLid(14, 'm', 5),
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

//
class NuttyPudding extends Recipe {
    constructor() {
        super();

        // Pomegranate Juice - 31 Calories
        // Macadamia Nut - 165 Calories
        // Walnut - 31 Calories
        // Brazil Nut - 8.25 Calories
        // Flaxseed - 13 Calories
        // Cinnamon - 3 Calories
        // Cocoa Powder - 4 Calories
        // Strawberries - 39 Calories
        // Cherries - 12 Calories
        // Almond Milk - 18.5 Calories
        // Sunflower Lechtin - 20.33 Calories
        // 327.08 Calories
        // 340 Grams Weight
        this.steps = [
            e.bulletMixer().add([
                i.pomegranateJuice(56.7, u.gram), // 2 ounces
                i.macadamiaNut(23, u.gram), // 3 Tbsp ground macadamia nuts (20% off + free m-nut oil)
                i.walnut(4.79, u.gram), // 2 tsp
                i.brazilNut(1, u.quarter),
                i.flaxSeed(1, u.tsp),
                i.sunflowerLechtin(1, u.tsp),
                i.cacaoPowderUnsweetened(1, u.tbsp), // 1 Tbsp non dutched cocoa
                i.ceylonCinnamon(.5, u.tsp),
                i.strawberry(123, u.gram), // 1 cup blueberries/raspberries/strawberries (your choice)
                i.cherry(3, u.unit),
                i.almondMilk(105, u.gram),
            ]),
            e.bulletMixer().mix(),
        ];
    }
}

class NuttyPudding2Days extends Recipe {
     constructor() {
        super();

        // 340 Grams Weight
        this.steps = [
            e.bulletMixer().add([
                i.pomegranateJuice(113.4, u.gram),
                i.macadamiaNut(46, u.gram),
                i.walnut(9.58, u.gram),
                i.brazilNut(2, u.quarter),
                i.flaxSeed(2, u.tsp),
                i.sunflowerLechtin(2, u.tsp),
                i.cacaoPowderUnsweetened(2, u.tbsp),
                i.ceylonCinnamon(1, u.tsp),
                i.strawberry(246, u.gram),
                i.cherry(6, u.unit),
                i.almondMilk(210, u.gram),
            ]),
            e.bulletMixer().mix(),
            text.set(["Pour 340 Grams into Iron Flask Cup"]),
        ];
    }
}

class PillsMorning extends Recipe {
    constructor() {
        super();

        this.steps = [
            text.set(["1 Odorless Garlic"]),
            text.set(["2 Ginger Root"]),
            text.set(["1 Turmeric"]),
            text.set(["1 Vitamin D"]),
            text.set(["1 Ashwaganda"]),
            text.set(["1 BroccoMax"]),
        ];
    }
}
