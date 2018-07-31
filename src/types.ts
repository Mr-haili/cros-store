export enum Method {
  GET = 'GET',
  SET = 'SET',
  REMOVE = 'REMOVE',
  CLEAR = 'CLEAR'
}

export interface RequestMsg {
  cbId: number,
  origin: string,
  method: Method,
  args: any
}

export interface ResponseMsg {
  cbId: number,
  ret: string | undefined | null,
  err?: string
}
