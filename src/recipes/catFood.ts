import { Recipe, RecipeContainer } from '../class/recipe';
import { Text as text} from '../class/text';
import { Equipment as e } from '../class/equipment';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';

// 1570 Calories - Green Giant / Super Veggie / Nutty Pudding
export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            catFoodRecipe,
            catFoodThreeHalfPounds,
            catFoodSevenPounds
        ]
    }
}


class catFoodRecipe extends Recipe {
    constructor() {
        super();

        // Original Recipe
        // 4.5 lb bone-in chicken thights
        // 7 oz raw chicken liver
        // 14 oz raw chicken hearts
        // 8 oz water

        this.steps = [
            text.set(["NOTE 1.5 ounces water is 1/4 cup, 2 ounces water is 1/3 cup"]),
            e.glass(0).add([
                i.waterFirst(1, u.ounce),
                i.taurine(2000, u.milligram),
                i.salmonOil(4000, u.milligram),
                i.vitaminBComplex(200, u.milligram),
                i.vitaminE(200, u.iu),
            ]),
            text.set(["Get out 2 sets of gloves"]),
            text.set(["Get out all meat packages and open them"]),
            text.set(['Remove 25% of the bones and 50% of the skin from the chicken thighs']),
            e.grinder().add([
                i.chickenHeart(400, u.gram),
                i.chickenLiver(200, u.gram),
                i.chickenThigh(4.5, u.pound),
                //i.chickenLiver(7, u.ounce),
                //i.chickenHeart(14, u.ounce),
            ]),
            text.set(["Open grinder"]),
            e.bowl(1).add([
                i.water(9, u.ounce), // This is an additional 2 ounces
                i.litesalt(8.4, u.gram),
                i.eggyolk(4, u.unit),
            ]),
            text.set(["Put 2.3 ounces into containers."]),
            // text.set(["3100 mg taurine - (6 - Thorne 500mg pills)"]),
            // text.set(["6200 mg salmon oil - (2 - Salmon Oil pills)"]),
            // text.set(["310 IU vitamin e - (3 Solgar pills)"]),
            // text.set(["310 mg vitamin b complex"]),
            // text.set(["13.02 g lite salt"]),
            // text.set(["7 pounds chicken thighs - 25% bone removed - 50% Skin Removed"]),
            // text.set(["310 g chicken liver"]),
            // text.set(["620 g chicken hearts"]),
            // text.set(["6 eggs"]),
        ];
    }
}

class catFoodSevenPounds extends Recipe {
    constructor() {
        super();

        const recipe = new catFoodRecipe()
        recipe.multiplyIngredients(1.555)
        
        this.steps = recipe.steps;
    }
}

class catFoodThreeHalfPounds extends Recipe {
    constructor() {
        super();

        const recipe = new catFoodRecipe()
        recipe.multiplyIngredients(0.7775)
        
        this.steps = recipe.steps;
    }
}

// class catFoodSevenPounds extends Recipe {
//     constructor() {
//         super();

//         // Original Recipe
//         // 4.5 lb bone-in chicken thights
//         // 7 oz raw chicken liver
//         // 14 oz raw chicken hearts
//         // 8 oz water

//         this.steps = [
//             text.set(["12.4 ounces water"]),
//             text.set(["3100 mg taurine - (6 - Thorne 500mg pills)"]),
//             text.set(["6200 mg salmon oil - (2 - Salmon Oil pills)"]),
//             text.set(["310 IU vitamin e - (3 Solgar pills)"]),
//             text.set(["310 mg vitamin b complex"]),
//             text.set(["13.02 g lite salt"]),
//             text.set(["7 pounds chicken thighs - 25% bone removed - 50% Skin Removed"]),
//             text.set(["310 g chicken liver"]),
//             text.set(["620 g chicken hearts"]),
//             text.set(["6 eggs"]),
//         ];
//     }
// }