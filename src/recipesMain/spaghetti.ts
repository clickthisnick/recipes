import { RecipeContainer } from '../class/recipe';
import { Categories as c } from '../constants/categories';
import { WholeGrain } from '../recipes/spaghetti/wholegrain';
import { Lentil } from '../recipes/spaghetti/lentil';
import { WholeGrainSausage } from '../recipes/spaghetti/wholegrain_sausage';
import { WholeGrainMushroom } from '../recipes/spaghetti/wholegrain_mushrooms';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'Spaghetti'
        this.variations = [
            {'pasta': [WholeGrain, Lentil]},
            {'meat': [WholeGrainSausage]},
            {'veggie': [WholeGrainMushroom]},
        ]
    }

    public init() {
        this.generateRecipes();
    }
}
