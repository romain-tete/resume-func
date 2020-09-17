import { SqlQuerySpec, OperationResponse } from '@azure/cosmos';
import * as db from '../cosmos';

const DEFAULT_DATABASE = 'resume';
const DEFAULT_CONTAINER = 'experiences';

export async function runOneRead<T = any>(id: string): Promise<T> {
  return db.runOneRead<T>(id, DEFAULT_DATABASE, DEFAULT_CONTAINER);
}

export async function runOneInsert<T = any>(payload: T): Promise<T> {
  return db.runOneInsert<T>(payload, DEFAULT_DATABASE, DEFAULT_CONTAINER);
}

export async function runOneUpdate<T = any>(id: string, payload: T): Promise<T> {
  return db.runOneUpdate<T>(id, payload, DEFAULT_DATABASE, DEFAULT_CONTAINER);
}

export async function runOneDelete(id: string): Promise<OperationResponse[]> {
  const resource = await runOneRead<{ id: string; kind: string }>(id);
  const refKey = `${resource.kind.toLowerCase()}Id`;

  return db.runDeleteByQuery(
    {
      query: `SELECT * FROM Resources r WHERE r.id = @id OR r.${refKey} = @id`,
      parameters: [{ name: '@id', value: id }],
    },
    DEFAULT_DATABASE,
    DEFAULT_CONTAINER
  );
}

export async function runQuery<T = any>(query: string | SqlQuerySpec): Promise<T[]> {
  return db.runQuery<T>(query, DEFAULT_DATABASE, DEFAULT_CONTAINER);
}
