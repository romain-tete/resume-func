import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { setErrorResponse } from '../libs/exceptions';
import { readAndValidate, runOneInsert } from '../libs/experience';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const newImpact = readAndValidate(req, 'Impact', context);
    const saved = await runOneInsert(newImpact);

    context.bindings.res = {
      status: 201,
      body: saved,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
