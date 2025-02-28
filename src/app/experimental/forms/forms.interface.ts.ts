export interface Address {
  city?: string
  street?: string
  building?: number
  apartment?: number
}

export interface Feature {
  code: string
  label: string
  value: boolean
}

export enum MajorType {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  DATABASE = 'DATABASE',
  TESTER = 'TESTER',
  FULLSTACK = 'FULLSTACK',
  PROJECT = 'PROJECT',
  DESIGNER = 'DESIGNER',
}
