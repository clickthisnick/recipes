import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeType = c.chinese;
        this.addIngredients([
            i.Groups.onion(.5),
            i.scallion(3),
            i.garlicClove(2),
            i.greenBellPepper(),
            i.zuchinni(2),
            i.Groups.mushroom(5),
            i.soySauce(1, u.tsp),
            i.padThaiSauce(2, u.tbsp),
            i.spiriliazer(),
            i.vegetableOil(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put 3 seconds of', this.get(i.vegetableOil()), 'in pantelligent on 4'],
            ['Cut', this.get(i.Groups.onion())],
            ['Cut', this.get(i.scallion())],
            ['Cut', this.get(i.greenBellPepper())],
            ['Cut', this.get(i.garlicClove())],
            ['Cut', this.get(i.Groups.mushroom())],
            [Timer.set(7, 'm', 'put vegetables in pan')],
            [this.get(i.spiriliazer()), this.get(i.zuchinni())],
            [Timer.set(7, 'm')],
            ['Put sprilized zuchinni in the pan'],
            [Timer.set(2, 'm')],
            ['Put in', this.get(i.soySauce())],
            ['Put in',this.get(i.padThaiSauce())],
        ]);
        this.printRecipe();
    }
}
