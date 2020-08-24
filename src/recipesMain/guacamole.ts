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

    public init() {
        this.generateRecipes();
    }
}

class Normal extends Recipe {
    constructor() {
        super();
    }

    public generateRecipe() {
        this.addIngredients([
            i.avacado(5.5, u.ounce),
            i.garlicClove(2, u.unit),
            i.redOnion(1.7, u.ounce),
            i.limeJuice(1.5, u.tbsp),
            i.salt(4, u.dash),
            i.blackPepper(5, u.dash),
            i.jalapeno(2, u.unit),
            i.cilantro(.1, u.ounce),
        ]);
        this.addSteps([
            ['Get out scale'],
            ['Put string chopper on scale and tar'],
            ['Put in', i.avacado()],
            ['Put in', i.garlicClove()],
            ['Put in', i.redOnion()],
            ['Put in', i.limeJuice()],
            ['Put in', i.salt()],
            ['Put in', i.blackPepper()],
            ['Put in', i.jalapeno()],
            ['Put in the leaves only, (NO STEMS)', i.cilantro()],
            ['Pull string to puree'],
        ]);
    }
}

class MangoHabanero extends Recipe {
    constructor() {
        super();
    }

    public generateRecipe() {
        this.addIngredients([
            i.avacado(5.5, u.ounce),
            i.garlicClove(2, u.unit),
            i.redOnion(1.7, u.ounce),
            i.limeJuice(1.5, u.tbsp),
            i.salt(4, u.dash),
            i.blackPepper(5, u.dash),
            i.habanero(.5, u.unit),
            i.mango(.5, u.ounce),
            i.cilantro(.1, u.ounce),
        ]);
        this.addSteps([
            ['Get out scale'],
            ['Put in', i.avacado()],
            ['Put string chopper on scale and tar'],
            ['Put in', i.garlicClove()],
            ['Put in', i.redOnion()],
            ['Put in', i.limeJuice()],
            ['Put in', i.salt()],
            ['Put in', i.blackPepper()],
            ['Put in', i.habanero()],
            ['Put in', i.mango()],
            ['Put in the leaves only, (NO STEMS)', i.cilantro()],
            ['Pull string to puree'],
        ]);
    }
}