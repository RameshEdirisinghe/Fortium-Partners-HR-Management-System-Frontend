export enum DepartmentType {
  HR = 'HR',
  IT = 'IT',
  FINANCE = 'FINANCE',
  MARKETING = 'MARKETING',
  OPERATIONS = 'OPERATIONS'
}

export interface Employee {
  id?: number;
  name: string;
  email: string;
  department: DepartmentType;
  createdAt?: Date;
  updateAt?: Date;
}