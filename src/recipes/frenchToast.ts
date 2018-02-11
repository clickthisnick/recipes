import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';

export class FrenchToast extends Recipe {
    constructor() {
        super();
        this.recipeName = FrenchToast.name;
        this.addIngredients([
            i.bread(),
            i.butter(),
            i.eggWhite(),
            i.cinnamon(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put a pan on heat 5'],
            ['Put some', this.get(i.butter()), 'in the pan'],
            ['Put the', this.get(i.eggWhite()), 'and the', this.get(i.cinnamon())],
            ['Dip the', this.get(i.bread()), 'in the mixture'],
            ['Put the bread on the pan for 3 minutes'],
            ['Flip the bread and keep on pan for 2 and a half minutes'],
        ]);
        this.printRecipe();
    }
}

const recipe = new FrenchToast();

recipe.generateRecipe();
