export enum DepartmentType {
  HR = 'HR',
  IT = 'IT',
  FINANCE = 'Finance',
  OPERATIONS = 'Operations'
}

export interface Employee {
  id?: number;
  name: string;
  email: string;
  department: DepartmentType;
  createdAt?: string;
  updateAt?: string;
}

export const departmentOptions = [
  { value: DepartmentType.HR, label: 'Human Resources' },
  { value: DepartmentType.IT, label: 'Information Technology' },
  { value: DepartmentType.FINANCE, label: 'Finance' },
  { value: DepartmentType.OPERATIONS, label: 'Operations' }
];