import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = "CurryPanang"
        this.recipeGroup = c.component;
        this.variations = [
            CurryPanang,
        ]
     }
}

class CurryPanang extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.instantPot().add([
                i.oliveOil(1, u.tbsp),
                i.whiteOnion(1, u.unit),
            ]),
            e.instantPot().sautee(3, 'm'),
            Timer.set(2, "m"),
                i.greenBellPepper(1, u.unit).cutIntoThinSlices(),
                i.redBellPepper(1, u.unit).cutIntoThinSlices(),
                i.garlicClove(4, u.unit).mince(),
                i.groundGinger(2, u.tsp).mince(),
                i.whiteMushroom(.5, u.pound).cutIntoSlices(),
            Timer.end(),
            e.instantPot().add([
                i.greenBellPepper(),
                i.redBellPepper(),
                i.garlicClove(),
                i.groundGinger(),
                i.whiteMushroom(),
            ]),
            Timer.set(2, "m"),
                i.chickenBreast(2, u.pound).cutIntoThinSlices(),
            Timer.end(),
            e.instantPot().add([
                i.panangCurryPaste(1, u.tbsp),
                i.peanutButter(1, u.tbsp),
            ]),
            Timer.set(1, "m"),
            Timer.end(),
            e.instantPot().add([
                i.coconutMilk(.5, u.unit),
                i.chickenBreast(),
            ]),
            Timer.set(12, "m"),
            Timer.end(),
            e.instantPot().add([
                i.brownSugar(.25, u.cup),
                i.limeJuice(1, u.tbsp),
                i.basil(1, u.cup),
            ])
        ];
    }
}
