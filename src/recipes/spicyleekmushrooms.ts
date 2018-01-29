import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Timer } from '../class/timer';

export class SpicyLeekMushrooms extends Recipe {
    constructor() {
        super();
        this.recipeName = SpicyLeekMushrooms.name;
        this.addIngredients([
            i.leek(2),
            i.crimniMushroom(5),
            i.garlicClove(2),
            i.soySauce(1, i.tsp()),
            i.sirachaSauce(.5, i.tbsp()),
            i.pepperFlake(.25, i.tbsp()),
            i.hoisonSauce(1, i.tsp()),
            i.vegetableOil(3, i.seconds()),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.vegetableOil()), 'in pantelligent on 4 / stove top on 6'],
            ['Cut in half', this.get(i.leek())],
            ['Cut leek in strips and soak in glass bowl of water'],
            ['Chop', this.get(i.garlicClove())],
            ['Cut', this.get(i.crimniMushroom())],
            [Timer.set(5, 'm', 'put vegetables in pan')],
            ['Put in', this.get(i.soySauce())],
            ['Put in',this.get(i.sirachaSauce())],
            ['Put in',this.get(i.pepperFlake())],
            ['Put in',this.get(i.hoisonSauce())],
            [Timer.set(2, 'm')],
        ]);
        this.printRecipe();
    }
}

const recipe = new SpicyLeekMushrooms();

recipe.generateRecipe();
