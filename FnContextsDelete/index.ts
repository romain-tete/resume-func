import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { throwIfNotAuthenticatedUser } from './../libs/authentication';
import { Context as ExperienceContext, runOneRead, runOneDelete } from './../libs/experience';
import { setErrorResponse } from '../libs/exceptions';
import { runQuery } from '../libs/experience';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const oldItem = await runOneRead<ExperienceContext>(req.params.id);
    throwIfNotAuthenticatedUser(req, oldItem.ownerId);

    await runOneDelete(req.params.id);

    context.bindings.res = {
      status: 204,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
