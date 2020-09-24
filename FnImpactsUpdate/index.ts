import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { readAndValidate, Impact, readOne, updateOne } from '../libs/resume';
import { throwIfNotAuthenticatedUser } from '../libs/authentication';
import { setErrorResponse } from '../libs/exceptions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const payload = readAndValidate(req, 'Impact', context);
    const old = await readOne<Impact>(req.params.id);
    throwIfNotAuthenticatedUser(req, old.ownerId);

    const saved = await updateOne(req.params.id, payload);
    context.bindings.res = {
      body: saved,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
