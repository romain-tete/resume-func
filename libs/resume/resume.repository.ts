import { SqlQuerySpec, OperationResponse } from '@azure/cosmos';
import * as db from '../cosmos';

const DEFAULT_DATABASE = 'resume';
const DEFAULT_CONTAINER = 'experiences';

export async function readOne<T = any>(id: string): Promise<T> {
  return db.readOne<T>(id, DEFAULT_DATABASE, DEFAULT_CONTAINER);
}

export async function insertOne<T = any>(payload: T): Promise<T> {
  return db.insertOne<T>(payload, DEFAULT_DATABASE, DEFAULT_CONTAINER);
}

export async function updateOne<T = any>(id: string, payload: T): Promise<T> {
  return db.updateOne<T>(id, payload, DEFAULT_DATABASE, DEFAULT_CONTAINER);
}

export async function deleteOne(id: string): Promise<OperationResponse[]> {
  const resource = await readOne<{ id: string; kind: string }>(id);
  const refKey = `${resource.kind.toLowerCase()}Id`;

  return db.deleteFromQuery(
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
