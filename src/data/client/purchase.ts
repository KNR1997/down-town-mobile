import {
  QueryOptions,
  Purchase,
  CreatePurchaseInput,
  PurchaseQueryOptions,
  PurchasePaginator,
} from '@/types';
import { API_ENDPOINTS } from './api-endpoints';
import { crudFactory } from './curd-factory';
import { HttpClient } from './http-client';

export const purchaseClient = {
  ...crudFactory<Purchase, QueryOptions, CreatePurchaseInput>(
    API_ENDPOINTS.PURCHASES,
  ),
  paginated: ({ name, ...params }: Partial<PurchaseQueryOptions>) => {
    return HttpClient.get<PurchasePaginator>(API_ENDPOINTS.PURCHASES, {
      searchJoin: 'and',
      self,
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
