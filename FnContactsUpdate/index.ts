import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { stat } from 'fs';
import { validate } from 'jsonschema';
import { readAuthenticatedUserId } from '../libs/authentication';
import { BadRequestException, setErrorResponse, throwNotFoundIfNull } from '../libs/exceptions';
import { readContact, updateContact, insertContact, Contact } from '../libs/resume';
import * as resumeSchema from '../libs/resume/resume.schema.json';

const httpTrigger: AzureFunction = async function (context: Context, req: HttpRequest): Promise<void> {
  const ownerId = readAuthenticatedUserId(req);
  const contact = req.body;
  const contactName = req.params.contactName;

  const staticFields: Partial<Contact> = {
    contactName: 'default',
    kind: 'Contact',
    ownerId,
  };

  if (contactName !== 'default') {
    context.log.error(`Only contacts with contactName = 'default' are supported for now`);
    throw new BadRequestException();
  }

  try {
    if (validateContact(contact, context)) {
      const existing = await readContact(ownerId);

      let body: Contact;
      if (existing === null) {
        body = await insertContact({ ...contact, ...staticFields });
      } else {
        const merged: Contact = { ...contact, ...staticFields };
        body = await updateContact(merged.id, merged);
      }

      context.bindings.res = {
        status: 200,
        body,
      };
    } else {
      throw new BadRequestException();
    }
  } catch (e) {
    setErrorResponse(context, e);
  }
};

function validateContact(contact: any, context: Context): contact is Contact {
  const contactSchema = resumeSchema.definitions.Contact;
  const validationResult = validate(contact, contactSchema);

  if (validationResult.errors.length > 0) {
    context.log.error(validationResult.errors);
    return false;
  } else {
    return true;
  }
}

export default httpTrigger;
