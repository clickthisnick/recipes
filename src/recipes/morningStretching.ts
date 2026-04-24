import { Recipe, RecipeContainer } from '../class/recipe';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            MorningStretch
        ]
    }
}

const duration = 60

class MorningStretch extends Recipe {
    constructor() {
        super();
        this.steps = [
            Timer.set(duration, 's', '2 Leg Down'),
            Timer.end(),
            Timer.set(duration, 's', 'standing quad leg to back stretch right'),
            Timer.end(),
            Timer.set(duration, 's', 'standing quad leg to back stretch left'),
            Timer.end(),
            Timer.set(duration, 's', 'Butterfly'),
            Timer.end(),
            Timer.set(duration, 's', 'Back Twist Left'),
            Timer.end(),
            Timer.set(duration, 's', 'Back Twist Right'),
            Timer.end(),
            Timer.set(duration, 's', 'Butterfly one leg right straight'),
            Timer.end(),
            Timer.set(duration, 's', 'Butterfly one leg left straight'),
            Timer.end(),
            Timer.set(duration, 's', 'Cobra'),
            Timer.end(),
            Timer.set(duration, 's', 'Two Leg Down'),
            Timer.end(),
        ];
    }
}
