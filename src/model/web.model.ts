export class WebResponse<T> {
  code?: number;
  msg?: string;
  errors?: string;
  data?: T;
  paging?: Paging;
}

export class Paging {
  size: number;
  total_page: number;
  current_page: number;
}
