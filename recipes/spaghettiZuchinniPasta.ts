import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';

export class SpaghettiZuchinniPasta extends Recipe {
    constructor() {
        super();
        this.addIngredients([
            i.zuchinni(2),
            i.crimniMushroom(3),
            i.garlicClove(2),
            i.parmessanCheese(.25, i.cup()),
            i.vegetableOil(2, i.seconds()),
            i.spiriliazer(),
            i.blackPepper(),
            i.spaghettiSauce(.5),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.vegetableOil()), 'in pantelligent on 4'],
            ['Chop', this.get(i.garlicClove())],
            ['Wait 1 minute for pan to heat up'],
            ['Put in', this.get(i.crimniMushroom()), 'and', this.get(i.garlicClove(), 0)],
            ['Wait 3 minutes'],
            [this.get(i.spiriliazer()), this.get(i.zuchinni())],
            ['Put zuchinni in pan'],
            ['Wait 5 minutes'],
            ['Put in ', this.get(i.spaghettiSauce())],
            ['Turn heat to 5'],
            ['Wait 5 min'],
            ['Season with', this.get(i.blackPepper())],
            ['Top with', this.get(i.parmessanCheese())]
        ]);
        this.printRecipe();
    }
}
