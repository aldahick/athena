export class HttpError extends Error {
  constructor(
    public status: number,
    public error: string | Error
  ) { super(typeof(error) === "string" ? error : undefined); }

  static alreadyExists = (message = "Resource already exists") => new HttpError(409, message);
  static badRequest = (message = "Bad request (are you providing the correct parameters?)") => new HttpError(400, message);
  static unauthorized = (message = "Unauthorized (are you providing the right credentials?)") => new HttpError(401, message);
  static forbidden = (message = "Forbidden (do you have the right permissions?)") => new HttpError(403, message);
  static notFound = (message = "Not found") => new HttpError(404, message);
  static conflict = (message = "Conflict") => new HttpError(409, message);
  static notImplemented = (message = "Not implemented") => new HttpError(501, message);
  static internalError = (message = "Internal server error") => new HttpError(500, message);
}
