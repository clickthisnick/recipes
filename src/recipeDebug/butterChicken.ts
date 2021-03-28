import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer} from '../class/timer';
import { Text as text} from '../class/text';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'ButterChicken'
        this.variations = [
            ButterChicken
        ]
    }
}

class ButterChicken extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Preheat Medium Instant Pot with Saute on low setting']),
            text.set(['Dice', i.whiteOnion(1, u.unit)]),
            text.set(['Dice', i.garlicClove(5, u.unit)]),
            e.instantPot().add([
                i.oliveOil(1, u.tbsp), 
                i.butter(1, u.tbsp),
                i.whiteOnion(),
                i.groundGinger(2, u.tbsp),
                i.garlicClove()
            ]),
            Timer.set(4, 'm', 'Saute in instant pot'),
            text.set(['Cut', i.chickenThigh(2, u.pound), 'into 1 inch cubes']),
            text.set(['Wash knife']),
            text.set(['Wash cutting boards']),
            Timer.end(),
            e.instantPot().add([
                i.tomatoPaste(6, u.ounce)
            ]),
            Timer.set(3, 'm', 'Constantly stir'),
            Timer.end(),
            e.instantPot().add([
                i.water(.5, u.cup),
                i.chickenThigh(),
                i.gramMasala(1, u.tbsp),
                i.paprika(1, u.tsp),
                i.coconutSugar(2, u.tsp),
                i.cumin(1, u.tsp),
                i.turmeric(.5, u.tsp),
                i.salt(1, u.tsp), // .5 for healthier
                i.blackPepper(1, u.tsp),
            ]),
            Timer.set(15, 'm', 'Pressure cook.'),
            Timer.end(),
            Timer.set(10, 'm', 'Let instant pot pressure release'),
            text.set(['Put away spices']),
            text.set(['Put away utensils']),
            Timer.end(),
            text.set(['Take inner instant pot bowl out and put on stove. Put away instant pot.']),
            text.set(['Stir in', i.coconutCream(.75, u.cup)]),
            Timer.set(3, 'm', 'Saute on medium'),
            Timer.end()
        ]
    }
}
