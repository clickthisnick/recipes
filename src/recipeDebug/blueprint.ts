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
        this.recipeName = 'blueprint';
        this.recipeGroup = c.component;
        this.variations = [
            GreenGiant, SuperVeggie, NuttyPudding
        ]
    }
}

class GreenGiant extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.mug().add([
                i.water(8, u.ounce),
                i.collagenPeptides(20, u.gram),
                i.cocoaFlavanols(.5, u.gram),
                i.aminoComplex(7.6, u.gram),
                i.cinnamon(1, u.tsp),
                i.creatine(2.5, u.gram),
                i.chlorellaPowder(1, u.tbsp),
                // 2 Tbsp chlorella powder, yielding 13.5mg spermidine
            ])
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
        const greenGiant = new GreenGiant().steps

        this.steps = [
            e.strainer().add([
                i.blackLentils(1, u.cup),
            ]),
            e.strainer().wash("Wash with water and look for rocks", 10, 's'),
            e.pot(0).add([
                i.blackLentils(),
                i.water(3, u.cup),
            ]),
            e.pot(0).cookWithLidSlightlyOff(5, 'm', 7), // 20 min for black/ 23 min for green total
                greenGiant[0], // There's only 1 step right now
                Timer.end(),
            Timer.end(),
            e.pot(0).cookWithLidSlightlyOff(15, 'm', 7), // The remaining of the lentil cook
                e.pan().add([
                    i.shitatkeMushroom(50, u.gram), // put in first so they defrost more
                    i.broccoli(250, u.gram),
                    i.cauliflower(150, u.gram),
                ]),
                // Cook pan until lentils are done
                e.pan().cookWithLid(14, 'm', 5),
                    text.set(['Do stretch routine.']),
                    e.pan(2).add([ // tmp for partner
                        i.broccoli(50, u.gram),
                        i.cauliflower(30, u.gram),
                    ]),
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
                i.garlicClove(1, u.clove),
            ])
        ];
    }
}

class NuttyPudding extends Recipe {
    constructor() {
        super();

        // TODO add the rest later
        this.steps = [
            e.bulletMixer().add([
                i.almondMilk(50, u.ml),
                i.macadamiaNut(23, u.gram), // 3 Tbsp ground macadamia nuts (20% off + free m-nut oil)
                i.cacaoPowderUnsweetened(1, u.tbsp), // 1 Tbsp non dutched cocoa
                i.strawberry(1, u.cup), // 1 cup blueberries/raspberries/strawberries (your choice)
                i.cherry(3, u.unit),
                i.ceylonCinnamon(.5, u.tsp),
                i.flaxSeed(1, u.tsp),
                i.walnut(2, u.tsp),
                i.pomegranateJuice(2, u.ounce),
                // 1/2 brazil nut
                // 1 tsp sunflower lecithin
            ]),
            e.bulletMixer().mix(),
        ];
    }
}
