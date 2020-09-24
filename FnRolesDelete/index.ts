import { NotFoundException, ForbiddenException, setErrorResponse } from './../libs/exceptions';
import { readAuthenticatedUserId } from './../libs/authentication';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Impact, readOne, deleteOne } from '../libs/experience';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const ownerId = readAuthenticatedUserId(req);
    const oldRole = await readOne<Impact>(req.params.id);

    if (!oldRole) {
      throw new NotFoundException();
    }

    if (oldRole.ownerId !== ownerId) {
      context.log.warn('There was an unauthorized attempt to delete a resource.');
      throw new ForbiddenException();
    } else {
      await deleteOne(req.params.id);
      context.bindings.res = {
        status: 204,
      };
    }
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
