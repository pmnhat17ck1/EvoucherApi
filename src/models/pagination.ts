export class PagingQuery {
  [key: string]: any;
  keyword?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
export class Links {
  first: string;
  previous: string;
  current: string;
  next: string;
  last: string;
}
export class Metadata {
  count: number;
  last: number;
  page: number;
  limit: number;
  sort: any;
  links: Links;
}
