import { Recipe, RecipeContainer } from '../class/recipe';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

const STRETCH_DURATION_SECONDS = 60;

const stretches = [
  'Two Leg Down',
  'Standing quad leg-to-back stretch — right',
  'Standing quad leg-to-back stretch — left',
  'Butterfly',
  'Back twist — left',
  'Back twist — right',
  'Butterfly, one leg right straight',
  'Butterfly, one leg left straight',
  'Cobra',
  'Two Leg Down',
];

export class MealRecipe extends RecipeContainer {
  constructor() {
    super();

    this.variations = [MorningStretch];
  }
}

class MorningStretch extends Recipe {
  constructor() {
    super();

    this.steps = [
      ...stretches.flatMap(stretch => [
        Timer.set(STRETCH_DURATION_SECONDS, 's', stretch),
        Timer.end(),
      ]),
      text.set(['25 push-ups']),
    ];
  }
}