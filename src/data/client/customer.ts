import { crudFactory } from '@/data/client/curd-factory';
import {
  CreateCustomerInput,
  Customer,
  CustomerPaginator,
  CustomerQueryOptions,
  QueryOptions,
} from '@/types';
import { API_ENDPOINTS } from '@/data/client/api-endpoints';
import { HttpClient } from '@/data/client/http-client';

export const customerClient = {
  ...crudFactory<Customer, QueryOptions, CreateCustomerInput>(
    API_ENDPOINTS.CUSTOMERS,
  ),
  paginated: ({ name, ...params }: Partial<CustomerQueryOptions>) => {
    return HttpClient.get<CustomerPaginator>(API_ENDPOINTS.CUSTOMERS, {
      searchJoin: 'and',
      ...params,
      search: HttpClient.formatSearchParams({ name }),
    });
  },
};
