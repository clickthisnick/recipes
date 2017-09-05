import { Recipe } from '../class/recipe';
import { Items } from '../constants/items';

export class Bread extends Recipe {
    constructor() {
        super();
        this.addIngredients([
            Items.brownSugar(.75, Items.cup()),
            Items.breadFlour(4, Items.cup()),
            Items.water(1, Items.cup()),
            Items.egg(2),
            Items.butter(.25, Items.cup()),
            Items.dryActiveYeast(1.5, Items.tsp()),
            Items.kosherSalt(1, Items.tsp()),
            Items.cinnamon(2, Items.tsp()),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Put in breadmaker', this.getIng(Items.breadFlour())],
            ['Put in breadmaker', this.getIng(Items.brownSugar(.25))],
            ['Put in breadmaker', this.getIng(Items.water())],
            ['Put in breadmaker', this.getIng(Items.kosherSalt())],
            ['Put in breadmaker', this.getIng(Items.dryActiveYeast())],
            ['Put in breadmaker', this.getIng(Items.butter())],
            ['Put in breadmaker', this.getIng(Items.egg())],
            ['Put bread maker on dough setting (menu item 9) and hit start'],
            ['Set Timer For One Hour'],
            [
                'Mix', this.getIng(Items.brownSugar(.5)),
                this.getIng(Items.cinnamon()),
            ],
            ['Wait for timer to go off'],
            ['Pound down dough into a flat rectangle on floured cutting board'],
            ['Spread butter + Cinnamon Sugar mixture on bread'],
            ['Roll bread into loaf and put inside greased bread pan'],
            ['Set timer for 30 min for bread or 25 min for cinnamon rolls'],
            ['Wait for timer to go off'],
            ['Preheat oven to 350 degrees'],
            ['Put bread in oven for 30 minutes'],
        ]);
        this.printRecipe();
    }
}
