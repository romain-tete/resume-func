import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { readAndValidate, Context as ExperienceContext, updateOne, readOne } from '../libs/resume';
import { setErrorResponse, NotFoundException } from '../libs/exceptions';
import { throwIfNotAuthenticatedUser } from '../libs/authentication';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const payload = readAndValidate(req, 'Context', context);
    const oldItem = await readOne<ExperienceContext>(req.params.id);

    if (!oldItem) {
      throw new NotFoundException();
    }

    throwIfNotAuthenticatedUser(req, oldItem.ownerId);

    const updated = await updateOne<ExperienceContext>(req.params.id, payload);

    context.bindings.res = {
      body: updated,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
