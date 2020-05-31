import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';

export class MealRecipe extends Recipe {
    constructor() {
        super();
        this.recipeGroup = c.pork;
        this.addIngredients([
            i.porkRoast(2, u.pound),
            i.sesameOil(),
            i.salt(),
            i.blackPepper(),
            i.chilliPowder(),
            i.instaPot(),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put the', this.get(i.instaPot()), 'on sear and put in', this.get(i.sesameOil())],
            ['Put', this.get(i.salt()), this.get(i.blackPepper()), this.get(i.chilliPowder()), 'on all sides of pork'],
            ['Sear 4 minutes on every side'],
            ['Put in metal riser'],
            ['Put in 1 Cup of water'],
            ['Pressure cook for 30 minutes'],
        ]);
        this.printRecipe();
    }
}
