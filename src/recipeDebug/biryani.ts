import { Recipe, RecipeContainer } from '../class/recipe';
import { Items as i } from '../constants/items';
import { Equipment as e } from '../class/equipment';
import { Categories as c } from '../constants/categories';
import { Units as u } from '../constants/units';
import { Timer } from '../class/timer';
import { Text as text} from '../class/text';

export class MealRecipe extends RecipeContainer {
    constructor() {
        super();
        this.recipeName = 'Biryani Rice';
        this.recipeGroup = c.component;
        this.variations = [
            Biryani1PoundChicken1CupRice, Biryani2PoundChicken2CupRice
        ]
    }
}

class Biryani1PoundChicken1CupRice extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bowl(0).add([
                i.plainYogurt(.5, u.cup),
                i.gramMasala(1, u.tsp),
                i.chilliPowder(1, u.tsp),
                i.salt(1, u.tsp),
                i.dhanaJeera(1, u.tbsp),// i.cilantro(2, u.tbsp),
                i.gingerPowder(.5, u.tsp), // i.gingerPaste(.5, u.tsp),
                i.garlicPowder(.5, u.tsp), // i.garlicPaste(.5, u.tsp),
                i.turmeric(.25, u.tsp),
                i.lemonJuice(1, u.tbsp),
                i.mintLeaf(2, u.tbsp),
                i.chickenBreast(1, u.pound),// i.chickenBreast(1, u.pound),
            ]),
            Timer.set(30, 'm', 'Let chicken marinade'),
                i.yellowOnion(.5, u.pound).cutIntoThinSlices(),
            Timer.end(),
            e.instantPot().add([
                i.butter(2, u.tbsp),
                i.yellowOnion(),
            ]),
            e.instantPot().sautee(10, 'm'),
                e.bowl(1).add([
                    i.coconutMilk(2, u.tbsp),
                    i.saffron(10, u.stick),
                ]),
                e.bowl(1).microwave(.5),
                Timer.end(),
            Timer.end(),
            text.set(['Take out half of the onions and put into a bowl']),
            text.set(['Put onions to one side of the instapot, so you can add the whole spices to the other side']),
            e.instantPot().add([
                // 1 stick Cinnamon (Dalchini)
                i.bayLeaf(2, u.unit),
                i.greenCardamonSeed(.5, u.tsp),
                i.wholeBlackPepper(.5, u.tsp),
                i.clove(4, u.unit),
                // ▢½ teaspoon Cumin seeds (Jeera)
            ]),
            Timer.set(1, 'm', 'Sitr spices and onion SEPARATELY '),
            Timer.end(),
            text.set(['Take out whole spices']),
            e.instantPot().add([
                i.chickenBreast()
            ]),
            Timer.set(10, 'm', 'Cook chicken'),
            Timer.end(),
            text.set(['In the next step, when you add the rice on top of the chicken, make sure to flatten it out.']),
            e.instantPot().add([
                i.basmatiRice(1, u.cup),
                i.ingredient('Milk + Saffron Mixture'),
                i.water(1, u.cup),
            ]),
            e.instantPot().pressureCook(1, 8, 'm'),
            text.set(['Natural pressure release for 10 minutes.']),
        ];
    }
}

class Biryani2PoundChicken2CupRice extends Recipe {
    constructor() {
        super();
        this.steps = [
            e.bowl(0).add([
                i.plainYogurt(1, u.cup),
                i.gramMasala(2, u.tsp),
                i.chilliPowder(2, u.tsp),
                i.salt(2, u.tsp),
                i.dhanaJeera(2, u.tbsp),// i.cilantro(2, u.tbsp),
                i.gingerPowder(1, u.tsp), // i.gingerPaste(.5, u.tsp),
                i.garlicPowder(1, u.tsp), // i.garlicPaste(.5, u.tsp),
                i.turmeric(.5, u.tsp),
                i.lemonJuice(2, u.tbsp),
                i.mintLeaf(4, u.tbsp),
                i.chickenBreast(2, u.pound),// i.chickenBreast(1, u.pound),
            ]),
            Timer.set(30, 'm', 'Let chicken marinade'),
                i.yellowOnion(1, u.pound).cutIntoThinSlices(),
            Timer.end(),
            e.instantPot().add([
                i.butter(1, u.tbsp),
                i.yellowOnion(),
            ]),
            e.instantPot().sautee(12, 'm'),
                e.bowl(1).add([
                    i.coconutMilk(4, u.tbsp),
                    i.saffron(20, u.stick),
                ]),
                e.bowl(1).microwave(.25),
                Timer.end(),
            Timer.end(),
            text.set(['Take out half of the onions and put into a bowl']),
            text.set(['Put onions to one side of the instapot, so you can add the whole spices to the other side']),
            e.instantPot().add([
                // 2 stick Cinnamon (Dalchini)
                i.bayLeaf(4, u.unit),
                i.greenCardamonSeed(1, u.tsp),
                i.wholeBlackPepper(1, u.tsp),
                i.clove(8, u.unit),
                // 1 teaspoon Cumin seeds (Jeera)
            ]),
            Timer.set(1, 'm', 'Sitr spices and onion SEPARATELY '),
            Timer.end(),
            text.set(['Take out whole spices']),
            e.instantPot().add([
                i.chickenBreast()
            ]),
            Timer.set(5, 'm', 'Cook chicken'),
            Timer.end(),
            text.set(['In the next step, when you add the rice on top of the chicken, make sure to flatten it out.']),
            e.instantPot().add([
                i.basmatiRice(2, u.cup),
                i.ingredient('Milk + Saffron Mixture'),
                i.water(2, u.cup),
            ]),
            e.instantPot().pressureCook(1, 4, 'm'),
            text.set(['Natural pressure release for 10 minutes.']),
        ];
    }
}
