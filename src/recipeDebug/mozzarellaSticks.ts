import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';
import { Equipment as e } from '../class/equipment';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'Mozzarella Sticks'
        this.variations = [
            MozzarellaSticks
        ]
     }
}

export class MozzarellaSticks extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Cut up', i.mozzarellaCheese(8, u.ounce), 'into strips']),
            text.set(['Put', i.mozzarellaCheese(), 'and', i.allPurposeFlour(.5, u.spoon), 'into a ziplock bag']),
            Timer.set(20, 'm', 'Put ziplock bag in the freezer'),
            Timer.end(),
            e.bowl().add([
                i.pankoBreadCrumbs(.5, u.cup),
                i.onionGranules(.5, u.tsp),
                i.garlicPowder(.5, u.tsp),
                i.smokedPaprika(.5, u.tsp),
                i.salt(.25, u.tsp),
            ]),
            e.bowl().stir(),
            text.set(['Whisk', i.egg(1, u.unit)]),
            text.set(['Dip in egg mixture']),
            text.set(['Roll dipped cheese in', i.ingredient('seasoned panko')]),
            Timer.set(60, 'm', 'Freeze'),
            Timer.end(),
            e.ninja().add([
                i.ingredient('cheese sticks')
            ]),
            e.ninja().cook(6, 'm', 390),
            Timer.end(),
            text.set(['Sprinkle with', i.parsley(1, u.unit)]),
            text.set(['Dip in ', i.pizzaSauce(8, u.ounce)]),
        ];
    }
}
