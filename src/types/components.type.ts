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

    export interface Images {
        id: string,
        createdAt: string,
        updatedAt: string,
        key: string,
        publicId: string,
        description: string,
        variants: {
            lg: string,
            md: string,
            sm: string
            xl: string
        }
    }

    export interface Status {
        status: string | null,
        reason: string | null
    }

    interface ExperiencePoint {
        id: string,
        createdAt: string,
        updatedAt: string,
        content: string,
        order: number,
    }

    export interface Experience {
        id: string,
        createdAt: string,
        updatedAt: string,
        companyName: string,
        role: string,
        description: string;
        startDate: string,
        endDate: string,
        isCurrent: boolean,
        points: ExperiencePoint[]
    }
} 