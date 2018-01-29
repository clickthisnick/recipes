import { Recipe } from '../class/recipe';
import { Items as i } from '../constants/items';

export class CinnamonSugarBread extends Recipe {
    constructor() {
        super();
        this.recipeName = CinnamonSugarBread.name;
        this.addIngredients([
            i.brownSugar(.75, i.cup()),
            i.breadFlour(4, i.cup()),
            i.water(1, i.cup()),
            i.egg(2),
            i.butter(.25, i.cup()),
            i.dryActiveYeast(1.5, i.tsp()),
            i.kosherSalt(1, i.tsp()),
            i.cinnamon(2, i.tsp()),
        ]);
    }

    public generateRecipe() {
        this.prep();
        this.addSteps([
            ['Attach breadmaker arm'],
            ['Put in breadmaker', this.get(i.breadFlour())],
            ['Put in breadmaker', this.get(i.brownSugar(.25))],
            ['Put in breadmaker', this.get(i.water())],
            ['Put in breadmaker', this.get(i.kosherSalt())],
            ['Put in breadmaker', this.get(i.dryActiveYeast())],
            ['Put in breadmaker', this.get(i.butter())],
            ['Put in breadmaker', this.get(i.egg())],
            ['Put bread maker on dough setting (menu item 9) and hit start'],
            ['Set Timer For One Hour'],
            [
                // TODO: Currently cannot use the same ingredient more than once
                'Mix .5 Cups brownSugar',
                this.get(i.cinnamon()),
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

const recipe = new CinnamonSugarBread();

recipe.generateRecipe();
