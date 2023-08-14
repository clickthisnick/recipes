import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeType = c.meal;
        this.variations = [
            {'recipe': [ChipotleMarinade]},
        ]
     }

     public init() {
         this.generateRecipes()
     }
}

class ChipotleMarinade extends Recipe {
    constructor() {
        super();
    }
    public generateRecipe() {
        this.addIngredients([
            i.yellowOnion(4, u.unit),
            i.garlicClove(8, u.unit),
            i.chipotlePepperInAdoboSauce(7.5, u.ounce),
            i.oliveOil(8, u.tbsp),
            i.limeJuice(8, u.tbsp),
            i.driedOregano(4, u.tsp),
            i.cumin(2, u.tsp),
            i.blackPepper(4, u.dash),
            i.salt(4, u.dash),
            i.chickenBreastPackage(4, u.pound),
        ]);
        this.addSteps([
            ['Chop', i.yellowOnion(), 'and add to blender'],
            ['Chop', i.garlicClove(), 'and add to blender'],
            ['Add', i.chipotlePepperInAdoboSauce(), 'to blender'],
            ['Add', i.oliveOil(), 'to blender'],
            ['Add', i.limeJuice(), 'to blender'],
            ['Add', i.driedOregano(), 'to blender'],
            ['Add', i.cumin(), 'to blender'],
            ['Add', i.blackPepper(), 'to blender'],
            ['Add', i.salt(), 'to blender'],
            ['Blend ingredients'],
            ['Cube', i.chickenBreastPackage()],
            ['Put', i.chickenBreastPackage(0), 'and the marinade in a bowl and cover with tin foil'],
            [Timer.set(2, 'h', 'Let meat sit in marinade for at least 2 hours')]
        ]);
    }
}
