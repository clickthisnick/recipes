import { Timer } from '../class/timer';
import { Serializer as s } from '../class/serializer';

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

function sanitize(item: any): string {
    if (typeof item === 'string') {
        return item;
    } else if (typeof item === 'object') {
        return s.turnIngObjIntoStr(item, true);
    }

    return 'error timer sanitizing';
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

    public stir() {
        this.firstAction = false;
        return ['Stir', this.name]
    }

    public add(ingredients: any): any {
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
            let finalArray: any = [];

            finalArray.push(['Add the following to', bindingWord, this.name])

            ingredients.forEach((ingredient) => {
                finalArray.push(['•', ingredient])
            })

            return finalArray
        }

        return ['Add', ingredients, 'to', bindingWord, this.name]
    }
}

class CookingContainer extends Container {
    name: string;
    id: number;
    firstAction: boolean;

    // Containers are a singleton
    constructor(name: string, id: number) {
        super(name, id)
    }

    public cook(duration: number, type: string, item: any, degrees: number, async: boolean = false) {
        this.firstAction = false;
        console.log(`cook should be overloaded ${duration} ${type} ${item} ${degrees} ${async}`)
    }

    public preheat(heat: number, async: boolean) {
        this.firstAction = false;
        console.log(`Preheat should be overloaded ${heat} ${async}`)
    }
}

class Ninja extends CookingContainer {
    constructor(id: number) {
        super("ninja", id)
    }

    public preheat(heat: number, async: boolean = false) {
        // This is a guess.. should test it out
        if (heat === 500) {
            // Return how long preheating pan takes
            return [Timer.set(8, 'm', 'Preheat ninja to 500°', async)];
        }

        return [Timer.set(5, 'm', 'Preheat pan on heat ???', async)];
    }

    public cook(duration: number, type: string, item: any, degrees: number, async: boolean = false) {
        return [Timer.set(duration, type, `Cook ${sanitize(item)} in ${this.name} @ ${degrees}°`, async)];
    }
}

class SaucePan extends CookingContainer {
    constructor(id: number) {
        super("sauce pan", id)
    }

    public cook(duration: number, type: string, item: any, heat: number, async: boolean = false) {
        return [Timer.set(duration, type, `Cook ${sanitize(item)} in ${this.name} on heat ${heat}`, async)];
    }
}

class Teapot extends CookingContainer {
    constructor(id: number) {
        super("sauce pan", id)
    }

    public cook(duration: number, type: string, item: any, heat: number, async: boolean = false) {
        return [Timer.set(duration, type, `Cook ${sanitize(item)} in ${this.name} on heat ${heat}`, async)];
    }
}


class Pan extends CookingContainer {
    constructor(id: number) {
        super("pan", id)
    }

    public cook(duration: number, type: string, heat: number, item: any = false, async: boolean = false) {
        if (item) {
            return [Timer.set(duration, type, `Cook ${sanitize(item)} in ${this.name} on heat ${heat}`, async)];
        }

        return [Timer.set(duration, type, `Cook on heat ${heat}`, async)];
    }
}

class InstantPot extends CookingContainer {
    constructor(id: number) {
        super("instant pot", id)
    }

    public cook(duration: number, type: string, heat: number, item: any = false, async: boolean = false) {
        if (item) {
            return [Timer.set(duration, type, `Cook ${sanitize(item)} in ${this.name} on heat ${heat}`, async)];
        }

        return [Timer.set(duration, type, `Cook on heat ${heat}`, async)];
    }
}

class CoffeeCup extends Container {
    constructor(id: number) {
        super("coffee cup", id)
    }
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

    public static readonly coffeecup = (id: number = 99) => (
        new CoffeeCup(id)
    );

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
