import { RecipeContainer } from '../class/recipe';
import { Categories as c } from '../constants/categories';
import { WholeGrainSpaghetti } from '../recipes/pasta/spaghetti/wholegrain';
import { LentilSpaghetti } from '../recipes/pasta/spaghetti/lentil';
import { LentilPenne } from '../recipes/pasta/penne/lentil';
import { WholeGrainSpaghettiSausage } from '../recipes/pasta/spaghetti/wholegrain_sausage';
import { WholeGrainSpaghettiMushroom } from '../recipes/pasta/spaghetti/wholegrain_mushrooms';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeGroup = c.meal;
        this.recipeName = 'Pasta'
        this.variations = [
            {'pasta': [WholeGrainSpaghetti, LentilSpaghetti, LentilPenne]},
            {'meat': [WholeGrainSpaghettiSausage]},
            {'veggie': [WholeGrainSpaghettiMushroom]},
        ]
    }

    public init() {
        this.generateRecipes();
    }
}
