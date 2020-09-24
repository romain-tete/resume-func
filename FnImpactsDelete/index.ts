import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { throwIfNotAuthenticatedUser } from '../libs/authentication';
import { setErrorResponse } from '../libs/exceptions';
import { Impact, readOne, deleteOne } from '../libs/resume';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const oldItem = await readOne<Impact>(req.params.id);
    throwIfNotAuthenticatedUser(req, oldItem.ownerId);

    await deleteOne(req.params.id);

    context.bindings.res = {
      status: 204,
      body: null,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
