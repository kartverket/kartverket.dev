import { StatusCodes } from 'http-status-codes';
import { ApiError } from './types';

export enum OurOwnErrorMessages {
  UNKNOWN_ERROR = 'Ukjent HTTP feil',
}

export function errorHandling(response: Response): ApiError {
  switch (response.status) {
    case 400:
      return { statusCode: StatusCodes.BAD_REQUEST };

    case 401:
      return {
        statusCode: StatusCodes.UNAUTHORIZED,
      };

    case 403:
      return {
        statusCode: StatusCodes.FORBIDDEN,
      };

    case 404:
      return {
        statusCode: StatusCodes.NOT_FOUND,
      };

    case 500: {
      return {
        statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      };
    }
    case 503:
      return {
        statusCode: StatusCodes.SERVICE_UNAVAILABLE,
      };
    default:
      return {
        statusCode: response.status,
        message: OurOwnErrorMessages.UNKNOWN_ERROR,
      };
  }
}
