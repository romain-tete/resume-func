import { SqlQuerySpec } from '@azure/cosmos';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { readAuthenticatedUserId } from '../libs/authentication';
import { setErrorResponse } from '../libs/exceptions';
import { runQuery, Impact } from '../libs/resume';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const ownerId = readAuthenticatedUserId(req);
    const query: SqlQuerySpec = {
      query: 'SELECT * FROM Impacts i WHERE i.ownerId = @ownerId AND i.kind = @kind',
      parameters: [
        { name: '@ownerId', value: ownerId },
        { name: '@kind', value: 'Impact' },
      ],
    };

    const impacts = await runQuery<Impact>(query);

    context.bindings.res = {
      body: impacts,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
