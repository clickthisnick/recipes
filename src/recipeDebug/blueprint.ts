import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

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
            ])
        ];
    }
}

// TODO needs some work but is basically right
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
            e.pot(0).cookWithLidSlightlyOff(14, 'm', 7), // 23 min total
                greenGiant[0], // There's only 1 step right now
                Timer.end(),
            Timer.end(),
            e.pot(0).cookWithLidSlightlyOff(9, 'm', 7), // The remaining of the 23 min lentil cook
                e.pan().add([
                    i.broccoli(250, u.gram),
                    i.cauliflower(150, u.gram),
                    i.shitatkeMushroom(50, u.gram),
                ]),
                e.pan().cookWithLid(6, 'm', 7),
                Timer.end(),
            Timer.end(),
            e.bulletMixer().add([
                i.cumin(1, u.tbsp),
                i.lime(1, u.unit),
                i.oliveOil(1, u.tbsp),
                i.freshGinger(3, u.gram),
            ]),
            i.ingredient('lentil').seasonWith([
                i.ingredient('mixture')
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
                i.macadamiaNut(3, u.tbsp),
                i.strawberry(1, u.cup),
                i.ceylonCinnamon(.5, u.tsp),
                i.flaxSeed(1, u.tsp),
                i.walnut(2, u.tsp),
                i.pomegraniteJuice(2, u.ounce),

            ]),
            e.bulletMixer().mix(),
        ];
    }
}
