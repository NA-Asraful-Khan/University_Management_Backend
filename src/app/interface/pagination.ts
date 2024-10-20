interface Pagination {
  page: number;
  totalPage: number;
  limit: number;
  total: number;
}
export interface PaginationResult<T> {
  result: T[];
  pagination: Pagination; // or the correct type of pagination info
}
