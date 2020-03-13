import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Timer } from '../class/timer';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeName = 'ButterChicken';
        this.recipeGroup = c.indian;
        this.addIngredients([
            i.oliveOil(1, u.tbsp),
            i.butter(1, u.tbsp),
            i.whiteOnion(1, u.unit),
            i.groundGinger(2, u.tbsp),
            i.garlicClove(5, u.unit),
            i.tomatoPaste(6, u.ounce),
            i.water(.5, u.cup),
            i.chickenThighPackage(2, u.pound),
            i.gramMasala(1, u.tbsp),
            i.paprika(1, u.tsp),
            i.sugar(1, u.tbsp),
            i.cumin(1, u.tsp),
            i.turmeric(.5, u.tsp),
            i.salt(1, u.tsp),
            i.blackPepper(1, u.tsp),
            i.coconutCream(.75, u.cup),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Preheat Instant Pot with Saute setting'],
            ['Dice', this.get(i.whiteOnion())],
            ['Dice', this.get(i.garlicClove())],
            ['Cut chicken into 1 inch cubes'],
            ['Add', this.get(i.oliveOil()), 'and', this.get(i.butter()), 'into instant pot'],
            ['Add', this.get(i.whiteOnion(0)), 'and', this.get(i.groundGinger()), 'and all the', this.get(i.garlicClove(0))],
            [Timer.set(4, 'm', 'Sear')],
            ['Add', this.get(i.tomatoPaste())],
            [Timer.set(3, 'm', 'Constantly stir')],
            ['Put', this.get(i.water()), 'in instant pot'],
            ['Put', this.get(i.chickenThighPackage()), 'in instant pot'],
            ['Add spice', this.get(i.gramMasala())],
            ['Add spice', this.get(i.paprika())],
            ['Add spice', this.get(i.sugar())],
            ['Add spice', this.get(i.cumin())],
            ['Add spice', this.get(i.turmeric())],
            ['Add spice', this.get(i.salt())],
            ['Add spice', this.get(i.blackPepper())],
            [Timer.set(5, 'm', 'Cook on high pressure')],
            [Timer.set(10, 'm', 'Let it slow release')],
            ['Stir in', this.get(i.coconutCream())],
        ]);
        this.printRecipe();
    }
}
