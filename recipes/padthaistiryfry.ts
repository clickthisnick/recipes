import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';

export class PadThaiStirFry extends Recipe {
    constructor() {
        super();
        this.addIngredients([
            i.redOnion(.5),
            i.scallion(3),
            i.garlicClove(2),
            i.bellPepper(),
            i.zuchinni(2),
            i.crimniMushroom(5),
            i.soySauce(1, i.tsp()),
            i.padThaiSauce(2, i.tbsp()),
            i.spiriliazer(),
            i.vegetableOil(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 3 seconds of', this.get(i.vegetableOil()), 'in pantelligent on 4'],
            ['Cut', this.get(i.redOnion())],
            ['Cut', this.get(i.scallion())],
            ['Cut', this.get(i.bellPepper())],
            ['Cut', this.get(i.garlicClove())],
            ['Cut', this.get(i.crimniMushroom())],
            ['Put vegetables in pan for 7 minutes'],
            [this.get(i.spiriliazer()), this.get(i.zuchinni())],
            ['Wait for 7 min timer'],
            ['Put sprilized zuchinni in the pan'],
            ['Wait 2 min'],
            ['Put in', this.get(i.soySauce())],
            ['Put in',this.get(i.padThaiSauce())],
        ]);
        this.printRecipe();
    }
}
