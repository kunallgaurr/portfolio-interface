export namespace HttpTypes {
    export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';

    export interface RequestParams {
        url: string,
        method: HttpMethod;
        query?: Record<string, string>;
        body?: Record<string, unknown>;
    }

    export interface GetWeatherParams {
        latitude: string;
        longitude: string;
    }

    export interface GetWeatherResponse {
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

    export interface GetQuoteResponse {
        quote: string,
        author: string
    }

    export interface GetDateInfo {
        date: number,
        month: string,
        year: number,
        day: string,
        totalDays: number,
        remainingDays: number
    }

    export interface GetImagesParams {
        pageNumber?: string;
        pageSize?: string;
    }

    export interface GetImages {
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

    export interface GetStatus {
        status: string,
        reason: string
    }

    interface ExperiencePoint {
        id: string,
        createdAt: string,
        updatedAt: string,
        content: string,
        order: number,
    }

    export interface GetExperience {
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

    export interface GetExperienceDetail {
        id: string,
        createdAt: string,
        updatedAt: string,
        role: string,
        companyName: string,
        description: string,
        startDate: string,
        endDate: string,
        isCurrent: boolean,
        points: ExperiencePoint[]
    }

    export interface SendMessageParams {
        name: string;
        email: string;
        message: string;
    }

    export interface GetFeaturedProject {
        id: string,
        createdAt: string,
        updatedAt: string,
        title: string,
        description: string,
        image: string,
    }

    export interface GetLatestPosts {
        id: string,
        title: string,
        slug: string,
        brief: string,
        publishedAt: string,
        url: string,
        imageUrl: string
    }

    export interface GetPost {
        id: string,
        title: string,
        slug: string,
        brief: string,
        publishedAt: string,
        url: string,
        imageUrl: string,
        content: string
    }

    export interface GetProjects {
        id: number,
        name: string,
        fullName: string,
        private: boolean,
        url: string,
        description: string | null,
        size: number,
        stargazersCount: number,
        watchersCount: number
    }

    export interface GetProject {
        id: number,
        name: string,
        fullName: string,
        private: boolean,
        url: string,
        description: string | null,
        size: number,
        stargazersCount: number,
        watchersCount: number,
        language: string,
        createdAt: string,
        updatedAt: string,
        pushedAt: string,
        readme: string,
        cloneUrl?: string | null,
        sshUrl?: string | null,
        topics?: string[] | null
    }
}