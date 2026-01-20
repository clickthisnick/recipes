import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Text as text} from '../class/text';
import { Equipment as e } from '../class/equipment';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            BlueprintSmoothie,
        ]
    }
}

class BlueprintSmoothie extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bulletMixer().add([
                i.macadamiaNutMilk(1, u.cup),
                i.banana(1, u.unit), // Preferrably frozen
                i.macadamiaNut(.25, u.cup),
                i.cherry(3, u.unit), // 3 dark frozen pitted cherries
                i.antiOxidantBerryBlend(.5, u.cup),
                i.cocoaNibs(1, u.tsp),
                // i.pomegraniteSeeds(.5, u.cup), // Or 1/2 cup frozen antioxidant blend + 1 tsp cocoa nibs or 1/2 cup frozen raspberries + 1 tsp cocoa nibs
                i.hempSeed(1, u.tbsp),
                // i.wheatGrassPowder(1, u.tsp),
                i.vanillaExtract(.25, u.tsp),
                i.chiaSeed(1, u.tsp),
                i.lemonJuice(.5, u.unit),
                i.celery(1, u.unit),
            ]),
            e.bulletMixer().mix(),
            e.bulletMixer().add([
                i.spinach(1, u.handful),
                i.kale(1, u.handful)
            ]),
            Timer.set(30, 's', 'Let mixer settle so liquid goes down'),
            Timer.end(),
            e.bulletMixer().mix(),
            text.set(["Garnish with strawberry and mint"]),
        ]
    }
}
