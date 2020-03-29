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
    }

    public init() {
        this.generateRecipes([
            {'pasta': [WholeGrain, Lentil]},
            {'meat': [WholeGrainSausage]},
        ]);
    }
}
