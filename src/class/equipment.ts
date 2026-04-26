import { Time, TimeUnit } from './time';
import { Timer } from './timer';
import { Serializer as s } from './serializer';
import { IStep, istep } from './step';
import { Ingredient } from './ingredients/ingredient';

export interface IAllEquipment {
    [name: string]: number;
}

export interface IEquipmentObj {
    name: string;
    id: number;
}

export interface IContainersObj {
    [name: string]: string;
}

export interface IEquipment {
    // Id is the identifier of the equipment.
    // If you need/reuse equipment, pass the same id.
    (id?: number): IEquipmentObj;
}

function classNameToDisplayName(value: string): string {
    return value
        .replace(/([a-z])([A-Z])/g, '$1 $2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
        .toLowerCase();
}

const containers: Record<string, Container> = {};

abstract class Container {
    public readonly key!: string;
    public readonly name!: string;
    public readonly id!: number;
    protected firstAction!: boolean;

    // Containers are singletons by class/name + id.
    protected constructor(id: number, name?: string) {
        const key = this.constructor.name;
        const displayName = name ?? classNameToDisplayName(key);
        const objectKey = `${key}:${displayName}:${id}`;

        if (Object.prototype.hasOwnProperty.call(containers, objectKey)) {
            return containers[objectKey] as this;
        }

        this.key = key;
        this.name = displayName;
        this.id = id;
        this.firstAction = true;
        containers[objectKey] = this;
    }

    public done(): IStep {
        this.firstAction = false;
        const doneStep = istep();
        doneStep.equipment.push(this.name);
        doneStep.text = '';
        return doneStep;
    }

    public stir(): IStep {
        this.firstAction = false;
        const stirStep = istep();
        stirStep.equipment.push(this.name);
        stirStep.text = `Stir ${this.name}`;
        return stirStep;
    }

    public mix(): IStep {
        this.firstAction = false;
        const mixStep = istep();
        mixStep.equipment.push(this.name);
        mixStep.text = `Mix ${this.name}`;
        return mixStep;
    }

    public microwave(duration: number, unit: TimeUnit, disappearWhen = 'timerIsUp'): IStep {
        const humanUnit = unit === 's' ? 'seconds' : 'minutes';
        return Timer.set(duration, unit, `Microwave ${this.name} for ${duration} ${humanUnit}`, [], disappearWhen);
    }

    public add(ingredients: Ingredient[]): IStep {
        const addIStep = istep();

        const hydrateIStep = (parentStep: IStep, addIngredient: IStep, ingredient: Ingredient): void => {
            addIngredient.ingredients.push(ingredient);
            addIngredient.text = [s.lazyIngredientIdx, addIngredient.ingredients.length - 1].join(' ');
            addIngredient.time += ingredient.takeOutTime;
            parentStep.children.push(addIngredient);

            // If the unit is equipment like a cup, it could be added here.
            // if (ingredient.unit && ingredient.unit.isEquipment) {
            //     const equipmentName = ingredient.unit.equipmentUnits.includes(ingredient.unit.quantity)
            //         ? `${ingredient.unit.quantity} ${ingredient.unit.properName}`
            //         : ingredient.unit.properName;
            //     addIngredient.equipment.push(equipmentName);
            // }
        };

        let bindingWord = 'the';
        if (this.firstAction) {
            bindingWord = /^[aeiou]/i.test(this.name) ? 'an' : 'a';
            this.firstAction = false;
        }

        addIStep.text = ['Add the following to', bindingWord, this.name].join(' ');
        addIStep.disappearWhen = 'childrenGone';

        ingredients.forEach((ingredient) => {
            const addIngredient = istep();
            hydrateIStep(addIStep, addIngredient, ingredient);
        });

        return addIStep;
    }
}

class StandMixer extends Container {
    constructor(id = 99) {
        super(id);
    }
}

class BulletMixer extends Container {
    constructor(id = 99) {
        super(id);
    }
}

class Plate extends Container {
    constructor(id = 99) {
        super(id);
    }
}

class Mug extends Container {
    constructor(id = 99) {
        super(id);
    }
}

class Bowl extends Container {
    constructor(id = 99) {
        super(id);
    }

    public whisk(disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(1, 'm', 'Whisk contents of the bowl', [], disappearWhen);
    }
}

class LargeBowl extends Bowl {
    constructor(id = 99) {
        super(id);
    }
}

class ZiplockBag extends Container {
    constructor(id: number) {
        super(id, 'ziplock bag');
    }
}

class SmallStainlessSteelContainer extends Container {
    constructor(id: number) {
        super(id, '17.6 ounce stainless steel container');
    }
}

class LargeStainlessSteelContainer extends Container {
    constructor(id: number) {
        super(id, '34 ounce stainless steel container');
    }
}

class KitchenAidMixingBowl extends Container {
    constructor(id: number) {
        super(id, 'KitchenAid mixing bowl');
    }

    public mixWithDoughHook(speed: number, minutes: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(minutes, 'm', `Mix with dough hook on speed ${speed} for ${minutes} minutes`, [], disappearWhen);
    }

    public mixWithFlatBeater(speed: number, minutes: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(minutes, 'm', `Mix with flat beater attachment on speed ${speed} for ${minutes} minutes`, [], disappearWhen);
    }

    public mixWithWhisk(speed: number, minutes: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(minutes, 'm', `Mix with whisk attachment on speed ${speed} for ${minutes} minutes`, [], disappearWhen);
    }
}

abstract class CookingContainer extends Container {
    protected constructor(id: number, name?: string) {
        super(id, name);
    }

    public cook(_duration: number, _type: TimeUnit, _degrees: number, _disappearWhen = 'timerIsUp'): IStep {
        throw new Error(`${this.constructor.name}.cook() must be implemented by subclass`);
    }

    public preheat(_heat: number, _disappearWhen = 'timerIsUp'): IStep {
        throw new Error(`${this.constructor.name}.preheat() must be implemented by subclass`);
    }
}

class ToasterOven extends CookingContainer {
    constructor(id = 99) {
        super(id);
    }

    public preheat(heat: number, disappearWhen = 'timerIsUp'): IStep {
        const preheatTimes: Record<number, number> = {
            350: 10,
            425: 15,
            500: 16,
        };
        const seconds = preheatTimes[heat] ?? 5;
        const heatText = preheatTimes[heat] ? `to ${heat}°` : `on heat ${heat}`;
        return Timer.set(seconds, 's', `Preheat ${this.name} ${heatText}`, [], disappearWhen);
    }

    public cook(duration: number, type: TimeUnit, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Cook ${this.name} @ ${degrees}°`, [], disappearWhen);
    }

    public roast(duration: number, type: TimeUnit, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Roast ${this.name} @ ${degrees}°`, [], disappearWhen);
    }

    public broil(duration: number, type: TimeUnit, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Broil ${this.name} @ ${degrees}°`, [], disappearWhen);
    }
}

class Oven extends CookingContainer {
    constructor(id = 99) {
        super(id);
    }

    public preheat(heat: number, disappearWhen = 'timerIsUp'): IStep {
        const preheatTimes: Record<number, number> = {
            350: 5,
            425: 15,
            500: 16,
        };
        const minutes = preheatTimes[heat] ?? 5;
        const heatText = preheatTimes[heat] ? `to ${heat}°` : `on heat ${heat}`;
        return Timer.set(minutes, 'm', `Preheat ${this.name} ${heatText}`, [], disappearWhen);
    }

    public cook(duration: number, type: TimeUnit, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Cook ${this.name} @ ${degrees}°`, [], disappearWhen);
    }

    public roast(duration: number, type: TimeUnit, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Roast ${this.name} @ ${degrees}°`, [], disappearWhen);
    }
}

class Ninja extends CookingContainer {
    constructor(id = 99) {
        super(id);
    }

    public preheat(heat: number, disappearWhen = 'timerIsUp'): IStep {
        if (heat === 500) {
            return Timer.set(8, 'm', `Preheat ${this.name} to 500°`, [], disappearWhen);
        }

        return Timer.set(5, 'm', `Preheat ${this.name} on heat ${heat}`, [], disappearWhen);
    }

    public preheatAirFry(minutes: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(5, 'm', `Turn ${this.name} air fry setting to ${minutes} minutes`, [], disappearWhen);
    }

    public cook(duration: number, type: TimeUnit, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Cook ${this.name} @ ${degrees}°`, [], disappearWhen);
    }

    public airFry(duration: number, type: TimeUnit, degrees: number, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, `Air fry ${this.name} @ ${degrees}°`, [], disappearWhen);
    }
}

class Grinder extends CookingContainer {
  constructor(id = 99) {
    super(id);
  }
}

class Glass extends CookingContainer {
  constructor(id = 99) {
    super(id);
  }
}

class SaucePan extends CookingContainer {
  constructor(id = 99) {
    super(id);
  }
}

class BakingSheet extends CookingContainer {
  constructor(id = 99) {
    super(id);
  }
}

class Pot extends CookingContainer {
    constructor(id = 99) {
        super(id);
    }

    private heat?: number;

    public setHeat(heat: number): void {
        if (heat <= 0) {
            throw new Error('Heat must be greater than 0');
        }
        this.heat = heat;
    }

    private getHeat(heat: number): number {
        if (heat < 1) {
            if (this.heat) {
                return this.heat;
            }
            throw new Error('Heat cannot be 0');
        }
        return heat;
    }

    private cookStr(text: string, duration: number, type: TimeUnit, heat: number, disappearWhen = 'timerIsUp'): IStep {
        this.getHeat(heat);
        return Timer.set(duration, type, text, [this.name], disappearWhen);
    }

    public cook(duration: number, type: TimeUnit, heat: number, disappearWhen = 'timerIsUp'): IStep {
        const resolvedHeat = this.getHeat(heat);
        return this.cookStr(`Cook ${this.name} on heat ${resolvedHeat}`, duration, type, resolvedHeat, disappearWhen);
    }

    public cookWithoutLid(duration: number, type: TimeUnit, heat: number, disappearWhen = 'timerIsUp'): IStep {
        const resolvedHeat = this.getHeat(heat);
        return this.cookStr(`Cook ${this.name} without lid on heat ${resolvedHeat}`, duration, type, resolvedHeat, disappearWhen);
    }

    public cookWithLid(duration: number, type: TimeUnit, heat: number, text = '', disappearWhen = 'timerIsUp'): IStep {
        const resolvedHeat = this.getHeat(heat);
        const prefix = text ? `${text} ` : '';
        return this.cookStr(`Cook ${prefix}${this.name} with lid on heat ${resolvedHeat}`, duration, type, resolvedHeat, disappearWhen);
    }

    public cookWithLidSlightlyOff(duration: number, type: TimeUnit, heat: number, text = '', disappearWhen = 'timerIsUp'): IStep {
        const resolvedHeat = this.getHeat(heat);
        const prefix = text ? `${text} ` : '';
        return this.cookStr(`Cook ${prefix}${this.name} with lid slightly off on heat ${resolvedHeat}`, duration, type, resolvedHeat, disappearWhen);
    }

    public boilWithLid(duration: number, type: TimeUnit, heat: number, disappearWhen = 'timerIsUp'): IStep {
        const resolvedHeat = this.getHeat(heat);
        return this.cookStr(`Boil ${this.name} contents on heat ${resolvedHeat} with lid on`, duration, type, resolvedHeat, disappearWhen);
    }
}

class Strainer extends CookingContainer {
    constructor(id = 99) {
        super(id);
    }

    public wash(text: string, duration: number, type: TimeUnit, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, text, [this.name], disappearWhen);
    }
}

class Teapot extends CookingContainer {
    constructor(id = 99) {
        super(id);
    }
}

class FoodProcessor extends CookingContainer {
    constructor(id = 99) {
        super(id);
    }
}

class Pan extends CookingContainer {
    constructor(id = 99) {
        super(id);
    }

    private heat?: number;

    public preheat(heat: number, disappearWhen = 'timerIsUp'): IStep {
        this.heat = heat;

        if (heat === 5) {
            return Timer.set(2, 'm', `Preheat ${this.name} on heat ${heat}`, [this.name], disappearWhen);
        }

        if (heat === 7) {
            return Timer.set(4, 'm', `Preheat ${this.name} on heat ${heat}`, [this.name], disappearWhen);
        }

        return Timer.set(5, 'm', `Preheat ${this.name} on heat ${heat}`, [this.name], disappearWhen);
    }

    private getHeat(heat = 0): number {
        if (heat === 0) {
            if (this.heat) {
                return this.heat;
            }
            throw new Error('Heat cannot be 0');
        }
        return heat;
    }

    private cookStr(text: string, duration: number, type: TimeUnit, heat = 0, disappearWhen = 'timerIsUp'): IStep {
        this.getHeat(heat);
        return Timer.set(duration, type, text, [this.name], disappearWhen);
    }

    public cook(duration: number, type: TimeUnit, heat = 0, disappearWhen = 'timerIsUp'): IStep {
        const resolvedHeat = this.getHeat(heat);
        return this.cookStr(`Cook ${this.name} on heat ${resolvedHeat}`, duration, type, resolvedHeat, disappearWhen);
    }

    public cookWithLidSlightlyOff(duration: number, type: TimeUnit, heat = 0, disappearWhen = 'timerIsUp'): IStep {
        const resolvedHeat = this.getHeat(heat);
        return this.cookStr(`Cook ${this.name} on heat ${resolvedHeat} with lid slightly off`, duration, type, resolvedHeat, disappearWhen);
    }

    public cookWithLid(duration: number, type: TimeUnit, heat = 0, text = '', disappearWhen = 'timerIsUp'): IStep {
        const prefix = text ? `${text} ` : '';
        const resolvedHeat = this.getHeat(heat);
        return this.cookStr(`Cook ${prefix}${this.name} on heat ${resolvedHeat} with lid`, duration, type, resolvedHeat, disappearWhen);
    }
}

class InstantPot extends CookingContainer {
    constructor(id = 99) {
        super(id);
    }

    public pressureCook(preheat: number, duration: number, type: TimeUnit, disappearWhen = 'timerIsUp'): IStep {
        const preheatStep = istep();
        preheatStep.time += Time.convert(preheat, type);
        preheatStep.text = `Put ${this.name} on high pressure for ${duration} minutes`;
        preheatStep.equipment.push(this.name);
        preheatStep.disappearWhen = disappearWhen;

        const ensureSeal = istep();
        ensureSeal.text = `Ensure ${this.name} has sealed`;
        ensureSeal.equipment.push(this.name);
        ensureSeal.disappearWhen = 'clicked';

        const pressureCookStep = istep();
        pressureCookStep.time += Time.convert(duration, type);
        pressureCookStep.equipment.push(this.name);
        pressureCookStep.text = `Wait for ${this.name} to be done cooking`;
        pressureCookStep.disappearWhen = disappearWhen;

        preheatStep.children.push(ensureSeal);
        preheatStep.children.push(pressureCookStep);

        return preheatStep;
    }

    public saute(duration: number, type: TimeUnit, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, 'Saute on high', [], disappearWhen);
    }

    // Backward-compatible misspelling.
    public sautee(duration: number, type: TimeUnit, disappearWhen = 'timerIsUp'): IStep {
        return this.saute(duration, type, disappearWhen);
    }

    public pressureRelease(duration: number, type: TimeUnit, disappearWhen = 'timerIsUp'): IStep {
        return Timer.set(duration, type, 'Let pressure release', [], disappearWhen);
    }
}

class CoffeeCup extends Container {
    constructor(id = 99) {
        super(id);
    }
}

export class Equipment {
    // 99 is just an identifier that does not start with 0/1/2.
    // By default, equipment is reused throughout the recipe.

    public static readonly knife = () => 'knife';

    public static readonly cuttingBoard = () => 'cutting board';

    public static readonly peeler = () => 'peeler';

    public static readonly ninja = (id = 99) => new Ninja(id);

    public static readonly grinder = (id = 99) => new Grinder(id);

    public static readonly glass = (id = 99) => new Glass(id);

    public static readonly saucePan = (id = 99) => new SaucePan(id);

    public static readonly pan = (id = 99) => new Pan(id);

    public static readonly smallStainlessSteelContainer = (id = 99) => new SmallStainlessSteelContainer(id);

    public static readonly largeStainlessSteelContainer = (id = 99) => new LargeStainlessSteelContainer(id);

    public static readonly foodProcessor = (id = 99) => new FoodProcessor(id);

    public static readonly plate = (id = 99) => new Plate(id);

    public static readonly oven = (id = 99) => new Oven(id);

    public static readonly toasterOven = (id = 99) => new ToasterOven(id);

    public static readonly kitchenAidMixingBowl = (id = 99) => new KitchenAidMixingBowl(id);

    public static readonly ziplockBag = (id = 99) => new ZiplockBag(id);

    public static readonly bowl = (id = 99) => new Bowl(id);

    public static readonly mug = (id = 99) => new Mug(id);

    public static readonly largeBowl = (id = 99) => new LargeBowl(id);

    public static readonly standMixer = (id = 99) => new StandMixer(id);

    public static readonly bulletMixer = (id = 99) => new BulletMixer(id);

    public static readonly coffeeCup = (id = 99) => new CoffeeCup(id);

    // Backward-compatible old name.
    public static readonly coffeecup = Equipment.coffeeCup;

    public static readonly bakingSheet = (id = 99) => new BakingSheet(id);

    public static readonly teapot = (id = 99) => new Teapot(id);

    public static readonly pot = (id = 99) => new Pot(id);

    public static readonly strainer = (id = 99) => new Strainer(id);

    public static readonly instantPot = (id = 99) => new InstantPot(id);

    public static readonly sousVide: IEquipment = (id = 99) => ({
        name: 'sous vide',
        id,
    });

    // Backward-compatible old spelling.
    public static readonly souvide = Equipment.sousVide;

    public static readonly woodenSpoon: IEquipment = (id = 99) => ({
        name: 'wooden spoon',
        id,
    });

    public static readonly spoon: IEquipment = (id = 99) => ({
        name: 'spoon',
        id,
    });
}
