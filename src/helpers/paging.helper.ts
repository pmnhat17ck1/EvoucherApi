import { Metadata, PagingQuery } from 'src/models/pagination';

function _getSortObject(sortQuerystring: string) {
  const arr = sortQuerystring ? sortQuerystring.split(',') : [];
  if (arr.length === 0) {
    return { modifiedAt: -1, createdAt: -1 };
  }
  const sortObj = {};
  for (const part of arr) {
    const val = part.trim();
    if (!val) {
      continue;
    }
    const isDesc = val.indexOf('-') === 0;
    const name = val.replace(/[^0-9a-zA-Z.]/, '');
    if (isDesc) {
      sortObj[name] = -1;
    } else {
      sortObj[name] = 1;
    }
  }
  return sortObj;
}

function _getPageUrl(path: string, currentPage: number, newPage: number) {
  if (!path || currentPage === newPage) {
    return null;
  }
  const arr = path.split(/[?&]/);
  let result = '';
  let counter = 0;
  for (const part of arr) {
    const val = part.trim();
    if (!val) {
      continue;
    }
    const prefix = counter === 0 ? '' : counter === 1 ? '?' : '&';
    counter++;
    if (val === 'page=' + currentPage) {
      result += prefix + 'page=' + newPage;
      continue;
    }
    result += prefix + val;
  }
  return result;
}

function _getMetadataObject(
  count: number,
  paging: PagingQuery,
  url: string,
  sortObj: any,
): Metadata {
  const first = 1;
  const last =
    Math.floor(count / paging.limit) + (count % paging.limit > 0 ? 1 : 0);
  const previous = paging.page === 1 ? 1 : paging.page - 1;
  const next = paging.page === last ? last : paging.page + 1;
  const pageExists = paging.page > 0 && paging.page <= last;
  const metadata: Metadata = {
    count: count,
    page: pageExists ? paging.page : 1,
    last: pageExists ? last : 1,
    limit: paging.limit,
    sort: sortObj,
    links: pageExists
      ? {
          first: _getPageUrl(url, paging.page, first),
          previous: _getPageUrl(url, paging.page, previous),
          current: url,
          next: _getPageUrl(url, paging.page, next),
          last: _getPageUrl(url, paging.page, last),
        }
      : null,
  };
  return metadata;
}

export function getMetadata(
  count: number,
  paging: PagingQuery,
  url: string,
): Metadata {
  paging.limit = +paging.limit;
  paging.page = +paging.page;
  const sort = _getSortObject(paging.sort);
  const metadata = _getMetadataObject(count, paging, url, sort);
  return metadata;
}
