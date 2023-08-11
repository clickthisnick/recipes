import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Text as text } from '../class/text';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.meal;
        this.variations = [
            Sushi, SushiRice4Rolls
        ]
     }
}

class SushiRice4Rolls extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Rinse ', i.sushiRice(1, u.cup), 'under water for 2 minutes']),
            e.instantPot().add([
                i.sushiRice(),
                i.water(1, u.cup)
            ]),
            Timer.set(15, 'm', 'Cook rice in instant pot on low pressure'),
            Timer.end(),
            Timer.set(10, 'm', 'Let instant pot natural release'),
            Timer.end(),
            text.set(['Unplug instant pot heat']),
            e.instantPot().add([
                i.appleCiderVinegar(2, u.tbsp),
                i.seasonedRiceVinegar(2, u.tbsp)
            ]),
            e.instantPot().stir(),
            Timer.set(30, 'm', 'Cover instant pot in tinfoil with poked holes and set in fridge'),
            Timer.end(),
        ];
    }
}

class Sushi extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['This recipe makes 2 rolls worth of rice']),
            text.set(['Rinse ', i.sushiRice(.5, u.cup), 'under water for 2 minutes']),
            e.instantPot().add([
                i.sushiRice(),
                i.water(.5, u.cup)
            ]),
            Timer.set(12, 'm', 'Cook rice in instant pot on low pressure'),
            Timer.end(),
            Timer.set(10, 'm', 'Let instant pot natural release'),
            Timer.end(),
            text.set(['Unplug instant pot heat']),
            e.instantPot().add([
                i.appleCiderVinegar(1, u.tbsp),
                i.seasonedRiceVinegar(1, u.tbsp)
            ]),
            e.instantPot().stir(),
            Timer.set(30, 'm', 'Cover instant pot in tinfoil with poked holes and set in fridge'),
            Timer.end(),
            text.set(['Cook', i.salmon(.25, u.pound), 'on all sides briefly, about 2 min']),
            text.set(['Spoon', i.sushiRice(), 'on', i.seaweed(1, u.unit), 'leaving about an inch of', i.seaweed(), 'uncovered']),
            text.set(['Spread out rice with spoon']),
            text.set(['Put', i.avocado(1, u.unit), 'and', i.salmon(), 'in the middle of the', i.sushiRice()]),
            text.set(['Tightly wrap and wet the uncovered inch of', i.seaweed(), 'and overlap the roll']),
            text.set(['Put water on the outside of the uncovered', i.seaweed(), 'as well so it sticks']),
            text.set(['Optionally, if the', i.sushiRice(), 'is still warm, put rolls into freezer for 5 min']),
            text.set(['Dip in ', i.soySauce(1, u.unit)])
        ];
    }
}
