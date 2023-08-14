import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Units as u } from '../constants/units';
import { Text as text } from '../class/text';
import { Timer } from '../class/timer';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.variations = [
            KitchenAidNoodles1Lb, KitchenAidNoodles2Lb
        ]
    }
}

export class KitchenAidNoodles1Lb extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bowl().add([
                i.egg(4, u.unit),
            ]),
            text.set([
                'Add water into bowl, until mixture is 207 ml'
            ]),
            e.bowl().add([
                i.water(1, u.tsp)
            ]),
            e.standMixer().add([
                i.allPurposeFlour(3.5, u.cup),
                i.salt(1, u.tsp),
            ]),
            text.set(['Attach flat beater to kitchenaid mixer']),
            text.set(['Set mixer to speed 2']),
            text.set(['Gradually add eggs and water']),
            Timer.set(30, 's', 'Mix'),
            Timer.end(),
            text.set(['Replace flat beater with dough hook']),
            Timer.set(2, 'm', 'Mix'),
            Timer.end(),
            Timer.set(20, 'm', 'Let dough rest'),
            Timer.end(),
            text.set(['Hand knead dough 10 times']),
            text.set(['Form walnut sized balls']),
            text.set(['Let noodles dry for 1.45 hours']),
            text.set(['Freeze 10 oz of noodles for 6-8 months or use']),
            text.set(['Set out balls 1 hr before usage']),
        ];
    }
}

export class KitchenAidNoodles2Lb extends Recipe {
    constructor() {
        super();
        this.steps = [
            text.set(['Make 1 lb noodles at a time.']),
        ];
    }
}
