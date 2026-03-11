export interface DataResultDto<T> {
  results: T;
  message: string;
  success?: boolean;
}
