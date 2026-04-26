import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

const oven = e.oven();
const bowl = e.bowl();

const OVEN_TEMP = 450;
const PANKO_TOAST_MINUTES = 5;
const FIRST_BAKE_MINUTES = 12;
const SECOND_BAKE_MINUTES = 13;
const BROIL_MINUTES = 1;

export class MealRecipe extends RecipeContainer {
  constructor() {
    super();

    this.variations = [BreadedMushrooms];
  }
}

class BreadedMushrooms extends Recipe {
  constructor() {
    super();

    this.steps = [
      oven.preheat(OVEN_TEMP),

      Timer.set(PANKO_TOAST_MINUTES, 'm', 'Toast panko'),
      Timer.end(),

      bowl.add([
        i.cassavaFlour(0.5, u.cup),
        i.cornstarch(2, u.tbsp),
        i.water(7, u.ounce),
        i.salt(0.5, u.tsp),
        i.garlicPowder(0.5, u.tsp),
      ]),

      text.set(['Slice 3–4 king oyster mushrooms']),
      text.set(['Dip mushrooms into batter, let drain, then coat with panko']),
      text.set(['Spray', i.avocadoOil(), 'on breaded mushrooms']),

      oven.cook(FIRST_BAKE_MINUTES, 'm', OVEN_TEMP),
      Timer.end(),

      text.set(['Flip mushrooms']),

      oven.cook(SECOND_BAKE_MINUTES, 'm', OVEN_TEMP),
      Timer.end(),

      oven.broil(BROIL_MINUTES, 'm', OVEN_TEMP),
      Timer.end(),
    ];
  }
}