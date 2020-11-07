import { IStep, istep } from "./step";
import { Time } from "./time";

// function istep() {
//     return {
//         time: number; // In seconds
//         text: string;
//         ingredients: any[]
//         equipment: any[]
//         children: IStep[]
//         disappearWhen: string
//         showTimer: boolean
//     }
// }
export class Timer {
    public static set(duration: number, type: string, text: string = ''): IStep {
        let step = istep()
        step.time = Time.convert(duration, type),
        step.showTimer = true
        step.text = text + `(${Time.convert(duration, type)})`
        step.disappearWhen = 'timesUp'
        return step
    }

    public static end(): IStep {
        let step = istep()
        step.text = ''
        step.disappearWhen = 'timerIsUp'
        return step
    }
}

// import { Serializer as s } from './serializer';

// export interface ITimer {
//     type: string;
//     milliseconds: number;
//     id: string;
//     text: string;
//     async: boolean;
// }

// let timers: TimerInternal[] = []

// export function timer()

// }
//     // 99 is just an identifer that doesn't start with 0/1/2
//     // By default we assume that equipment is reused throughout the recipe

//     public static readonly set = (duration: number, type: string, extraText: string = '', async: boolean = true) => (
//         new TimerInternal().set(duration, type, extraText, async)
//     );

//     public static readonly end = () => {
//         let thisTimer = timers.pop()
//     };
// }

// export class TimerInternal { 
//     constructor() {
//         timers.push(this);
//     }

//     public timerCount: number = 0;
//     private sanitize(item: any): string {
//         if (typeof item === 'string') {
//             return item;
//         } else if (typeof item === 'object') {
//             return s.turnIngObjIntoStr(item, true);
//         }

//         return 'error timer sanitizing';
//     }

//     public preheatNinja(heat: number, async: boolean = false): ITimer {
//         // This is a guess.. should test it out
//         if (heat === 500) {
//             // Return how long preheating pan takes
//             return this.set(8, 'm', 'Preheat ninja to 500°', async);
//         }

//         return this.set(5, 'm', 'Preheat pan on heat ???', async);
//     }

//     public preheatPan(heat: number, async: boolean = true): ITimer {
//         // This is a guess.. should test it out
//         const heatToMin = {
//             5:3,
//             6:4,
//             7:5,
//         };

//         if (heat in heatToMin) {
//             return this.set(heatToMin[heat], 'm', `Preheat pan on heat ${heat}`, async);
//         }

//         return this.set(5, 'm', 'Preheat pan on heat ???');
//     }

//     public preheatOven(heat: number, async: boolean = true): ITimer {
//         const heatToMin = {
//             250:8.5,
//         };

//         if (heat in heatToMin) {
//             return this.set(heatToMin[heat], 'm', `Preheat pan on heat ${heat}`, async);
//         }

//         return this.set(15, 'm', 'Preheat pan on heat ???');
//     }

//     public naturalPressRelease(duration: number, type: string, async: boolean = false): ITimer {
//         return this.set(duration, type, 'Let instant pot sit without opening steam valve', async);
//     }

//     public souVide(duration: number, type: string, item: any, degrees: number, async: boolean = false): ITimer {
//         return this.set(duration, type, `Souvide ${this.sanitize(item)} @ ${degrees}°`, async);
//     }

//     public airFry(duration: number, type: string, item: any, degrees: number): ITimer {
//         return this.set(duration, type, `Airfry ${this.sanitize(item)} @ ${degrees}°`);
//     }

//     public panSear(duration: number, type: string, item: any, async: boolean = false): ITimer {
//         return this.set(duration, type, `Pan sear ${this.sanitize(item)}`, async);
//     }

//     public instantPotSautee(duration: number, type: string, item: any, async: boolean = false): ITimer {
//         return this.set(duration, type, `Instant pot sautee ${this.sanitize(item)}`, async);
//     }

//     public panSautee(duration: number, type: string, item: any, async: boolean = false): ITimer {
//         return this.set(duration, type, `Pan sautee ${this.sanitize(item)}`, async);
//     }

//     public ovenCook(duration: number, type: string, item: any, degrees: number, async: boolean = false): ITimer {
//         return this.set(duration, type, `Cook ${this.sanitize(item)} in oven @ ${degrees}°`, async);
//     }

//     public ninjaCook(duration: number, type: string, item: any, degrees: number, async: boolean = false): ITimer {
//         return this.set(duration, type, `Cook ${this.sanitize(item)} in oven @ ${degrees}°`, async);
//     }

//     public set(duration: number, type: string, extraText: string = '', async: boolean = true): ITimer {

//         // Default to seconds
//         let multiplier: number = 1000;

//         const text = {
//             s: 'second',
//             m: 'minute',
//             h: 'hour',
//         };
//         let typeText: string = '';

//         // Overwrite multiplier if specified minutes
//         if (type === 'm') {
//             multiplier = 60000; // Milliseconds in a minute
//         }

//         if (type === 'h') {
//             multiplier = 3600000; // Milliseconds in a hour
//         }

//         typeText = duration > 1 ? `${text[type]}s` : text[type];
//         this.timerCount += 1;

//         const stepText = (async) ? `${extraText} (Takes ${duration} ${typeText})` : `${extraText} (Takes ${duration} ${typeText})`

//         return {
//             type: 'timer',
//             milliseconds: duration * multiplier,
//             id: `timer${this.timerCount}`,
//             text: stepText,
//             async: async
//         };
//     }
// }
