export class Time {
    public static convert(duration: number, type: string): number {
        if (type === 's') {
            return duration
        }

        if (type === 'm') {
            return duration * 60
        }

        return duration
    }
}