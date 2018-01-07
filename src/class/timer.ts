export class Timer {
    public static timerCount: number = 0;
    public static set(duration: number, type: string, extratext: string = '') {

        // Default to seconds
        let multiplier: number = 1000;

        const text = {
            s: 'second',
            m: 'minute'
        };
        let typeText: string = '';

        // Overright multiplier if specified minutes
        if (type === 'm') {
            multiplier = 60000;
        }

        typeText = duration > 1 ? `${text[type]}s` : text[type];
        this.timerCount += 1;

        return {
            type: 'timer',
            seconds: duration * multiplier,
            id: `timer${this.timerCount}`,
            text: `Wait ${duration} ${typeText} ${extratext}`
        };
    }
}
