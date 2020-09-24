import { setErrorResponse } from '../libs/exceptions';
import { readAuthenticatedUserId } from './../libs/authentication/index';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { readContact } from '../libs/resume';
import { throwNotFoundIfNull } from '../libs/exceptions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const ownerId = readAuthenticatedUserId(req);
    const contact = await readContact(ownerId);
    throwNotFoundIfNull(contact);

    context.bindings.res = {
      status: 200,
      body: contact,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
