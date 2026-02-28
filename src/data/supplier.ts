import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Supplier,
  SupplierPaginator,
  SupplierQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { supplierClient } from './client/supplier';
import { Config } from '@/config';

export const useSuppliersQuery = (options: Partial<SupplierQueryOptions>) => {
  const { data, error, isLoading } = useQuery<SupplierPaginator, Error>(
    [API_ENDPOINTS.SUPPLIERS, options],
    ({ queryKey, pageParam }) =>
      supplierClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    suppliers: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useSupplierQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Supplier, Error>(
    [API_ENDPOINTS.SUPPLIERS, { slug, language }],
    () => supplierClient.get({ slug, language }),
  );

  return {
    supplier: data,
    error,
    isLoading,
  };
};

export const useCreateSupplierMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(supplierClient.create, {
    onSuccess: () => {
      Router.push(Routes.supplier.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUPPLIERS);
    },
  });
};

export const useUpdateSupplierMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(supplierClient.update, {
    onSuccess: async (data) => {
      //   const generateRedirectUrl = router.query.shop
      //     ? `/${router.query.shop}${Routes.supplier.list}`
      //     : Routes.supplier.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.SUPPLIERS);
    },
  });
};

export const useDeleteSupplierMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(supplierClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.SUPPLIERS);
    },
  });
};
