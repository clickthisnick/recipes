import { Serializer as s } from './serializer';

export interface ITimer {
    type: string;
    milliseconds: number;
    id: string;
    text: string;
    async: boolean;
}

export class Timer {
    public static timerCount: number = 0;
    private static sanitize(item: any): string {
        if (typeof item === 'string') {
            return item;
        } else if (typeof item === 'object') {
            return s.turnIngObjIntoStr(item, true);
        }

        return 'error timer sanitizing';
    }

    public static preheatNinja(heat: number, async: boolean = false): ITimer {
        // This is a guess.. should test it out
        if (heat === 500) {
            // Return how long preheating pan takes
            return Timer.set(8, 'm', 'Preheat ninja to 500°', async);
        }

        return Timer.set(5, 'm', 'Preheat pan on heat ???', async);
    }

    public static preheatPan(heat: number, async: boolean = false): ITimer {
        // This is a guess.. should test it out
        const heatToMin = {
            5:3,
            6:4,
            7:5,
        };

        if (heat in heatToMin) {
            return Timer.set(heatToMin[heat], 'm', `Preheat pan on heat ${heat}`, async);
        }

        return Timer.set(5, 'm', 'Preheat pan on heat ???');
    }

    public static preheatOven(heat: number, async: boolean = false): ITimer {
        const heatToMin = {
            250:8.5,
        };

        if (heat in heatToMin) {
            return Timer.set(heatToMin[heat], 'm', `Preheat pan on heat ${heat}`, async);
        }

        return Timer.set(15, 'm', 'Preheat pan on heat ???');
    }

    public static naturalPressRelease(duration: number, type: string, async: boolean = false): ITimer {
        return Timer.set(duration, type, 'Let instant pot sit without opening steam valve', async);
    }

    public static pressureCook(preheat: number, duration: number, type: string, async: boolean = false): ITimer {
        return Timer.set(preheat + duration, type, `Pressure cook on high pressure for ${duration} minutes, (Preheat takes ${preheat} min)`, async);
    }

    public static souVide(duration: number, type: string, item: any, degrees: number, async: boolean = false): ITimer {
        return Timer.set(duration, type, `Souvide ${this.sanitize(item)} @ ${degrees}°`, async);
    }

    public static airFry(duration: number, type: string, item: any, degrees: number): ITimer {
        return Timer.set(duration, type, `Airfry ${this.sanitize(item)} @ ${degrees}°`);
    }

    public static panSear(duration: number, type: string, item: any, async: boolean = false): ITimer {
        return Timer.set(duration, type, `Pan sear ${this.sanitize(item)}`, async);
    }

    public static instantPotSautee(duration: number, type: string, item: any, async: boolean = false): ITimer {
        return Timer.set(duration, type, `Instant pot sautee ${this.sanitize(item)}`, async);
    }

    public static panSautee(duration: number, type: string, item: any, async: boolean = false): ITimer {
        return Timer.set(duration, type, `Pan sautee ${this.sanitize(item)}`, async);
    }

    public static ovenCook(duration: number, type: string, item: any, degrees: number, async: boolean = false): ITimer {
        return Timer.set(duration, type, `Cook ${this.sanitize(item)} in oven @ ${degrees}°`, async);
    }

    public static ninjaCook(duration: number, type: string, item: any, degrees: number, async: boolean = false): ITimer {
        return Timer.set(duration, type, `Cook ${this.sanitize(item)} in oven @ ${degrees}°`, async);
    }

    public static set(duration: number, type: string, extraText: string = '', async: boolean = false): ITimer {

        // Default to seconds
        let multiplier: number = 1000;

        const text = {
            s: 'second',
            m: 'minute',
            h: 'hour',
        };
        let typeText: string = '';

        // Overwrite multiplier if specified minutes
        if (type === 'm') {
            multiplier = 60000; // Milliseconds in a minute
        }

        if (type === 'h') {
            multiplier = 3600000; // Milliseconds in a hour
        }

        typeText = duration > 1 ? `${text[type]}s` : text[type];
        this.timerCount += 1;

        const stepText = (async) ? `${extraText} (Takes ${duration} ${typeText})` : `${extraText} (Takes ${duration} ${typeText})`

        return {
            type: 'timer',
            milliseconds: duration * multiplier,
            id: `timer${this.timerCount}`,
            text: stepText,
            async: async
        };
    }
}
