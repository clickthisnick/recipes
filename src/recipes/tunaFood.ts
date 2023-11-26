import { Recipe, RecipeContainer } from '../class/recipe';
import { Text as text} from '../class/text';

// 1570 Calories - Green Giant / Super Veggie / Nutty Pudding
export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            sixPounds
        ]
    }
}



class sixPounds extends Recipe {
    constructor() {
        super();

        this.steps = [
            text.set(["12.4 ounces water"]),
            text.set(["3100 mg taurine - (6 - Thorne 500mg pills)"]),
            text.set(["6200 mg salmon oil - (2 - Salmon Oil pills)"]),
            text.set(["310 IU vitamin e - (3 Solgar pills)"]),
            text.set(["310 mg vitamin b complex"]),
            text.set(["13.02 g lite salt"]),
            text.set(["7 pounds chicken thighs - 25% bone removed"]),
            text.set(["310 g chicken liver"]),
            text.set(["620 chicken hearts"]),
            text.set(["6 eggs"]),
        ];
    }
}