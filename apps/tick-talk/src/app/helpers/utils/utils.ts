export function isString(value: any): boolean {
  return typeof value === 'string';
}

export function isEmptyString(value: any): boolean {
  return isString(value) && value.trim() === '';
}
