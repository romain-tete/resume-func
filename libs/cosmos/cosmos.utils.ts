import { CosmosClient, Container, SqlQuerySpec, FeedResponse, OperationInput, BulkOperationType, OperationResponse } from '@azure/cosmos';

const DEFAULT_PARTITION = 'experience';
interface Partitioned {
  pk?: string;
}

let client: CosmosClient = null;

function createOrReuseClient(): CosmosClient {
  if (!client) {
    const connection = process.env.CosmosDBConnection;
    client = new CosmosClient(connection);
  }

  return client;
}

export function getContainer(databaseName: string, containerName: string): Container {
  const client = createOrReuseClient();
  const database = client.database(databaseName);
  const container = database.container(containerName);

  return container;
}

function sanitizeCosmosItem(item: any): any {
  const sanitized = {};
  for (let key in item) {
    if (!key.startsWith('_') && key !== 'pk') {
      sanitized[key] = item[key];
    }
  }

  return sanitized;
}

export async function insertOne<T = any>(payload: T & Partitioned, databaseName, containerName: string, sanitizeOutput = true): Promise<T> {
  const container = getContainer(databaseName, containerName);
  return container.items
    .create({ ...payload, pk: DEFAULT_PARTITION })
    .then((response) => response.resource)
    .then((r) => (sanitizeOutput ? sanitizeCosmosItem(r) : r));
}

export async function readOne<T = any>(id: string, databaseName: string, containerName: string, sanitizeOutput = true): Promise<T> {
  const container = getContainer(databaseName, containerName);
  return container
    .item(id, DEFAULT_PARTITION)
    .read<T>()
    .then((response) => response.resource)
    .then((r) => (sanitizeOutput ? sanitizeCosmosItem(r) : r));
}

export async function updateOne<T = any>(
  id: string,
  payload: T & Partitioned,
  databaseName: string,
  containerName: string,
  sanitizeOutput = true
): Promise<T> {
  const container = getContainer(databaseName, containerName);
  payload.pk = DEFAULT_PARTITION;

  return container
    .item(id, DEFAULT_PARTITION)
    .replace(payload)
    .then((response) => response.resource)
    .then((r) => (sanitizeOutput ? sanitizeCosmosItem(r) : r));
}

export async function deleteOne<T = any>(id: string, databaseName: string, containerName: string): Promise<OperationResponse> {
  const container = getContainer(databaseName, containerName);
  return container.item(id, DEFAULT_PARTITION).delete();
}

export async function runQuery<T = any>(
  query: string | SqlQuerySpec,
  databaseName: string,
  containerName: string,
  sanitizeOutput = true
): Promise<T[]> {
  const container = getContainer(databaseName, containerName);
  return container.items
    .query(query, { partitionKey: DEFAULT_PARTITION })
    .fetchAll()
    .then((response: FeedResponse<T>) => response.resources.map((r) => (sanitizeOutput ? sanitizeCosmosItem(r) : r)));
}

export async function deleteFromQuery(
  query: string | SqlQuerySpec,
  databaseName: string,
  containerName: string
): Promise<OperationResponse[]> {
  const container = getContainer(databaseName, containerName);
  return container.items
    .query(query)
    .fetchAll()
    .then((results) => results.resources)
    .then((resources) => {
      const operations: OperationInput[] = resources.map((r) => ({
        operationType: BulkOperationType.Delete,
        id: r.id,
        partitionKey: r.pk,
      }));
      return container.items.bulk(operations);
    });
}
