import { SqlQuerySpec } from '@azure/cosmos';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { readAuthenticatedUserId } from './../libs/authentication';
import { setErrorResponse } from '../libs/exceptions';
import { Role, runQuery } from '../libs/resume';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  try {
    const ownerId = readAuthenticatedUserId(req);
    const query: SqlQuerySpec = {
      query: 'SELECT * FROM Roles r WHERE r.ownerId = @ownerId AND r.kind = @kind',
      parameters: [
        { name: '@ownerId', value: ownerId },
        { name: '@kind', value: 'Role' },
      ],
    };

    const roles = await runQuery<Role>(query);

    context.bindings.res = {
      status: 200,
      body: roles,
    };
  } catch (e) {
    setErrorResponse(context, e);
  }
};

export default httpTrigger;
