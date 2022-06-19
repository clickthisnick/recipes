import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'Coffee'
        this.variations = [
            FrenchPressCoffee,
            KemexCoffee,
         ]
     }
}

class KemexCoffee extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Take out filter']),
            text.set(['Set filer 1 layer on side / 3 layers the other side into coffee maker']),
            text.set(['Put in ground coffee. Strong is 1/4 Cup, Weak 3 Tbsp.']),
            text.set(['Put away grond coffee container']),
            text.set(['Fill back water tank to 6']),
            Timer.set(5, 'm', 'Wait for coffee to brew'),
            Timer.end(),
            text.set(['Throw away coffee filter']),
        ];
    }
}

class FrenchPressCoffee extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.teapot().add(i.water(12, u.thousandSecondCounts)),
            Timer.set(8.5, 'm', 'Turn stove to "HIGH" (after 9) and wait for whistle'),
            text.set(['Put', i.coffeeGrounds(5, u.scoop), 'into french press bag']),
            text.set(['Put french press bag into french press']),
            Timer.end(),
            text.set(['Once', e.teapot(), 'whistles - pour water into french press until water level reaches silver chrome part']),
            Timer.set(4, 'm', 'Put top onto french press'),
            Timer.end(),
            text.set(['Push french press top down']),
            e.coffeecup().add([
                i.collagenPowder(1, u.scoop),
                i.ingredient('coffee', 2, u.inches),
            ]),
            e.coffeecup().stir(),
            text.set(['If iced coffee - Fill cup with ice']),
            text.set(['Pour coffee into cup, 1 inch from top']),
            text.set(['Top off with creamer and stir']),
        ];
    }
}
