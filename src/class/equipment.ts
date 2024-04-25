import { Time } from './time';
import { Timer } from './timer';
import { Serializer as s } from './serializer';
import { IStep, istep } from './step';
import { Ingredient } from './ingredients/ingredient';

export interface IAllEquipment {
   [name: string]: number;
}

export interface IEquipmentObj {
    name: string;
}

export interface IContainersObj {
    [name: string]: string;
}

export interface IEquipment {
    // Id is the identifier of the equipment
    // If you need/reuse equipment then use this
    (id?: number): IEquipmentObj;
}

const containers: any = {}

class Container {
    name: string;
    id: number;
    firstAction: boolean;

    // Containers are a singleton
    constructor(name: string, id: number) {
        const objectKey = `${name}${id}`
        if (containers.hasOwnProperty(objectKey)) {
            return containers[objectKey]
        }

        this.name = name;
        this.id = id;
        this.firstAction = true;
        containers[`${name}${id}`] = this;
    }

    public done(): IStep {
        this.firstAction = false;
        const stirStep = istep()
        stirStep.equipment.push(this.name)
        // just have empty step for now
        stirStep.text = ''
        return stirStep
    }

    public stir(): IStep {
        this.firstAction = false;
        const stirStep = istep()
        stirStep.equipment.push(this.name)
        stirStep.text = `Stir ${this.name}`
        return stirStep
    }

    public mix(): IStep {
        this.firstAction = false;
        const mixStep = istep()
        mixStep.equipment.push(this.name)
        mixStep.text = `Mix ${this.name}`
        return mixStep
    }

    public add(ingredients: Ingredient[]): IStep {

        function hydrateIStep(addIngredient: IStep, ingredient: Ingredient) {
            addIngredient.ingredients.push(ingredient)
            addIngredient.text = [s.lazyIngredientIdx, addIngredient.ingredients.length-1].join(' ')
            addIngredient.time += ingredient.takeOutTime
            addIStep.children.push(addIngredient)

            // If the unit is an equipment like a cup, then add it to the equipment
            // if (ingredient.unit && ingredient.unit.isEquipment) {
            //     const str_ = (ingredient.unit.equipmentUnits.includes(ingredient.unit.quantity)) ? `${ingredient.unit.quantity} ${ingredient.unit.properName}` : ingredient.unit.properName
            //     addIngredient.equipment.push(str_)
            // }
        }

        const addIStep = istep()

        let bindingWord = 'the'
        // If its the first
        if (this.firstAction) {
            if (['a','e','i','o','u'].includes(this.name[0])) {
                bindingWord = 'an'
            } else {
                bindingWord = 'a'
            }
            this.firstAction = false;
        }

        addIStep.text = ['Add the following to', bindingWord, this.name].join(' ')
        addIStep.disappearWhen = 'childrenGone'
        ingredients.forEach((ingredient) => {
            const addIngredient = istep()
            hydrateIStep(addIngredient, ingredient)
        })

        return addIStep
    }
}

class StandMixer extends Container {
    // Containers are a singleton
    constructor(id: number) {
        super('stand mixer', id)
    }
}

class BulletMixer extends Container {
    // Containers are a singleton
    constructor(id: number) {
        super('bullet mixer', id)
    }
}

class Plate extends Container {
    // Containers are a singleton
    constructor(id: number, name="plate") {
        super(name, id)
    }

    public microwave(duration: number, unit = "", disappearWhen = 'timerIsUp'): IStep {
        let humanUnit = "minutes"

        if (unit == "s") {
            humanUnit = "seconds"
        }

        return Timer.set(duration, unit, `Microwave ${this.name} for ${duration} ${humanUnit}`, [], disappearWhen);
    }
}

class Mug extends Container {
    // Containers are a singleton
    constructor(id: number, name="mug") {
        super(name, id)
    }
}

class Bowl extends Container {
    // Containers are a singleton
    constructor(id: number, name="bowl") {
        super(name, id)
    }

    public microwave(duration: number, unit = "", disappearWhen = 'timerIsUp'): IStep {
        let humanUnit = "minutes"

        if (unit == "s") {
            humanUnit = "seconds"
        }

        return Timer.set(duration, unit, `Microwave ${this.name} for ${duration} ${humanUnit}`, [], disappearWhen);
    }

    public whisk(disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(1, "m", "Whisk contents of the bowl", [], disappearWhen);
    }
}

class LargeBowl extends Bowl {
    constructor(id: number) {
        super(id, "largebowl")
    }
}


class ZiplockBag extends Container {
    // Containers are a singleton
    constructor(id: number) {
        super('ziplockBag', id)
    }
}

class SmallStainlessSteelContainer extends Container {
    // Containers are a singleton
    constructor(id: number) {
        super('17.6 ounce stainless steel container', id)
    }    
}

class LargeStainlessSteelContainer extends Container {
    // Containers are a singleton
    constructor(id: number) {
        super('34 ounce stainless steel container', id)
    }    
}


class KitchenAidMixingBowl extends Container {
    // Containers are a singleton
    constructor(id: number) {
        super('KitchenAid Mixing Bowl', id)
    }

    public mixWithDoughHook(speed: number, minutes: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(minutes, 'm', `Mix with dough hook on ${speed} for speed ${minutes} minutes`, [], disappearWhen);
    }

    public mixWithFlatBeater(speed: number, minutes: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(minutes, 'm', `Mix with flat beater attachment on speed ${speed} for ${minutes} minutes`, [], disappearWhen);
    }

    public mixWithWhisk( speed: number, minutes: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(minutes, 'm', `Mix with whisk attachment on speed ${speed} for ${minutes} minutes`, [], disappearWhen);
    }
}


class CookingContainer extends Container {
    // Containers are a singleton
    constructor(name: string, id: number) {
        super(name, id)
    }

    public cook(duration: number, type: string, degrees: number, disappearWhen: string = 'timerIsUp') {
        this.firstAction = false;
        console.log(`cook should be overloaded ${duration} ${type} ${degrees} ${disappearWhen}`)
    }

    public preheat(heat: number) {
        this.firstAction = false;
        console.log(`Preheat should be overloaded ${heat}`)
    }
}

class Oven extends CookingContainer {
    constructor(id: number) {
        super("oven", id)
    }

    public preheat(heat: number, disappearWhen = 'timerIsUp'): IStep {
        if (heat === 350) {
            // Return how long preheating pan takes
            // This is a guess.. should test it out
            return Timer.set(5, 'm', `Preheat ${this.name} to 350°`, [], disappearWhen);
        }

        if (heat === 425) {
            // Return how long preheating pan takes
            // This is a guess.. should test it out
            return Timer.set(15, 'm', `Preheat ${this.name} to 425°`);
        }

        if (heat === 500) {
            // Return how long preheating pan takes
            // This is a guess.. should test it out
            return Timer.set(16, 'm', `Preheat ${this.name} to 500°`);
        }

        return Timer.set(5, 'm', `Preheat ${this.name} on heat ${heat}`);
    }

    public cook(duration: number, type: string, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Cook ${this.name} @ ${degrees}°`, [], disappearWhen);
    }

    public roast(duration: number, type: string, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Roast ${this.name} @ ${degrees}°`, [], disappearWhen);
    }
}

class Ninja extends CookingContainer {
    constructor(id: number) {
        super("ninja", id)
    }

    public preheat(heat: number, disappearWhen = 'timerIsUp'): IStep {
        if (heat === 500) {
            // Return how long preheating pan takes
            // This is a guess.. should test it out
            return Timer.set(8, 'm', `Preheat ${this.name} to 500°`);
        }

        return Timer.set(5, 'm', `Preheat ${this.name} on heat ${heat}`, [], disappearWhen);
    }

    public preheatAirFry(minutes: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(5, 'm', `Turn ${this.name} airfry setting to ${minutes} minutes`, [], disappearWhen);
    }

    public cook(duration: number, type: string, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Cook ${this.name} @ ${degrees}°`, [], disappearWhen);
    }
}

class Grinder extends CookingContainer {
    constructor(id: number) {
        super("grinder", id)
    }
}

class Glass extends CookingContainer {
    constructor(id: number) {
        super("glass", id)
    }
}

class SaucePan extends CookingContainer {
    constructor(id: number) {
        super("sauce pan", id)
    }
}

class BakingSheet extends CookingContainer {
    constructor(id: number) {
        super("baking sheet", id)
    }
}

class Pot extends CookingContainer {
    constructor(id: number) {
        super("pot", id)
    }
    heat: number;

    public _getHeat(heat: number) {
        if (heat < 1) {
            if (this.heat) {
                return this.heat
            } else {
                throw new Error('Heat cannot be 0')
            }
        }
        return heat
    }

    public _cookStr(text: string, duration: number, type: string, heat: number, disappearWhen = 'timerIsUp'): IStep {
        heat = this._getHeat(heat)
        return Timer.set(duration, type, text, [this.name], disappearWhen)
    }

    public cook(duration: number, type: string, heat: number, disappearWhen = 'timerIsUp'): IStep {
        heat = this._getHeat(heat)
        return this._cookStr(`Cook ${this.name}`, duration, type, heat, disappearWhen)
    }

    public cookWithoutLid(duration: number, type: string, heat: number, disappearWhen = 'timerIsUp'): IStep {
        heat = this._getHeat(heat)
        return this._cookStr(`Cook ${this.name} without lid`, duration, type, heat, disappearWhen)
    }

    public cookWithLid(duration: number, type: string, heat: number, text = "", disappearWhen = 'timerIsUp'): IStep {
        heat = this._getHeat(heat)
        if (text) {
            text = text + " "
        }
        return this._cookStr(`Cook ${this.name} with lid`, duration, type, heat, disappearWhen)
    }

    public cookWithLidSlightlyOff(duration: number, type: string, heat: number, text = "", disappearWhen = 'timerIsUp'): IStep {
        heat = this._getHeat(heat)
        if (text) {
            text = text + " "
        }
        return this._cookStr(`Cook ${text}${this.name} with lid slightly off`, duration, type, heat, disappearWhen)
    }

    public boilWithLid(duration: number, type: string, heat: number, disappearWhen = 'timerIsUp'): IStep {
        heat = this._getHeat(heat)
        return this._cookStr(`Boil ${this.name} contents on heat ${heat} with lid on`, duration, type, heat, disappearWhen)
    }
}


class Strainer extends CookingContainer {
    constructor(id: number) {
        super("strainer", id)
    }

    public wash(text: string, duration: number, type: string, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, text, [this.name], disappearWhen)
    }
}

class Teapot extends CookingContainer {
    constructor(id: number) {
        super("teapot", id)
    }
}

class FoodProcessor extends CookingContainer {
    heat: number;

    constructor(id: number) {
        super("food processor", id)
    }
}

class Pan extends CookingContainer {
    heat: number;

    constructor(id: number) {
        super("pan", id)
    }

    public preheat(heat: number, minutes = 0, disappearWhen = 'timerIsUp'): IStep {
        // This is a guess.. should test it out
        this.heat = heat

        if (heat === 5) {
            // Return how long preheating pan takes
            return Timer.set(2, 'm', `Preheat ${this.name} on heat ${heat}`, [this.name], disappearWhen);
        }

        if (heat === 7) {
            // Return how long preheating pan takes
            return Timer.set(4, 'm', `Preheat ${this.name} on heat ${heat}`, [this.name], disappearWhen);
        }

        return Timer.set(minutes, 'm', `Preheat ${this.name} on heat ${heat}`, [this.name]);
    }

    public _getHeat(heat = 0) {
        if (heat === 0) {
            if (this.heat) {
                return this.heat
            } else {
                throw new Error('Heat cannot be 0')
            }
        }
        return heat
    }

    public _cookStr(text: string, duration: number, type: string, heat = 0, disappearWhen = 'timerIsUp'): IStep {
        heat = this._getHeat(heat)
        return Timer.set(duration, type, text, [this.name], disappearWhen)
    }

    public cook(duration: number, type: string, heat = 0, disappearWhen = 'timerIsUp'): IStep {
        heat = this._getHeat(heat)
        return this._cookStr(`Cook on heat ${heat}`, duration, type, heat, disappearWhen)
    }


    public cookWithLidSlightlyOff(duration: number, type: string, heat = 0, disappearWhen = 'timerIsUp'): IStep {
        heat = this._getHeat(heat)
        return this._cookStr(`Cook on heat ${heat} with lid slightly off`, duration, type, heat, disappearWhen)
    }

    public cookWithLid(duration: number, type: string, heat = 0, text = "", disappearWhen = 'timerIsUp'): IStep {
        if (text) {
            text = text + " "
        }
        heat = this._getHeat(heat)
        return this._cookStr(`Cook ${text}pan on heat ${heat} with lid`, duration, type, heat, disappearWhen)
    }
}

class InstantPot extends CookingContainer {
    constructor(id: number) {
            super("instant pot", id)
        }

    public pressureCook(preheat: number, duration: number, type: string, disappearWhen = 'timerIsUp'): IStep {
        const preheatStep = istep()
        preheatStep.time += Time.convert(preheat, type)
        preheatStep.text = `Put ${this.name} on high pressure for ${duration} minutes`
        preheatStep.equipment.push(this.name)
        preheatStep.disappearWhen = disappearWhen

        const ensureSeal = istep()
        ensureSeal.text = `Ensure ${this.name} has sealed`
        ensureSeal.equipment.push(this.name)
        ensureSeal.disappearWhen = 'clicked'

        const pressureCookStep = istep()
        pressureCookStep.time += Time.convert(duration, type)
        pressureCookStep.equipment.push(this.name)
        pressureCookStep.text = `Wait for ${this.name} to be done cooking`
        pressureCookStep.disappearWhen = disappearWhen

        preheatStep.children.push(ensureSeal)
        preheatStep.children.push(pressureCookStep)

        return preheatStep
    }

    public sautee(duration: number, type: string, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Sautee on high`, [], disappearWhen)
    }

    public pressureRelease(duration: number, type: string, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, 'Let pressure release', [], disappearWhen)
    }
}

class CoffeeCup extends Container {
    constructor(id: number) {
        super("coffee cup", id)
    }
}

export class Equipment {
    // 99 is just an identifier that doesn't start with 0/1/2
    // By default we assume that equipment is reused throughout the recipe

    public static readonly knife = () => {
        return 'knife'
    }

    public static readonly cuttinBoard = () => {
        return 'cutting board'
    }


    public static readonly peeler = () => {
        return 'peeler'
    }

    public static readonly ninja = (id = 99) => (
        new Ninja(id)
    );

    public static readonly grinder = (id = 99) => (
        new Grinder(id)
    );

    public static readonly glass = (id = 99) => (
        new Glass(id)
    );

    public static readonly saucePan = (id = 99) => (
        new SaucePan(id)
    );

    public static readonly pan = (id = 99) => (
        new Pan(id)
    );

    public static readonly smallStainlessSteelContainer = (id = 99) => (
        new SmallStainlessSteelContainer(id)
    );

    public static readonly largeStainlessSteelContainer = (id = 99) => (
        new LargeStainlessSteelContainer(id)
    );

    public static readonly foodProcessor = (id = 99) => (
        new FoodProcessor(id)
    );

    public static readonly plate = (id = 99) => (
        new Plate(id)
    );

    public static readonly oven = (id = 99) => (
        new Oven(id)
    );

    public static readonly kitchenAidMixingBowl = (id = 99) => (
        new KitchenAidMixingBowl(id)
    );

    public static readonly ziplockBag = (id = 99) => (
        new ZiplockBag(id)
    );

    public static readonly bowl = (id = 99) => (
        new Bowl(id)
    );

    public static readonly mug = (id = 99) => (
        new Mug(id)
    );

    public static readonly largeBowl = (id = 99) => (
        new LargeBowl(id)
    );

    public static readonly standMixer = (id = 99) => (
        new StandMixer(id)
    );

    public static readonly bulletMixer = (id = 99) => (
        new BulletMixer(id)
    );

    public static readonly coffeecup = (id = 99) => (
        new CoffeeCup(id)
    );

    public static readonly bakingSheet = (id = 99) => (
        new BakingSheet(id)
    );

    public static readonly teapot = (id = 99) => (
        new Teapot(id)
    );

    public static readonly pot = (id = 99) => (
        new Pot(id)
    );

    public static readonly strainer = (id = 99) => (
        new Strainer(id)
    );

    public static readonly instantPot = (id = 99) => (
        new InstantPot(id)
    );

    public static readonly souvide: IEquipment = (id = 99) => ({
        name: 'souvide',
        id: id
    });

    public static readonly woodenSpoon: IEquipment = (id = 99) => ({
        name: 'wooden spoon',
        id: id
    });

    public static readonly spoon: IEquipment = (id = 99) => ({
        name: 'spoon',
        id: id
    });
}
