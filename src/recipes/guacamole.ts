import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'Guacamole';
        this.recipeGroup = c.snack;
        this.addIngredients([
            i.avacado(2),
            i.kosherSalt(.75, u.tsp),
            i.lime(.5),
            i.redOnion(.66, u.cup),
            i.serranoChilli(2),
            i.cilantro(2, u.tbsp),
            i.blackPepper(.25, u.tsp),
            i.romaTomato(.5),
            i.scallion(.5),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Cut', this.get(i.avacado()), 'and place in glass bowl'],
            ['Put', this.get(i.kosherSalt()), 'in bowl'],
            ['Mash avacado with fork'],
            ['Mince', this.get(i.redOnion()), 'and put in bowl'],
            ['Mince', this.get(i.serranoChilli()), 'and put in bowl'],
            ['Chop', this.get(i.scallion()), 'and put in bowl'],
            ['Mince and deseed and depulp', this.get(i.romaTomato()), 'and put in bowl'],
            ['Put', this.get(i.cilantro()), 'in bowl'],
            ['Squeeze', this.get(i.lime()), 'into bowl'],
            ['Put', this.get(i.blackPepper())],
            ['Stir bowl'],
        ]);
        this.printRecipe();
    }
}
