import { Recipe } from '../class/recipe';
import { Items } from '../constants/items';

export class SpaghettiZuchinniPasta extends Recipe {
    constructor() {
        super();
        this.addIngredients([
            Items.zuchinni(2),
            Items.crimniMushroom(3),
            Items.garlicClove(2),
            Items.parmessanCheese(.25, Items.cup()),
            Items.vegetableOil(),
            Items.spiriliazer(),
            Items.blackPepper(),
            Items.spaghettiSauce(.5),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 2 seconds of', this.getIng(Items.vegetableOil()), 'in pantelligent on 4'],
            ['Chop', this.getIng(Items.garlicClove())],
            ['Wait 1 minute for pan to heat up'],
            ['Put in', this.getIng(Items.crimniMushroom()), 'and garlic'],
            ['Wait 3 minutes'],
            [this.getIng(Items.spiriliazer()), this.getIng(Items.zuchinni())],
            ['Put zuchinni in pan'],
            ['Wait 5 minutes'],
            ['Put in ', this.getIng(Items.spaghettiSauce())],
            ['Turn heat to 5'],
            ['Wait 5 min'],
            ['Season with', this.getIng(Items.blackPepper())],
            ['Top with', this.getIng(Items.parmessanCheese())]
        ]);
        this.printRecipe();
    }
}
