import { Recipe } from '../class/recipe';
import { Items } from '../constants/items';

export class GarlicPasta extends Recipe {
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
            Items.butter(2, Items.tbsp()),
            Items.pepperFlake(.25, Items.tsp()),
            Items.salt(.25, Items.tsp()),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 2 seconds of', this.getIng(Items.vegetableOil()), 'in pantelligent on 4'],
            ['Chop', this.getIng(Items.garlicClove())],
            ['Sauttee', this.getIng(Items.crimniMushroom()), 'and', this.getIng(Items.garlicClove()), 'for 3 minutes'],
            [this.getIng(Items.spiriliazer()), this.getIng(Items.zuchinni())],
            ['Put zuchinni in pan for 5 minutes'],
            ['Put in',this.getIng(Items.pepperFlake())],
            ['Wait 2 min'],
            ['Top with', this.getIng(Items.butter())],
            ['Top with', this.getIng(Items.parmessanCheese())],
            ['Season with', this.getIng(Items.blackPepper()), 'and', this.getIng(Items.salt())],
        ]);
        this.printRecipe();
    }
}
