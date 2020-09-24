import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { throwIfNotAuthenticatedUser } from './../libs/authentication';
import { Context as ExperienceContext, readOne, deleteOne } from './../libs/experience';
import { setErrorResponse } from '../libs/exceptions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const oldItem = await readOne<ExperienceContext>(req.params.id);
    throwIfNotAuthenticatedUser(req, oldItem.ownerId);

    await deleteOne(req.params.id);

    context.bindings.res = {
      status: 204,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
