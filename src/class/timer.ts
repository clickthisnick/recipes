import { Serializer as s } from './serializer';

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

    public static preheatPan(heat: number): any {
        // This is a guess.. should test it out
        if (heat === 5) {
            // Return how long preheating pan takes
            return Timer.set(3, 'm', 'Preheat pan on heat 5');
        }
    }

    public static pressureCook(duration: number, type: string, async: boolean = false): any {
        return Timer.set(duration, type, 'Pressure cook on high pressure', async);
    }

    public static souVide(duration: number, type: string, item: any, degrees: number, async: boolean = false): any {
        return Timer.set(duration, type, `Souvide ${this.sanitize(item)} @ ${degrees}°`, async);
    }

    public static airFry(duration: number, type: string, item: any, degrees: number): any {
        return Timer.set(duration, type, `Airfry ${this.sanitize(item)} @ ${degrees}°`);
    }

    public static panSear(duration: number, type: string, item: any, async: boolean = false): any {
        return Timer.set(duration, type, `Pan sear ${this.sanitize(item)}`, async);
    }

    public static ovenCook(duration: number, type: string, item: any, degrees: number, async: boolean = false): any {
        return Timer.set(duration, type, `Cook ${this.sanitize(item)} in oven @ ${degrees}°`, async);
    }

    public static set(duration: number, type: string, extraText: string = '', async: boolean = false) {

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

        const timerText = async ? 'Async' : 'Timer';

        return {
            type: 'timer',
            milliseconds: duration * multiplier,
            id: `timer${this.timerCount}`,
            text: `${timerText} ${duration} ${typeText} ${extraText}`
        };
    }
}
