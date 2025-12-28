export type TimeUnit = 's' | 'm' | 'h';

export class Time {
    private static readonly factors: Record<TimeUnit, number> = {
        s: 1,
        m: 60,
        h: 3600,
    };

    static convert(duration: number, unit: TimeUnit): number {
        return duration * Time.factors[unit];
    }
}
