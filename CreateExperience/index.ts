import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { v4 as uuid } from 'uuid';

const httpTrigger: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<void> => {
  const experience = {
    id: uuid(),
    name: 'Hello, World!',
    pk: 'test',
  };

  context.bindings.newExperienceBinding = experience;
  context.res = {
    status: 201 /* Defaults to 200 */,
    body: experience,
  };
};

export default httpTrigger;
