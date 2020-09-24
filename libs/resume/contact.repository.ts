import { SqlQuerySpec } from '@azure/cosmos';
import { Contact } from './resume.types';
import * as db from '../cosmos';

const DATABASE = 'resume';
const CONTAINER = 'experiences';

export async function readContact(ownerId: string): Promise<Contact | null> {
  const query: SqlQuerySpec = {
    query: `SELECT * FROM Contact c WHERE c.kind = 'Contact' AND c.ownerId = @ownerId AND c.contactName = 'default'`,
    parameters: [{ name: '@ownerId', value: ownerId }],
  };

  return db.runQuery<Contact>(query, DATABASE, CONTAINER, true).then((contacts) => contacts[0] || null);
}

export async function insertContact(payload: Contact): Promise<Contact> {
  return db.insertOne<Contact>(payload, DATABASE, CONTAINER);
}

export async function updateContact(id: string, payload: Contact): Promise<Contact> {
  try {
    const existing = db.readOne(id, DATABASE, CONTAINER, false);
    const updated = { ...existing, ...payload };

    return db.updateOne(id, updated, DATABASE, CONTAINER);
  } catch (e) {
    throw e;
  }
}

export async function deleteContact(id: string): Promise<any> {
  return db.deleteOne(id, DATABASE, CONTAINER);
}
