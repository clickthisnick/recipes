import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'ChickenFajita'
        this.variations = [
            ChickenFajita
        ]
    }
}

export class ChickenFajita extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.ziplockBag().add([
                i.Groups.chicken(1, u.pound),
                i.oliveOil(2, u.tbsp),
                i.chilliPowder(.5, u.tbsp),
                i.cumin(.5, u.tbsp),
                i.garlicPowder(1, u.tsp),
                i.paprika(.5, u.tsp),
                i.driedOregano(.5, u.tsp),
                i.salt(.5, u.tsp),
                i.blackPepper(15, u.crack),
            ]),
            Timer.set(24, 'h', 'Let Chicken Marinade'),
            Timer.end(),
            e.pan().add([
                i.coconutOil(1, u.tbsp),
                i.item('Marinaded Chicken'),
            ]),
            e.pan().cook(7, 'm', 5),
            text.set(['Flip Chicken']),
            Timer.end(),
            e.pan().cook(7, 'm', 5),
            i.Groups.onion(.5, u.unit).cutIntoStrips(),
            i.Groups.mushroom(4, u.ounce).cutIntoStrips(),
            i.greenBellPepper(1, u.unit).cutIntoStrips(),
            Timer.end(),
            text.set(['Take chicken out of pan']),
            e.pan().add([
                i.Groups.onion(),
                i.Groups.mushroom(),
                i.greenBellPepper(),
            ]),
            e.pan().cook(5, 'm', 5),
            Timer.end(),
            e.pan().add([
                i.item('Cooked Chicken'),
                i.limeJuice(2, u.tsp),
            ]),
            e.pan().cook(1, 'm', 2),
            e.pan().stir(),
            Timer.end()
        ];
    }
}
