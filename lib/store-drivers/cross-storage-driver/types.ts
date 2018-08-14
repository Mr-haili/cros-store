export enum Method {
  GET = 'GET',
  SET = 'SET',
  REMOVE = 'REMOVE',
  CLEAR = 'CLEAR'
}

export interface RequestMsg {
  cbId: string,
  origin: string,
  method: Method,
  args: any
}

export interface ResponseMsg {
  cbId: string,
  ret: string | undefined | null,
  err?: string
}
