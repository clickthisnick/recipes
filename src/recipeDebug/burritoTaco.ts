import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.recipeName = 'BurritoTaco'
        this.variations = [
            GroundBeefBurritoTaco, GroundBeefBurritoTacoRomaine, BeefEyeRoundSteakTaco,
        ]
    }
}

class GroundBeefBurritoTaco extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add(i.groundBeef8020(1, u.pound)),
            e.pan().cook(6, 'm', 6),
                i.Groups.onion(.5, u.unit).cutIntoThinSlices(),
            Timer.end(),
            // Cumin should be toasted the rest taste better adding at the end
            e.pan().add([
                i.cumin(2, u.tsp),
            ]),
            e.pan().stir(),
            e.pan().cook(4, 'm', 6),
            Timer.end(),
            e.pan().add([
                i.chilliPowder(1, u.tsp),
                i.paprika(1, u.tsp),
                i.garlicPowder(1, u.tsp),
                i.pepperFlake(1, u.tsp),
                i.blackPepper(10, u.crack),
                i.Groups.onion(),
                i.mozzarellaCheese(1, u.unit),
            ]),
            e.pan().stir(),
            i.ingredient('taco').seasonWith([
                i.softTortillaShell(4, u.unit),
                i.salsa(1, u.unit),
                i.Groups.onion(),
            ])
        ];
    }
}

class GroundBeefBurritoTacoRomaine extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().add(i.groundBeef8020(1, u.pound)),
            e.pan().cook(6, 'm', 6),
                i.Groups.onion(.5, u.unit).cutIntoThinSlices(),
            Timer.end(),
            // Cumin should be toasted the rest taste better adding at the end
            e.pan().add([
                i.cumin(2, u.tsp),
            ]),
            e.pan().stir(),
            e.pan().cook(4, 'm', 6),
            Timer.end(),
            e.pan().add([
                i.chilliPowder(1, u.tsp),
                i.paprika(1, u.tsp),
                i.garlicPowder(1, u.tsp),
                i.pepperFlake(1, u.tsp),
                i.blackPepper(10, u.crack),
                i.Groups.onion(),
                i.mozzarellaCheese(1, u.unit),
            ]),
            e.pan().stir(),
            i.ingredient('taco').seasonWith([
                i.salsa(1, u.unit),
                i.Groups.onion(),
            ]),
            text.set(['Fill', i.romaineLettuce(2, u.unit), 'with meat']),
        ];
    }
}

class BeefEyeRoundSteakTaco extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.ninja().add(i.BeefEyeRoundSteak(1, u.pound)),
            e.ninja().cook(2.5, 'm', 450),
            text.set(['Dice', i.Groups.onion(.5, u.unit)]),
            Timer.end(),
            text.set(['Flip']),
            e.ninja().cook(2.5, 'm', 450),
            Timer.end(),
            Timer.set(10, 'm', 'Let beef rest'),
            Timer.end(),
            text.set(['Cut up BeefEyeRoundSteak']),
            i.ingredient('taco').seasonWith([
                i.softTortillaShell(4, u.unit),
                i.mozzarellaCheese(1, u.unit),
                i.salsa(1, u.unit),
                i.Groups.onion(),
            ])
        ];
    }
}
