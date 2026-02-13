import React from "react";

export namespace GlobalTypes {
    export interface BaseLayout {
        children: React.ReactNode
    }

    export interface BaseApiResponse<T> {
        status: {
            code: number,
            message: string,
            timestamp: string
        },
        data: T
    }
}