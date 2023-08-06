import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';

// 1570 Calories - Green Giant / Super Veggie / Nutty Pudding
export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'blueprint prep';
        this.recipeGroup = c.component;
        this.variations = [
            GreenGiantPrep, SuperVeggiePrep, PillsMorningPrep, NuttyPudding2DaysPrep
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
class GreenGiantPrep extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.mug().add([
                // 2 Tbsp chlorella powder, yielding 13.5mg spermidine
                i.chlorellaPowder(4, u.halftbsp),
                i.cinnamon(1, u.tsp),
                i.ingredient('20 grams of collagen peptides (about 6 half tsbp)'), //i.collagenPeptides(20, u.gram),
                i.aminoComplex(7.6, u.gram),
                i.creatine(2.5, u.gram),
                i.ingredient('.5 grams of cocoa flavanols (2 measurements with the obtuse (rounded) end brushed off)'), // i.cocoaFlavanols(.5, u.gram),
                i.water(8, u.ounce),
            ])
        ];
    }
}


class PillsMorningPrep extends Recipe {
    constructor() {
        super();

        this.steps = [
            text.set(["1 Odorless Garlic"]),
            text.set(["2 Ginger Root"]),
            text.set(["1 Turmeric"]),
            text.set(["1 Vitamin D"]),
            text.set(["1 Ashwaganda"]),
            text.set(["1 BroccoMax"]),
            text.set(["1 Zinc"]),
            text.set(["1 Ca-AWG?? TODO"]),
        ];
    }
}

class SuperVeggiePrep extends Recipe {
    constructor() {
        super();

        this.steps = [
            text.set(["Put 200 Grams of black lentils in 17.6 ounce stainless steel container"]),
            text.set(["Put 150 Grams of cauliflower in 17.6 ounce stainless steel container"]),
            text.set(["Put 50 Grams of shitake mushrooms in 17.6 ounce stainless steel container"]),
            text.set(["Put 250 Grams of broccoli in 34 ounce stainless steel container"]),
        ];
    }
}

class NuttyPudding2DaysPrep extends Recipe {
    constructor() {
        super();

        this.steps = [
            e.bulletMixer().add([
                i.macadamiaNut(46, u.gram), // 3 Tbsp ground macadamia nuts (20% off + free m-nut oil)
                i.walnut(9.58, u.gram), // 2 tsp
                i.brazilNut(1, u.half),
                i.flaxSeed(2, u.tsp),
                i.sunflowerLechtin(2, u.tsp),
                i.cacaoPowderUnsweetened(2, u.tbsp), // 1 Tbsp non dutched cocoa
                i.ceylonCinnamon(1, u.tsp),
                i.peaProtein(2, u.scoop),
            ]),
            e.bulletMixer().mix(),
        ];
    }
}