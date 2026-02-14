import { HttpTypes } from "./http.types";
import { GlobalTypes } from "@/types/global.type";

class HttpAdapter {
    private readonly baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

    private async call(params: HttpTypes.RequestParams) {
        const {url, method, body, query} = params;
        const endpoint = new URL(this.baseUrl + url);

        if(query && Object.keys(query).length) {
            for(const [key, value] of Object.entries(query)) {
                endpoint.searchParams.append(key, value)
            }
        }

        const headers = new Headers();

        let response;
        try {
            response = await fetch(endpoint, {
                headers,
                method,
                body: body ? JSON.stringify(body) : null
            });
        } catch (error) {
            throw error;
        }

        let json;
        try {
            json = await response.json();
            return json;
        } catch (error) {
            throw error;
        }
    }

    async getWeather (payload: HttpTypes.GetWeatherParams): Promise<GlobalTypes.BaseApiResponse<HttpTypes.GetWeatherResponse>> {
        const params: HttpTypes.RequestParams = {
            url: '/weather',
            method: 'GET',
            query: {...payload}
        }

        try {
            return await this.call(params);
        } catch (error) {
            throw error;
        }
    }

    async getProverb (): Promise<GlobalTypes.BaseApiResponse<HttpTypes.GetQuoteResponse>> {
        const params: HttpTypes.RequestParams = {
            url: '/quote',
            method: 'GET'
        }

        try {
            return await this.call(params);
        } catch (error) {
            throw error;
        }
    }

    async getDateInfo (): Promise<GlobalTypes.BaseApiResponse<HttpTypes.GetDateInfo>> {
        const params: HttpTypes.RequestParams = {
            url: '/date',
            method: 'GET'
        }

        try {
            return await this.call(params);
        } catch (error) {
            throw error;
        }
    }

    async getImages (payload: HttpTypes.GetImagesParams): Promise<GlobalTypes.BaseApiResponse<HttpTypes.GetImages[]>> {
        const params: HttpTypes.RequestParams = {
            url: '/photos',
            method: 'GET',
            query: {...payload}
        }

        try {
            return await this.call(params);
        } catch (error) {
            throw error;
        }
    }

    async getStatus (): Promise<GlobalTypes.BaseApiResponse<HttpTypes.GetStatus>> {
        const params: HttpTypes.RequestParams = {
            url: '/status',
            method: 'GET',
        }

        try {
            return await this.call(params);
        } catch (error) {
            throw error;
        }
    }
}

export default new HttpAdapter();