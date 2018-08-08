
export function serialize(
  obj: any
): string {
  return JSON.stringify(obj);
}

export function deserialize(
  strVal: string | null,
  defaultVal: any = undefined
): any {
  if(!strVal) return defaultVal;
  const val = JSON.parse(strVal);
  return val || defaultVal;
}
