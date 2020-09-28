import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { readAndValidate, Role, readOne, updateOne } from '../libs/resume';
import { setErrorResponse, ForbiddenException, NotFoundException } from '../libs/exceptions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const payload = readAndValidate(req, 'Role', context);
    const oldItem = await readOne<Role>(req.params.id);
    if (!oldItem) {
      throw new NotFoundException();
    }

    if (oldItem.ownerId !== payload.ownerId) {
      throw new ForbiddenException();
    }

    const saved = await updateOne(req.params.id, payload);

    context.bindings.res = {
      body: saved,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
