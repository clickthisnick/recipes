import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Equipment as e } from '../class/equipment';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.component;
        this.variations = [
            GummyBears
        ]
    }
}

class GummyBears extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(["Spray a paper towl with non spray cooking spray and rub mold"]),
            e.bowl().add([
                i.gelatin(3, u.ounce),
                i.propelPacket(1, u.unit),
                i.water(1/3, u.cup),
            ]),
            e.bowl().mix(),
            Timer.set(10, "m"),
            Timer.end(),
            e.bowl().microwave(.5),
            Timer.end(),
            e.bowl().mix(),
            e.bowl().microwave(.5),
            Timer.end(),
            e.bowl().mix(),
            e.bowl().add([
                i.citricAcid(.25, u.tsp),
            ]),
            text.set(["Drop mixture into mold"]),
            Timer.set(20, "m"),
            Timer.end(),
        ];
    }
}
