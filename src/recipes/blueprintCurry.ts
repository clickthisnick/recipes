import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Timer} from '../class/timer';
import { Text as text} from '../class/text';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            BlueprintCurry,
        ]
    }
}

class BlueprintCurry extends Recipe {
    constructor() {
        super();
        this.steps = [
            i.broccoli(.5, u.cup).cutIntoOneInchPieces(),
            i.cauliflower(.5, u.cup).cutIntoOneInchPieces(),
            // Good to wait up to 40 min for anti cancing properties
            i.whiteOnion(1, u.unit).dice(),
            text.set(["Turn pot to medium 5 heat"]),
            e.pot().add([
                i.avocadoOil(.5, u.tbsp),
            ]),
            text.set(["Once oil simmers put in onion"]),
            e.pot().cookWithoutLid(5, 'm', 5),
                text.set(["Use spoon to peel ginger"]),
                i.freshGinger(1, u.tbsp).dice(),
                i.garlicClove(2, u.clove).dice(),
                e.pot().cookWithoutLid(5, 'm', 3),
                    i.sweetPotatoes(1.5, u.unit).peel(),
                    i.sweetPotatoes().cube(),
                    e.pot().add([i.sweetPotatoes()]),
                Timer.end(),
            Timer.end(),
           i.carrots(2, u.unit).peel(),
           text.set(["Cut carrots into rounds"]),
           e.pot().add([
            i.carrots(),
            i.blackPepper(5, u.crack),
            i.turmeric(1, u.tsp),
           ]),
           e.pot().stir(),
           e.pot().add([
            i.broccoli(),
            i.cauliflower(),
            i.water(2, u.cup),
           ]),
           e.pot().stir(),
           text.set(["Bring heat of pot up to a simmer"]),
           e.pot().cookWithLid(15, 'm', 7),
            e.pot(2).add([
                i.vegetableBroth(2, u.cup),
                i.quinoa(1, u.cup),
            ]),
            text.set(["Bring heat of pot up to a boil"]),
            e.pot(2).cook(15, 'm', 7),
                i.lime(2, u.unit).juice(),
                i.greenBeans(.5 , u.cup).cutInHalf(),
                i.cilantro(.75, u.cup).cube(),
            Timer.end(),
           Timer.end(),
           text.set(["Set aside quinoa covered"]),
           e.pot().add([
            i.peas(.25, u.cup),
            i.greenBeans(),
            i.cilantro(),
            i.lime(),
            i.macadamiaNutMilk(.5, u.cup)
           ])
        ]
    }
}
