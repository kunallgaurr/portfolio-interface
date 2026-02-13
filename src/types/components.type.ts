export namespace ComponentTypes {
    export interface Coordinates {
        latitude: number | null;
        longitude: number | null;
    }

    export interface Weather {
        location: {
            name: string | null,
            region: string | null,
            country: string | null
        },
        current: {
            temp_c: number | null,
            temp_f: number | null,
            condition: {
                text: string | null
            }
        }
    }

    export interface Proverb {
        quote: string | null,
        author: string | null
    }

    export interface DateInfo {
        date: number | null,
        month: string | null,
        year: number | null,
        day: string | null,
        totalDays: number | null,
        remainingDays: number | null
    }
} 