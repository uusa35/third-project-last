export type AppQueryResult<T> = {
  success: boolean;
  status: string | number;
  message: string;
  msg?: string;
  data: T;
  Data?: T;
};
