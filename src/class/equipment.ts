import { Time } from './time';
import { Timer } from './timer';
import { Serializer as s } from './serializer';
// import { exception } from 'console';
import { IStep, istep } from './step';
import { exception } from 'console';

export interface IAllEquipment {
   [name: string]: number;
}

export interface IEquipmentObj {
    name: string;
}

export interface IEquipment {
    // Id is the identifier of the equipment
    // If you need/reuse equipment then use this
    (id?: number): IEquipmentObj;
}

let containers: any = {}

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

    public stir(): IStep {
        this.firstAction = false;
        let stirStep = istep()
        stirStep.equipment.push(this.name)
        stirStep.text = `Stir ${this.name}`
        return stirStep
    }

    public mix(): IStep {
        this.firstAction = false;
        let mixStep = istep()
        mixStep.equipment.push(this.name)
        mixStep.text = `Mix ${this.name}`
        return mixStep
    }

    // change to IItemObj | Item  once all ingredients are items
    public add(ingredients: any[] | any | any[][]): IStep {

        function hydrateIStep(addIngredient, ingredient) {
            addIngredient.text = ['•', s.turnIngObjIntoStr(ingredient, true)].join(' ')
            addIngredient.ingredients.push(ingredient)
            addIngredient.time += ingredient.takeOutTime
            addIStep.children.push(addIngredient)

            // If the unit is an equipment like a cup, then add it to the equipment
            if (ingredient.unit && ingredient.unit.isEquipment) {
                let str_ = (ingredient.unit.equipmentUnits.includes(ingredient.unit.quantity)) ? `${ingredient.unit.quantity} ${ingredient.unit.properName}` : ingredient.unit.properName
                addIngredient.equipment.push(str_)
            }
        }

        let addIStep = istep()

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

        if (Array.isArray(ingredients)) {
            addIStep.text = ['Add the following to', bindingWord, this.name].join(' ')
            addIStep.disappearWhen = 'childrenGone'
            ingredients.forEach((ingredient) => {
                let addIngredient = istep()
                if (Array.isArray(ingredient)) {
                    ingredient.forEach((ingredientNText) => {
                        if (typeof(ingredientNText) === 'object') {
                            hydrateIStep(addIngredient, ingredient)
                        } else {
                            addIngredient.text += ' ' + ingredientNText
                        }
                    })
                } else {
                    hydrateIStep(addIngredient, ingredient)
                }
            })

            return addIStep
        }

        addIStep.text = ['Add', s.turnIngObjIntoStr(ingredients, true), 'to', this.name].join(' ')
        addIStep.ingredients.push(ingredients)
        addIStep.equipment.push(this.name)

        return addIStep

        // // If you are just adding one element which happens to be an ingredient with text
        // let finalArray: any = []
        // finalArray.push('Add')
        // ingredients.forEach(element => {
        //     finalArray.push(element);
        // });
        // finalArray.push('to')
        // finalArray.push(this)

        // return finalArray

        // return ['Add', ingredients, 'to', bindingWord, this.name]
    }
}

class StandMixer extends Container {
    // Containers are a singleton
    constructor(id: number) {
        super('stand mixer', id)
    }
}

class Bowl extends Container {
    // Containers are a singleton
    constructor(id: number, name:string="bowl") {
        super(name, id)
    }

    public microwave(minutes: number): IStep {
        return Timer.set(minutes, 'm', `Microwave ${this.name} for ${minutes} minutes`);
    }

    public whisk(): IStep {
        return Timer.set(1, "m", "Whisk contents of the bowl");
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


class KitchenAidMixingBowl extends Container {
    // Containers are a singleton
    constructor(id: number) {
        super('KitchenAid Mixing Bowl', id)
    }

    public mixWithDoughHook(speed: number, minutes: number): IStep {
        return Timer.set(minutes, 'm', `Mix with dough hook on ${speed} for speed ${minutes} minutes`);
    }

    public mixWithFlatBeater(speed: number, minutes: number): IStep {
        return Timer.set(minutes, 'm', `Mix with flat beater attachment on speed ${speed} for ${minutes} minutes`);
    }

    public mixWithWhisk( speed: number, minutes: number): IStep {
        return Timer.set(minutes, 'm', `Mix with whisk attachment on speed ${speed} for ${minutes} minutes`);
    }
}


class CookingContainer extends Container {
    // Containers are a singleton
    constructor(name: string, id: number) {
        super(name, id)
    }

    public cook(duration: number, type: string, item: any, degrees: number) {
        this.firstAction = false;
        console.log(`cook should be overloaded ${duration} ${type} ${item} ${degrees}`)
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

    public preheat(heat: number): IStep {
        if (heat === 350) {
            // Return how long preheating pan takes
            // This is a guess.. should test it out
            return Timer.set(5, 'm', `Preheat ${this.name} to 350°`);
        }

        if (heat === 500) {
            // Return how long preheating pan takes
            // This is a guess.. should test it out
            return Timer.set(8, 'm', `Preheat ${this.name} to 500°`);
        }

        return Timer.set(5, 'm', `Preheat ${this.name} on heat ${heat}`);
    }

    public cook(duration: number, type: string, degrees: number): IStep {
        return Timer.set(duration, type, `Cook ${this.name} @ ${degrees}°`);
    }

    public roast(duration: number, type: string, degrees: number): IStep {
        return Timer.set(duration, type, `Roast ${this.name} @ ${degrees}°`);
    }
}

class Ninja extends CookingContainer {
    constructor(id: number) {
        super("ninja", id)
    }

    public preheat(heat: number): IStep {
        if (heat === 500) {
            // Return how long preheating pan takes
            // This is a guess.. should test it out
            return Timer.set(8, 'm', `Preheat ${this.name} to 500°`);
        }

        return Timer.set(5, 'm', `Preheat ${this.name} on heat ${heat}`);
    }

    public preheatAirFry(minutes: number): IStep {
        return Timer.set(5, 'm', `Turn ${this.name} airfry setting to ${minutes} minutes`);
    }

    public cook(duration: number, type: string, degrees: number): IStep {
        return Timer.set(duration, type, `Cook ${this.name} @ ${degrees}°`);
    }
}

class SaucePan extends CookingContainer {
    constructor(id: number) {
        super("sauce pan", id)
    }

    // public cook(duration: number, type: string, item: any, heat: number, async: boolean = false) {
    //     return [Timer.set(duration, type, `Cook ${sanitize(item)} in ${this.name} on heat ${heat}`, async)];
    // }
}

class BakingSheet extends CookingContainer {
    constructor(id: number) {
        super("baking sheet", id)
    }

    // public cook(duration: number, type: string, item: any, heat: number, async: boolean = false) {
    //     return [Timer.set(duration, type, `Cook ${sanitize(item)} in ${this.name} on heat ${heat}`, async)];
    // }
}

class Pot extends CookingContainer {
    constructor(id: number) {
        super("pot", id)
    }

    public cook(duration: number, type: string, heat: number): IStep {
        return Timer.set(duration, type, `Cook ${this.name} @ ${heat}°`, [this.name]);
    }
}


class Teapot extends CookingContainer {
    constructor(id: number) {
        super("teapot", id)
    }

    // public cook(duration: number, type: string, item: any, heat: number, async: boolean = false) {
    //     return [Timer.set(duration, type, `Cook ${sanitize(item)} in ${this.name} on heat ${heat}`, async)];
    // }
}


class Pan extends CookingContainer {
    heat: number;

    constructor(id: number) {
        super("pan", id)
    }

    public preheat(heat: number, minutes: number = 0): IStep {
        // This is a guess.. should test it out
        this.heat = heat

        if (heat === 5) {
            // Return how long preheating pan takes
            return Timer.set(2, 'm', `Preheat ${this.name} on heat ${heat}`, [this.name]);
        }

        if (heat === 7) {
            // Return how long preheating pan takes
            return Timer.set(4, 'm', `Preheat ${this.name} on heat ${heat}`, [this.name]);
        }

        return Timer.set(minutes, 'm', `Preheat ${this.name} on heat ${heat}`, [this.name]);
    }

    public _cookStr(text: string, duration: number, type: string, heat: number = 0): IStep {
        if (heat === 0) {
            if (this.heat) {
                heat = this.heat
            }
            else {
                throw new exception('Heat cannot be 0')
            }
        }

        return Timer.set(duration, type, text, [this.name])
    }

    public cook(duration: number, type: string, heat: number = 0): IStep {
        return this._cookStr(`Cook on heat ${heat}`, duration, type, heat)
    }


    public cookWithLidSlightlyOff(duration: number, type: string, heat: number = 0): IStep {
        return this._cookStr(`Cook on heat ${heat} with lid slightly off`, duration, type, heat)
    }

    public cookWithLid(duration: number, type: string, heat: number = 0): IStep {
        return this._cookStr(`Cook on heat ${heat} with lid`, duration, type, heat)
    }
}

class InstantPot extends CookingContainer {
    constructor(id: number) {
            super("instant pot", id)
        }

    public pressureCook(preheat: number, duration: number, type: string): IStep {
        let preheatStep = istep()
        preheatStep.time += Time.convert(preheat, type)
        preheatStep.text = `Put ${this.name} on high pressure for ${duration} minutes`
        preheatStep.equipment.push(this)
        preheatStep.disappearWhen = 'timeUp'

        let ensureSeal = istep()
        ensureSeal.text = `Ensure ${this.name} has sealed`
        ensureSeal.equipment.push(this)
        ensureSeal.disappearWhen = 'clicked'

        let pressureCookStep = istep()
        pressureCookStep.time += Time.convert(duration, type)
        pressureCookStep.equipment.push(this)
        pressureCookStep.text = `Wait for ${this.name} to be done cooking`
        pressureCookStep.disappearWhen = 'timeUp'

        preheatStep.children.push(ensureSeal)
        preheatStep.children.push(pressureCookStep)

        return preheatStep
    }

    public sautee(duration: number, type: string): IStep {
        return Timer.set(duration, type, `Sautee on high`)
    }

    // public pressureRelease(duration: number, type: string) {
    //     return [
    //         Timer.set(duration, type, `Let pressure release`, true),
    //     ]
    // }
}

class CoffeeCup extends Container {
    constructor(id: number) {
        super("coffee cup", id)
    }
}

class Blender extends Container {
    constructor(id: number) {
        super("blender", id)
    }

    public blend(duration, type) {
        return Timer.set(duration, type, 'Blend', [this.name])
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

    public static readonly ninja = (id: number = 99) => (
        new Ninja(id)
    );

    public static readonly saucePan = (id: number = 99) => (
        new SaucePan(id)
    );

    public static readonly pan = (id: number = 99) => (
        new Pan(id)
    );

    public static readonly oven = (id: number = 99) => (
        new Oven(id)
    );

    public static readonly kitchenAidMixingBowl = (id: number = 99) => (
        new KitchenAidMixingBowl(id)
    );

    public static readonly ziplockBag = (id: number = 99) => (
        new ZiplockBag(id)
    );

    public static readonly bowl = (id: number = 99) => (
        new Bowl(id)
    );

    public static readonly largeBowl = (id: number = 99) => (
        new LargeBowl(id)
    );

    public static readonly standMixer = (id: number = 99) => (
        new StandMixer(id)
    );

    public static readonly coffeecup = (id: number = 99) => (
        new CoffeeCup(id)
    );

    public static readonly blender = (id: number = 99) => (
        new Blender(id)
    )

    public static readonly bakingSheet = (id: number = 99) => (
        new BakingSheet(id)
    );

    public static readonly teapot = (id: number = 99) => (
        new Teapot(id)
    );

    public static readonly pot = (id: number = 99) => (
        new Pot(id)
    );

    public static readonly instantPot = (id: number = 99) => (
        new InstantPot(id)
    );

    public static readonly souvide: IEquipment = (id: number = 99) => ({
        name: 'souvide',
        id: id
    });

    public static readonly woodenSpoon: IEquipment = (id: number = 99) => ({
        name: 'wooden spoon',
        id: id
    });

    public static readonly spoon: IEquipment = (id: number = 99) => ({
        name: 'spoon',
        id: id
    });
}
