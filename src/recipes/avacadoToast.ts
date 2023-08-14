import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment'
import { Text as text} from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            avocadoToast2People
        ]
    }
}

class avocadoToast2People extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Put', i.whiteBread(2, u.unit), 'on 5 in toaster']),
            Timer.set(3.5, 'm', 'Toast'),
            e.bowl().add([
                i.avocadoLarge(1, u.unit),
                i.limeJuice(2, u.tbsp),
                i.garlicPowder(1, u.tsp),
                i.onionGranules(1, u.tsp),
                i.salt(4, u.crack),
            ]),
            e.bowl().stir(),
            text.set(['Spread avocado mixture on toast']),
            text.set(['Sprinkle on', i.smokedPaprika(2, u.dash)]),
            Timer.end()
        ];
    }
}
