import { HttpRequest } from '@azure/functions';
import { ForbiddenException } from '../exceptions';

export const readAuthenticatedUserId = (req: HttpRequest): string => {
  try {
    const token = req.headers['authorization'];
    const tokenParts = token.split('.');
    const buffer = Buffer.from(tokenParts[1], 'base64');
    const decodedPayload = buffer.toString('utf8');
    const jwtData = JSON.parse(decodedPayload);
    return jwtData.sub as string;
  } catch (e) {
    const unauthenticated: Error & { status?: number } = new Error('Unauthorized.');
    unauthenticated.status = 401;
  }
};

export function throwIfNotAuthenticatedUser(req: HttpRequest, id: string) {
  const authenticated = readAuthenticatedUserId(req);
  if (authenticated !== id) {
    throw new ForbiddenException();
  }
}
