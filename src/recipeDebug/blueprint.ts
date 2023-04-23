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
            GreenGiant, SuperVeggie
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
            e.pot(0).cookWithLidSlightlyOff(23, 'm', 7),
                greenGiant[0], // There's only 1 step right now
                Timer.end(),
                e.pot(1).add([
                    i.water(5, u.cup),
                ]),
                e.pot(1).cook(2, 'm', 7),
                Timer.end(),
                e.pot(1).add([
                    i.broccoli(250, u.gram),
                    i.cauliflower(150, u.gram),
                ]),
                e.pot(1).cook(4, 'm', 7),
                Timer.end(),
                e.pan().add([
                    i.oliveOil(1, u.tbsp),
                    i.shitatkeMushroom(50, u.gram),
                ]),
                e.pan().cook(3, 'm'),
                Timer.end(),
            Timer.end(),
            i.ingredient('lentil').seasonWith([
                i.cumin(1, u.tbsp),
            ])
        ];
    }
}
