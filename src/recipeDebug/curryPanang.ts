import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = "Curry Panang"
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
            i.whiteOnion(.5, u.unit).cutIntoThinSlices(),
            e.instantPot().add([
                i.oliveOil(1, u.tbsp),
                i.whiteOnion(),
            ]),
            e.instantPot().sautee(3, 'm'),
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
            e.instantPot().sautee(2, "m"),
                i.chickenBreast(2, u.pound).cutIntoThinSlices(),
            Timer.end(),
            e.instantPot().add([
                i.panangCurryPaste(1, u.tbsp),
                i.peanutButter(1, u.tbsp),
            ]),
            e.instantPot().sautee(1, "m"),
            Timer.end(),
            e.instantPot().add([
                i.coconutMilk(.5, u.unit),
                i.chickenBreast(),
            ]),
            e.instantPot().pressureCook(0, 4, "m"),
            Timer.end(),
            e.instantPot().add([
                i.brownSugar(.25, u.cup),
                i.limeJuice(1, u.tbsp),
                i.basil(1, u.cup),
            ])
        ];
    }
}
