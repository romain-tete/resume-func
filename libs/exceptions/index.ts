import { Context } from '@azure/functions';
export interface HttpException extends Error {
  status: number;
}

export class NotFoundException extends Error implements HttpException {
  status: 404;
  constructor() {
    super('Not found.');
  }
}

export class UnauthorizedException extends Error implements HttpException {
  status: 401;
  constructor() {
    super('Unauthorized');
  }
}

export class ForbiddenException extends Error implements HttpException {
  status: 403;
  constructor() {
    super('Forbidden.');
  }
}

export class BadRequestException extends Error implements HttpException {
  status: 400;
  constructor() {
    super('Bad request.');
  }
}

export function setErrorResponse(context: Context, error: any) {
  context.log.error(error);
  // If status is set, the message is safe to return.
  // If not, override with the generic server error text
  context.log(error.status);
  if (error.status) {
    context.bindings.res = {
      status: error.status,
      message: error.message,
    };
  } else {
  }
  context.bindings.res = {
    status: error.status || 500,
    body: 'Something went wrong.',
  };
}
