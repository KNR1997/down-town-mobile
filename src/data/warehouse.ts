import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Warehouse,
  WarehousePaginator,
  WarehouseQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { warehouseClient } from './client/warehouse';
import { Config } from '@/config';

export const useWarehousesQuery = (options: Partial<WarehouseQueryOptions>) => {
  const { data, error, isLoading } = useQuery<WarehousePaginator, Error>(
    [API_ENDPOINTS.WAREHOUSES, options],
    ({ queryKey, pageParam }) =>
      warehouseClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    warehouses: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const useWarehouseQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Warehouse, Error>(
    [API_ENDPOINTS.WAREHOUSES, { slug, language }],
    () => warehouseClient.get({ slug, language }),
  );

  return {
    warehouse: data,
    error,
    isLoading,
  };
};

export const useCreateWarehouseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(warehouseClient.create, {
    onSuccess: () => {
      Router.push(Routes.warehouse.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.WAREHOUSES);
    },
  });
};

export const useUpdateWarehouseMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(warehouseClient.update, {
    onSuccess: async (data) => {
      //   const generateRedirectUrl = router.query.shop
      //     ? `/${router.query.shop}${Routes.warehouse.list}`
      //     : Routes.warehouse.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.WAREHOUSES);
    },
  });
};

export const useDeleteWarehouseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(warehouseClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.WAREHOUSES);
    },
  });
};
