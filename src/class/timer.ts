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

    public static pressureCook(duration: number, type: string): any {
        return Timer.set(duration, type, 'Pressure cook on high pressure');
    }

    public static souVide(duration: number, type: string, item: any, degrees: number): any {
        return Timer.set(duration, type, `Souvide ${this.sanitize(item)} @ ${degrees}°`);
    }

    public static airFry(duration: number, type: string, item: any, degrees: number): any {
        return Timer.set(duration, type, `Airfry ${this.sanitize(item)} @ ${degrees}°`);
    }

    public static ovenCook(duration: number, type: string, item: any, degrees: number): any {
        return Timer.set(duration, type, `Cook ${this.sanitize(item)} in oven @ ${degrees}°`);
    }

    public static set(duration: number, type: string, extraText: string = '') {

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

        return {
            type: 'timer',
            seconds: duration * multiplier,
            id: `timer${this.timerCount}`,
            text: `Wait ${duration} ${typeText} ${extraText}`
        };
    }
}
