import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';

// 1570 Calories - Green Giant / Super Veggie / Nutty Pudding
export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            SuperVeggiePrep, PillsMorningPrep, NuttyPudding2DaysPrep, NuttyPudding8Days, SuperVeggiePrep8DaysPrep
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



class PillsMorningPrep extends Recipe {
    constructor() {
        super();

        this.steps = [
            text.set(["1 Odorless Garlic"]),
            text.set(["2 Ginger Root"]),
            text.set(["1 Turmeric"]),
            text.set(["1 Vitamin D"]),
            text.set(["2 Ashwaganda Pills - ( 600 mg )"]),
            text.set(["1 BroccoMax"]),
            text.set(["1 Zinc"]),
            text.set(["1 Vitamin E"]),
            //text.set(["1 Ca-AWG?? TODO"]),
            text.set(['3 N-Acetyl-L-Cysteine pills']),
            text.set(['1 DHEA']),
            text.set(['4 Kyolic Garlic']),
            text.set(['2 Taurine']),
            text.set(['1 Lithium']),
            text.set(['2 Lysine Pills - ( 1g / 1000mg )']),
            //text.set(['1 Proferrin Clear']),
            text.set(['1 Viviscalman']),
            text.set(['.25 Super B Complex x2 a week']),
        ];
    }
}

class SuperVeggiePrep extends Recipe {
    constructor() {
        super();

        this.steps = [
            e.smallStainlessSteelContainer(0).add([
                i.blackLentils(200, u.gram),
            ]),
            e.smallStainlessSteelContainer(1).add([
                i.frozenCauliflower(150, u.gram),
                i.frozenShitatkeMushroom(50, u.gram),
            ]),
            e.largeStainlessSteelContainer().add([
                i.frozenBroccoli(250, u.gram)
            ]),
        ];
    }
}

class NuttyPudding1DayPrep extends Recipe {
    constructor() {
        super();

        this.steps = [
            e.bulletMixer().add([
                i.macadamiaNut(23, u.gram), // 3 Tbsp ground macadamia nuts (20% off + free m-nut oil)
                i.walnut(4.79, u.gram), // 2 tsp
                i.brazilNut(1, u.quarter),
                i.flaxSeed(1, u.tsp),
                i.sunflowerLechtin(1, u.tsp),
                i.collagenPeptides(20, u.gram),
                i.ingredient('collagen peptides (about 6 half tsbp)'),
                i.cacaoPowderUnsweetened(1, u.tbsp), // 1 Tbsp non dutched cocoa
                i.ceylonCinnamon(1.5, u.tsp),
                i.cocoaFlavanols(.5, u.gram),
                i.ingredient('cocoa flavanols - (2 measurements with the obtuse (rounded) end brushed off)'), // i.cocoaFlavanols(.5, u.gram),
                i.peaProtein(1, u.scoop),
            ]),
            e.bulletMixer().mix(),
        ];
        this.hideFromCookingView = true;
    }
}

class NuttyPudding2DaysPrep extends Recipe {
    constructor() {
        super();

        const recipe = new NuttyPudding1DayPrep()
        recipe.multiplyIngredients(2)
        
        this.steps = recipe.steps;
    }
}

class NuttyPudding8Days extends Recipe {
    constructor() {
        super();
        
        const recipe = new NuttyPudding1DayPrep()
        recipe.multiplyIngredients(8)
        
        this.steps = recipe.steps;
        this.hideFromCookingView = true;
    }
}

class SuperVeggiePrep8DaysPrep extends Recipe {
    constructor() {
        super();

        const recipe = new SuperVeggiePrep()
        recipe.multiplyIngredients(8)
        
        this.steps = recipe.steps;
        this.hideFromCookingView = true;
    }
}