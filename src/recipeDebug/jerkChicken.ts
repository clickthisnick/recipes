import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.recipeName = 'JerkChicken'
        this.variations = [
            JerkChicken1andHalfPound, JerkChicken3Lb
        ]
    }
}

// 10 bone-in skin on chicken pieces, thighs and legs (about 3 lbs), trim excess fat and skin
// 6 green onions, cut into 2-inch pieces*
// 4 garlic cloves, peeled and smashed
// 2 habanero peppers (or scotch bonnet), stem removed**
// 1 1/2 -inch piece ginger, peeled and sliced
// 1/3 cup fresh lime juice
// 1/4 cup soy sauce
// 1 1/2 Tbsp brown sugar
// 1 Tbsp fresh thyme leaves
// 1 tsp freshly ground black pepper
// 1 tsp ground allspice
// 1/2 tsp ground cinnamon
// 1/2 tsp ground nutmeg

// Instructions

// Place chicken pieces in a gallon size resealable bag.
// Add remaining ingredients to a food processor and plus several times to chop (it should be somewhat coarse). Pour mixture over chicken in bag, seal bag while pressing out excess air then rub marinade over chicken. Let rest in refrigerator 3 - 24 hours.
// Oven instructions: Preheat oven to 375 degrees Fahrenheit. Line a 18 by 13-inch baking sheet with aluminum foil and spray with non-stick cooking spray.
// Remove chicken from marinade. Arrange pieces on baking sheet leaving space between them. Bake in preheated oven until cooked through, about 45 - 50 minutes, while broiling during the last few minutes for better browning.
// Or grill instructions: preheat a gas grill to medium-high heat (about 400 degrees.) Clean grill grates and rub lightly with oil using tongs and an oiled paper towel.
// Grill until chicken is cooked through, turning occasionally (and reducing burning temperature slightly if it's browning too quickly) about 30 minutes.

class JerkChicken1andHalfPound extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Cut top of habenero']),
            text.set(['Take skin off ginger as good as you can without wasting the ginger']),
            text.set(['Cut the ginger into diced onion pieces']),
            e.foodProcessor().add([
                i.greenOnion(3, u.unit),
                i.garlicClove(2, u.clove),
                i.habanero(1, u.unit),
                i.freshGinger(.75, u.inches),
                i.limeJuice(.1667, u.cup),
                i.soySauce(.123, u.cup),
                i.coconutSugar(2.25, u.tsp),
                i.thyme(1.5, u.tsp),
                i.blackPepper(.5, u.tsp),
                i.allSpice(.5, u.tsp),
                i.cinnamon(.25, u.tsp),
                i.nutmeg(.25, u.tsp),
            ]),
            e.foodProcessor().mix(),
            text.set(['Pour mixture and about 1.5 pounds (5 pieces) of chicken thighs/drumsticks into ziplock bag'])

        ];
    }
}

class JerkChicken3Lb extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Cut top of habenero']),
            text.set(['Take skin off ginger as good as you can without wasting the ginger']),
            text.set(['Cut the ginger into diced onion size']),
            e.foodProcessor().add([
                i.greenOnion(6, u.unit),
                i.garlicClove(4, u.clove),
                i.habanero(2, u.unit),
                i.freshGinger(1.5, u.inches),
                i.limeJuice(3, u.unit),
                i.soySauce(.25, u.cup),
                i.coconutSugar(1.5, u.tbsp),
                i.thyme(1, u.tbsp),
                i.blackPepper(1, u.tsp),
                i.allSpice(1, u.tsp),
                i.cinnamon(.5, u.tsp),
                i.nutmeg(.5, u.tsp),
            ]),
            e.foodProcessor().mix(),
            text.set(['Pour mixture and about 3 pounds (4 pieces) of chicken thighs/drumsticks into ziplock bag'])
        ];
    }
}
