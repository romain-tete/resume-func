import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { setErrorResponse } from '../libs/exceptions';
import { readAndValidate, insertOne } from '../libs/resume';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const newImpact = readAndValidate(req, 'Impact', context);
    const saved = await insertOne(newImpact);

    context.bindings.res = {
      status: 201,
      body: saved,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
