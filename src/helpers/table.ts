import Model from "core/models/Model";
import { PaginationProps } from "antd/lib/pagination";
import { DEFAULT_TAKE } from "@react3l/react3l/config";
import { ModelFilter } from "@react3l/react3l/core";

export function renderMasterIndex<T extends Model>(
  pagination?: PaginationProps,
) {
  return (...[, , index]: [any, T, number]) => {
    if (pagination) {
      const { current = 1, pageSize = DEFAULT_TAKE } = pagination;
      return index + 1 + (current - 1) * pageSize;
    }
    return index + 1;
  };
}

export function masterTableIndex<T extends Model, TFilter extends ModelFilter>(
  filter?: TFilter,
) {
  return (...[, , index]: [any, T, number]) => {
    if (filter) {
      const { skip = 0, take = DEFAULT_TAKE } = filter;
      return index + 1 + skip * take;
    }
    return index + 1;
  };
}
