import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const httpTrigger: AzureFunction = async (context: Context, req: HttpRequest): Promise<void> => {
  try {
    const experience = JSON.parse(req.body);
    context.bindings.newExperienceBinding = experience;

    context.res = {
      status: 201 /* Defaults to 200 */,
      body: experience,
    };
  } catch (e) {
    const message = typeof e === 'string' ? e : e.message;
    context.log.error(message);

    context.bindings.res = {
      status: 400,
      body: 'Bad request',
    };
  }
};

export default httpTrigger;
