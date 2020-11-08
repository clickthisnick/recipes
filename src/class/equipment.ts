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

// function sanitize(item: any): string {
//     if (typeof item === 'string') {
//         return item;
//     } else if (typeof item === 'object') {
//         return s.turnIngObjIntoStr(item, true);
//     }

//     return 'error timer sanitizing';
// }


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
        stirStep.text = `Stir ${this.name}`
        return stirStep
    }

    // change to IItemObj | Item  once all ingredients are items
    public add(ingredients: any[] | any | any[][]): IStep {
        let addIStep = istep()
        addIStep.equipment.push(this)

        let bindingWord = 'the'

        // If its the first 
        if (this.firstAction) {
            if (['a','e','i','o','u'].includes(this.name[0])) {
                bindingWord = 'an'
            } else {
                bindingWord = 'a'
            }
        } 

        this.firstAction = false;

        if (Array.isArray(ingredients)) {
            addIStep.text = ['Add the following to', bindingWord, this.name].join(' ')
            addIStep.disappearWhen = 'childrenGone'
            ingredients.forEach((ingredient) => {
                let addIngredient = istep()
                if (Array.isArray(ingredient)) {
                    ingredient.forEach((ingredientNText) => {
                        console.log(ingredientNText)
                        if (typeof(ingredientNText) === 'object') {
                            addIngredient.text = ['•', s.turnIngObjIntoStr(ingredientNText, true)].join(' ')
                            addIngredient.ingredients.push(ingredientNText)
                            addIngredient.time += ingredientNText.text
                            addIStep.children.push(addIngredient)                    
                        } else {
                            addIngredient.text += ' ' + ingredientNText
                        } 
                    })
                } else {
                    addIngredient.text = ['•', s.turnIngObjIntoStr(ingredient, true)].join(' ')
                    addIngredient.ingredients.push(ingredient)
                    addIngredient.time += ingredient.takeOutTime
                    addIStep.children.push(addIngredient)  
                }
            })

            return addIStep
        }

        addIStep.text = ['Add', s.turnIngObjIntoStr(ingredients, true), 'to', this.name].join(' ') 
        addIStep.ingredients.push(ingredients)

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

class Bowl extends Container {
    // Containers are a singleton
    constructor(id: number) {
        super('bowl', id)
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

class Teapot extends CookingContainer {
    constructor(id: number) {
        super("sauce pan", id)
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
            return Timer.set(5, 'm', `Preheat ${this.name} on heat ${heat}`);
        }

        return Timer.set(minutes, 'm', `Preheat ${this.name} on heat ${heat}`);
    }

    public cook(duration: number, type: string, heat: number = 0): IStep {
        if (heat === 0) {
            if (this.heat) {
                heat = this.heat
            }
            else {
                throw new exception('Heat cannot be 0')
            }
        }

        return Timer.set(duration, type, `Cook on heat ${heat}`)
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

    // public blend(duration, type) {
    //     return [
    //         Timer.set(duration, type, 'Blend', false),
    //     ]
    // }
}

export class Equipment {
    // 99 is just an identifer that doesn't start with 0/1/2
    // By default we assume that equipment is reused throughout the recipe

    public static readonly ninja = (id: number = 99) => (
        new Ninja(id)
    );

    public static readonly saucePan = (id: number = 99) => (
        new SaucePan(id)
    );

    public static readonly pan = (id: number = 99) => (
        new Pan(id)
    );

    public static readonly bowl = (id: number = 99) => (
        new Bowl(id)
    );

    public static readonly coffeecup = (id: number = 99) => (
        new CoffeeCup(id)
    );

    public static readonly blender = (id: number = 99) => (
        new Blender(id)
    )

    public static readonly teapot = (id: number = 99) => (
        new Teapot(id)
    );

    public static readonly pot: IEquipment = (id: number = 99) => ({
        name: 'pot',
        id: id
    });

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
}