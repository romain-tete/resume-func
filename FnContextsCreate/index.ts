import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { readAndValidate, runOneInsert } from '../libs/experience';
import { setErrorResponse } from '../libs/exceptions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    let newContext = readAndValidate(req, 'Context', context);
    newContext = await runOneInsert(newContext);

    context.bindings.res = {
      body: newContext,
      status: 201,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
