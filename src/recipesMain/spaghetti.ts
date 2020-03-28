import { RecipeContainer } from '../class/recipe';
import { Categories as c } from '../constants/categories';
import { WholeGrain } from '../recipes/spaghetti/wholegrain';
import { Lentil } from '../recipes/spaghetti/lentil';
import { WholeGrainSausage } from '../recipes/spaghetti/wholegrain_sausage';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'Spaghetti';
        this.recipeGroup = c.meal;
        this.recipeOptions = [
            {'pasta': ['whole grain', 'lentil', 'hemp rotators']},
            {'meat': ['sausage']},
            {'veggie': ['mushroom']},
        ];
    }

    public init() {
        this.generateRecipes([
            Lentil,
            WholeGrain,
            WholeGrainSausage
        ]);
    }
}
