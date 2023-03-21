import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'Guacamole'
        this.recipeGroup = c.component;
        this.variations = [
            {'recipe': [Normal, MangoHabanero]},
        ]
    }
}

class Normal extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Get out scale'],
            ['Put string chopper on scale and tar'],
            ['Put in', i.avocado(4.4, u.ounce)],
            ['Put in', i.garlicClove(2, u.unit)],
            ['Put in', i.Groups.onion(1.7, u.ounce)],
            ['Put in', i.limeJuice(1.5, u.tbsp)],
            ['Put in', i.salt(4, u.dash)],
            ['Put in', i.blackPepper(5, u.dash)],
            ['Put in', i.jalapeno(2, u.unit)],
            ['Put in the leaves only, (NO STEMS)', i.cilantro(.1, u.ounce)],
            ['Pull string to puree'],
        ];
    }
}

class MangoHabanero extends Recipe {
    constructor() {
        super();
        this.steps = [
            ['Get out scale'],
            ['Put in', i.avocado(5.5, u.ounce)],
            ['Put string chopper on scale and tar'],
            ['Put in', i.garlicClove(2, u.unit)],
            ['Put in', i.Groups.onion(1.7, u.ounce)],
            ['Put in', i.limeJuice(1.5, u.tbsp)],
            ['Put in', i.salt(4, u.dash)],
            ['Put in', i.blackPepper(.5, u.dash)],
            ['Put in', i.habanero(.5, u.unit)],
            ['Put in', i.mango(.5, u.ounce)],
            ['Put in the leaves only, (NO STEMS)', i.cilantro(.1, u.ounce)],
            ['Pull string to puree'],
        ];
    }
}
