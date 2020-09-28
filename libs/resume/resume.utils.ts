import { Context as FunctionContext } from '@azure/functions';
import { HttpRequest } from '@azure/functions';
import { Validator, ValidationError } from 'jsonschema';
import { Context, Role, Impact } from './resume.types';
import { readAuthenticatedUserId } from '../authentication';
import * as experienceSchema from './resume.schema.json';
import { BadRequestException } from '../exceptions';

type ExperienceDomainObjects = Context | Role | Impact;
type ExperienceDomainObjectKinds = 'Context' | 'Role' | 'Impact';

function validate(item): ValidationError[] {
  const schema = experienceSchema.definitions[item.kind];
  const validator = new Validator();
  validator.addSchema(schema);

  return validator.validate(item, schema).errors;
}

export function readAndValidate(req: HttpRequest, kind: 'Context', context: FunctionContext): Context;
export function readAndValidate(req: HttpRequest, kind: 'Role', context: FunctionContext): Role;
export function readAndValidate(req: HttpRequest, kind: 'Impact', context: FunctionContext): Impact;
export function readAndValidate(req: HttpRequest, kind: ExperienceDomainObjectKinds, context: FunctionContext): ExperienceDomainObjects {
  let body: any;
  const idField = `${kind.toLowerCase()}Id`;
  body = req.body;
  body.kind = kind;
  body[idField] = body.id;
  body.ownerId = readAuthenticatedUserId(req);

  const errors = validate(body);

  if (errors.length === 0) {
    return body;
  } else {
    throw new BadRequestException();
  }
}
