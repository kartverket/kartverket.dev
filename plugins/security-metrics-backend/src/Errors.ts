import { StatusCodes } from "http-status-codes"
import { Left } from "./Either"

export enum OurOwnErrorMessages {
    UNKNOWN_ERROR = "Vi har fått en ny API-feil som vi ikke har håndtert enda",
}

export type ApiError = {
    statusCode: StatusCodes
    frontendMessage?: OurOwnErrorMessages
    error?: any
}

export function errorHandling(response: Response) {
    switch (response.status) {
        case 400: {
            return Left.create<ApiError>({
                statusCode: StatusCodes.BAD_REQUEST,
            })
        }
        case 401: {
            return Left.create<ApiError>({
                statusCode: StatusCodes.UNAUTHORIZED,
            })
        }
        case 403: {
            return Left.create<ApiError>({
                statusCode: StatusCodes.FORBIDDEN,
            })
        }
        case 404: {
            return Left.create<ApiError>({
                statusCode: StatusCodes.NOT_FOUND,
            })
        }
        case 500: {
            return Left.create<ApiError>({
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
            })
        }
        case 503: {
            return Left.create<ApiError>({
                statusCode: StatusCodes.SERVICE_UNAVAILABLE,
            })
        }
        default: {
            return Left.create<ApiError>({
                statusCode: response.status,
                frontendMessage: OurOwnErrorMessages.UNKNOWN_ERROR,
            })
        }
    }
}
