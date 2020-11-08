import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';
import { Async } from '../class/async';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [BroccoliBeef]},
        ]
    }
}

class BroccoliBeef extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.pan().preheat(5, true),
                [Async.step, 'Cut', i.flankSteak(.5, u.pound), 'into strips'],
            e.pan().add([
                i.oliveOil(1, u.tbsp),
                i.flankSteak(),
            ]),
            e.pan().cook(6, 'm'),
            ['Put beef in pyrex bowl'],
            e.pan().add([
                i.greenOnion(4, u.unit),
                i.garlicClove(3, u.unit),
                i.shallot(1, u.unit)
            ]),
            e.pan().cook(1, 'm'),
            e.pan().add(
                i.broccoli(1, u.unit)
            ),
            ['Put cover on pan'],
            e.pan().cook(5, 'm'),
                [Async.step, 
                    e.bowl().add([
                        i.arrowRootStarch(2, u.tbsp),
                        i.water(.75, u.cup),
                        i.aminosCoconut(.25, u.cup),
                        i.groundGinger(1, u.tsp),
                        i.redPepperFlakes(1, u.tsp)
                    ])
                ],
                [Async.step, e.bowl().stir()],
            [Timer.set(4, 'm', 'Once broccoli is done, remove cover and add sauce. Continue cooking.')],
            [Timer.set(2, 'm', 'Add beef and finish cooking.')],
        ];
    }
}