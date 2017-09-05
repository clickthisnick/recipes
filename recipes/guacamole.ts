import { Recipe } from '../class/recipe';
import { Items } from '../constants/items';

export class Guacamole extends Recipe {
    constructor() {
        super();
        this.addIngredients([
            Items.avacado(2),
            Items.kosherSalt(.75, Items.tsp()),
            Items.lime(.5),
            Items.redOnion(.66, Items.cup()),
            Items.serranoChilli(2),
            Items.cilantro(2, Items.tbsp()),
            Items.blackPepper(.25, Items.tsp()),
            Items.romaTomato(.5),
            Items.scallion(.5),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Cut', this.getIng(Items.avacado()), 'and place in glass bowl'],
            ['Put', this.getIng(Items.kosherSalt()), 'in bowl'],
            ['Mash avacado with fork'],
            ['Mince', this.getIng(Items.redOnion()), 'and put in bowl'],
            ['Mince', this.getIng(Items.serranoChilli()), 'and put in bowl'],
            ['Chop', this.getIng(Items.scallion()), 'and put in bowl'],
            ['Mince and deseed and depulp', this.getIng(Items.romaTomato()), 'and put in bowl'],
            ['Put', this.getIng(Items.cilantro()), 'in bowl'],
            ['Squeeze', this.getIng(Items.lime()), 'into bowl'],
            ['Put', this.getIng(Items.blackPepper())],
            ['Stir bowl'],
        ]);
        this.printRecipe();
    }
}
