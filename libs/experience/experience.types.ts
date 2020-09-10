export interface Impact {
  id: string;
  contextId: string;
  roleId: string;
  description: string;
  ownerId?: string;
  impactId?: string;
  kind?: 'Impact';
}

export interface Role {
  id: string;
  contextId: string;
  label: string;
  start: Date;
  end: Date;
  ownerId?: string;
  roleId?: string;
  kind?: 'Role';
}

export interface Context {
  id: string;
  label: string;
  ownerId?: string;
  contextId?: string;
  kind?: 'Context';
}
