import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'Spaghetti'
        this.variations = [
            LentilPenne, LentilSpaghetti, LentilSpaghettiInstantPot, DontUseModernBrandLentilPenne
        ]
    }
}

export class LentilPenne extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pot().add([
                i.water(18, u.second),
            ]),
            Timer.set(10, 'm', 'Wait for water to boil'),
                i.Groups.mushroom(4, u.unit).cutIntoStrips(),
            Timer.end(),
            e.pot().add([
                i.lentilSpaghetti(8, u.ounce),
            ]),
            Timer.set(10, 'm', 'let lentil penne cook'),
                e.pan().add([
                    i.Groups.mushroom(4, u.unit),
                ]),
                e.pan().cook(8, 'm'),
                    e.pan().add([
                        i.spaghettiSauce(25, u.ounce),
                    ]),
                    e.pan().cook(2, 'm'),
                    Timer.end(),
                Timer.end(['pan']),
            Timer.end(['pot']),
            text.set(['Top with', i.parmesanCheese(8, u.ounce)]),
        ];
    }
}

export class LentilSpaghetti extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pot().add([
                i.water(25, u.second),
            ]),
            Timer.set(15, 'm', 'Wait for water to boil'),
            i.Groups.mushroom(4, u.unit).cutIntoStrips(),
            Timer.end(),
            e.pot().add([
                i.lentilSpaghetti(8, u.ounce),
            ]),
            Timer.set(18, 'm', 'let lentil spaghetti cook'),
            e.pan().add([
                i.Groups.mushroom(4, u.unit),
            ]),
            e.pan().cook(8, 'm'),
            e.pan().add([
                i.spaghettiSauce(25, u.ounce),
            ]),
            e.pan().cook(8, 'm'),
            Timer.end(),
            Timer.end(),
            Timer.end(),
            text.set(['Top with', i.parmesanCheese(8, u.ounce)]),
        ];
    }
}

export class LentilSpaghettiInstantPot extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.spaghettiSauce(25, u.ounce),
                i.water(1, u.cup),
                i.lentilSpaghetti(8, u.ounce),
                i.oliveOil(1, u.ounce)
            ]),
            text.set(['Stir instant pot and break up pasta']),
            e.instantPot().pressureCook(15, 13, 'm'),
            text.set(['Top with', i.parmesanCheese(8, u.ounce)]),
        ];
    }
}

export class DontUseModernBrandLentilPenne extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.spaghettiSauce(25, u.ounce),
                i.water(1, u.cup),
                i.penneLentil(8, u.ounce),
                i.oliveOil(1, u.ounce)
            ]),
            text.set(['Stir instant pot and break up pasta']),
            e.instantPot().pressureCook(15, 7, 'm'),
            Timer.end(),
        ];
    }
}
