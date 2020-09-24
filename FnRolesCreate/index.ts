import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { readAndValidate, insertOne } from '../libs/experience';
import { setErrorResponse } from '../libs/exceptions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const newRole = readAndValidate(req, 'Role', context);
    const savedNewRole = await insertOne(newRole);

    context.bindings.res = {
      status: 201,
      body: savedNewRole,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
