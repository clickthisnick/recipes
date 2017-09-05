import { Recipe } from '../class/recipe';
import { Items } from '../constants/items';

export class SpicyLeekMushrooms extends Recipe {
    constructor() {
        super();
        this.addIngredients([
            Items.leek(2),
            Items.crimniMushroom(5),
            Items.garlicClove(2),
            Items.soySauce(1, Items.tsp()),
            Items.sirachaSauce(.5, Items.tbsp()),
            Items.pepperFlake(.25, Items.tbsp()),
            Items.hoisonSauce(1, Items.tsp()),
            Items.vegetableOil(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 3 seconds of', this.getIng(Items.vegetableOil()), 'in pantelligent on 4'],
            ['Cut in half', this.getIng(Items.leek())],
            ['Cut leek in strips and soak in glass bowl of water'],
            ['Chop', this.getIng(Items.garlicClove())],
            ['Cut', this.getIng(Items.crimniMushroom())],
            ['Put vegetables in pan for 5 minutes'],
            ['Put in', this.getIng(Items.soySauce())],
            ['Put in',this.getIng(Items.sirachaSauce())],
            ['Put in',this.getIng(Items.pepperFlake())],
            ['Put in',this.getIng(Items.hoisonSauce())],
            ['Wait 2 min'],
        ]);
        this.printRecipe();
    }
}
