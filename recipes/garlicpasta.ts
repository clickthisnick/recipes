import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Timer } from '../class/timer';

export class GarlicPasta extends Recipe {
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
            i.butter(2, i.tbsp()),
            i.pepperFlake(.25, i.tsp()),
            i.salt(.25, i.tsp()),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put', this.get(i.vegetableOil()), 'in pantelligent on 4'],
            ['Chop', this.get(i.garlicClove())],
            ['Put in', this.get(i.crimniMushroom()), 'and', this.get(i.garlicClove(0))],
            [Timer.set(3, 'm')],
            [this.get(i.spiriliazer()), this.get(i.zuchinni())],
            ['Put', this.get(i.zuchinni(0)), 'in pan'],
            [Timer.set(5, 'm')],
            ['Put in',this.get(i.pepperFlake())],
            [Timer.set(2, 'm')],
            ['Top with', this.get(i.butter())],
            ['Top with', this.get(i.parmessanCheese())],
            ['Season with', this.get(i.blackPepper()), 'and', this.get(i.salt())],
        ]);
        this.printRecipe();
    }
}
