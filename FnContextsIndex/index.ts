import { SqlQuerySpec } from '@azure/cosmos';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { Context as ExperienceContext, runQuery } from '../libs/experience';
import { readAuthenticatedUserId } from './../libs/authentication';
import { setErrorResponse } from '../libs/exceptions';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const ownerId = readAuthenticatedUserId(req);
    const query: SqlQuerySpec = {
      query: 'SELECT * FROM Contexts c WHERE c.ownerId = @ownerId AND c.kind = @kind',
      parameters: [
        { name: '@ownerId', value: ownerId },
        { name: '@kind', value: 'Context' },
      ],
    };

    const contexts = await runQuery<ExperienceContext>(query);

    context.bindings.res = {
      status: 200,
      body: contexts,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
