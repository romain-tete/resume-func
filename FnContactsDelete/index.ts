import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { setErrorResponse } from '../libs/exceptions';
import { readAuthenticatedUserId } from './../libs/authentication/index';
import { deleteContact, readContact } from '../libs/resume';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const ownerId = readAuthenticatedUserId(req);
  const contact = await readContact(ownerId);

  try {
    if (!contact) {
      context.bindings.res = {
        status: 204,
      };
    } else {
      await deleteContact(contact.id);
      context.bindings.res = {
        status: 204,
      };
    }
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
