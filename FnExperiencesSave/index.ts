import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async (
  context: Context,
  req: HttpRequest
): Promise<void> => {
  const experience = context.bindings.experience;

  if (!experience) {
    context.res = {
      status: 400,
      body: 'Wrong request',
    };
  } else {
    const changed = {
      ...experience,
      roles: [
        ...(experience.roles || []),
        { name: 'This is an edited role (' + context.invocationId + ')' },
      ],
    };

    context.bindings.saveExperienceBinding = changed;
    context.bindings.res = {
      status: 200,
      body: changed,
    };

    context.done();
  }
};

export default httpTrigger;
