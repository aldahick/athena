export enum HttpErrorCodes {
  /* eslint-disable @typescript-eslint/no-magic-numbers */
  badRequest = 400,
  unauthorized = 401,
  forbidden = 403,
  notFound = 404,
  conflict = 409,
  internalError = 500,
  notImplemented = 501
  /* eslint-enable @typescript-eslint/no-magic-numbers */
}

export class HttpError extends Error {
  constructor(
    public status: number,
    public error: string | Error
  ) {
    super(typeof error === "string" ? error : undefined);
  }

  static badRequest = (
    message = "Bad request (are you providing the correct parameters?)"
  ): HttpError => new HttpError(HttpErrorCodes.badRequest, message);

  static unauthorized = (
    message = "Unauthorized (are you providing the right credentials?)"
  ): HttpError => new HttpError(HttpErrorCodes.unauthorized, message);

  static forbidden = (
    message = "Forbidden (do you have the right permissions?)"
  ): HttpError => new HttpError(HttpErrorCodes.forbidden, message);

  static notFound = (
    message = "Not found"
  ): HttpError => new HttpError(HttpErrorCodes.notFound, message);

  static conflict = (
    message = "Conflict"
  ): HttpError => new HttpError(HttpErrorCodes.conflict, message);

  static internalError = (
    message = "Internal server error"
  ): HttpError => new HttpError(HttpErrorCodes.internalError, message);

  static notImplemented = (
    message = "Not implemented"
  ): HttpError => new HttpError(HttpErrorCodes.notImplemented, message);
}
