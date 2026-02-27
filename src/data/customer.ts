import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { mapPaginatorData } from '@/utils/data-mappers';
import { API_ENDPOINTS } from './client/api-endpoints';
import { Routes } from '@/config/routes';
import { Config } from '@/config';
import { customerClient } from './client/customer';
import { Customer, CustomerPaginator, CustomerQueryOptions, GetParams } from '@/types';

export const useCustomersQuery = (options: Partial<CustomerQueryOptions>) => {
  const { data, error, isLoading } = useQuery<CustomerPaginator, Error>(
    [API_ENDPOINTS.CUSTOMERS, options],
    ({ queryKey, pageParam }) =>
      customerClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    customers: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useCustomerQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Customer, Error>(
    [API_ENDPOINTS.TYPES, { slug, language }],
    () => customerClient.get({ slug, language }),
  );
  return {
    customer: data,
    error,
    loading: isLoading,
  };
};

export const useCreateCustomerMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(customerClient.create, {
    onSuccess: () => {
      Router.push(Routes.customer.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CUSTOMERS);
    },
  });
};

export const useDeleteCustomerMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(customerClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CUSTOMERS);
    },
  });
};

export const useUpdateCustomerMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(customerClient.update, {
    onSuccess: async (data) => {
    //   const generateRedirectUrl = router.query.shop
    //     ? `/${router.query.shop}${Routes.customer.list}`
    //     : Routes.customer.list;
    //   await router.push(
    //     `${generateRedirectUrl}/${data?.slug}/edit`,
    //     undefined,
    //     {
    //       locale: Config.defaultLanguage,
    //     },
    //   );
      toast.success(t('common:successfully-updated'));
    },
    // onSuccess: () => {
    //   toast.success(t('common:successfully-updated'));
    // },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.CUSTOMERS);
    },
  });
};
