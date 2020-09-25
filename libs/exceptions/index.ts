import { Context } from '@azure/functions';
export interface HttpException extends Error {
  status: number;
}

export class NotFoundException extends Error implements HttpException {
  public status = 404;
  constructor() {
    super('Not found.');
  }
}

export class UnauthorizedException extends Error implements HttpException {
  status = 401;
  constructor() {
    super('Unauthorized');
  }
}

export class ForbiddenException extends Error implements HttpException {
  status = 403;
  constructor() {
    super('Forbidden.');
  }
}

export class BadRequestException extends Error implements HttpException {
  public status = 400;
  constructor() {
    super('Bad request.');
  }
}

export function setErrorResponse(context: Context, error: any) {
  // If status is set, the message is safe to return.
  // If not, override with the generic server error text
  if (error.status) {
    context.bindings.res = {
      status: error.status,
      message: error.message,
    };
  } else {
    context.bindings.res = {
      status: error.status || 500,
      body: 'Something went wrong.',
    };
  }
}

export function throwNotFoundIfNull(something: any | null) {
  if (something === null || something === undefined) {
    throw new NotFoundException();
  }
}
