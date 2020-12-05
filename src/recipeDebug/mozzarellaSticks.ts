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
            text.set(['Cut up', i.mozzarellaCheese(1, u.pound), 'into strips']),
            text.set(['Put', i.mozzarellaCheese(), 'and', i.allPurposeFlour(1/8, u.cup), 'into a ziplock bag']),
            Timer.set(20, 'm', 'Put ziplock bag in the freezer'),
            Timer.end(),
            e.bowl().add([
                i.pankoBreadCrumbs(1, u.cup),
                i.onionGranules(.5, u.tsp),
                i.garlicPowder(.5, u.tsp),
                i.smokedPaprika(.5, u.tsp),
                i.salt(.5, u.tsp),
            ]),
            e.bowl().stir(),
            text.set(['Whisk', i.egg(2, u.unit)]),
            text.set(['Dip in egg mixture']),
            text.set(['Roll dipped cheese in', i.item('seasoned panko')]),
            Timer.set(20, 'm', 'Freeze'),
            Timer.end(),
            e.ninja().add([
                i.item('cheese sticks')
            ]),
            e.ninja().cook(6, 'm', 390),
            Timer.end(),
            text.set(['Sprinkle with', i.parsley(1, u.unit)]),
            text.set(['Dip in ', i.pizzaSauce(8, u.ounce)]),
        ];
    }
}
