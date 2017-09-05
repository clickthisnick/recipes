import { Recipe } from '../class/recipe';
import { Items } from '../constants/items';

export class PadThaiStirFry extends Recipe {
    constructor() {
        super();
        this.addIngredients([
            Items.redOnion(.5),
            Items.scallion(3),
            Items.garlicClove(2),
            Items.bellPepper(),
            Items.zuchinni(2),
            Items.crimniMushroom(5),
            Items.soySauce(1, Items.tsp()),
            Items.padThaiSauce(2, Items.tbsp()),
            Items.spiriliazer(),
            Items.vegetableOil(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 3 seconds of', this.getIng(Items.vegetableOil()), 'in pantelligent on 4'],
            ['Cut', this.getIng(Items.redOnion())],
            ['Cut', this.getIng(Items.scallion())],
            ['Cut', this.getIng(Items.bellPepper())],
            ['Cut', this.getIng(Items.garlicClove())],
            ['Cut', this.getIng(Items.crimniMushroom())],
            ['Put vegetables in pan for 7 minutes'],
            [this.getIng(Items.spiriliazer()), this.getIng(Items.zuchinni())],
            ['Wait for 7 min timer'],
            ['Put sprilized zuchinni in the pan'],
            ['Wait 2 min'],
            ['Put in', this.getIng(Items.soySauce())],
            ['Put in',this.getIng(Items.padThaiSauce())],
        ]);
        this.printRecipe();
    }
}
