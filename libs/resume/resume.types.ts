export interface Impact {
  id: string;
  contextId: string;
  roleId: string;
  label: string;
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

export interface Contact {
  id: string;
  ownerId: string;
  kind: 'Contact';
  contactName: string;
  fullname: string;
  zipcode: number;
  address: string;
  address2: string;
  city: string;
  email: string;
  phoneNumber: string;
  pictureUrl: string;
}
