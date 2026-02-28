import Router, { useRouter } from 'next/router';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { toast } from 'react-toastify';
import { useTranslation } from 'next-i18next';
import { Routes } from '@/config/routes';
import { API_ENDPOINTS } from './client/api-endpoints';
import {
  Purchase,
  PurchasePaginator,
  PurchaseQueryOptions,
  GetParams,
} from '@/types';
import { mapPaginatorData } from '@/utils/data-mappers';
import { purchaseClient } from './client/purchase';
import { Config } from '@/config';

export const usePurchasesQuery = (options: Partial<PurchaseQueryOptions>) => {
  const { data, error, isLoading } = useQuery<PurchasePaginator, Error>(
    [API_ENDPOINTS.PURCHASES, options],
    ({ queryKey, pageParam }) =>
      purchaseClient.paginated(Object.assign({}, queryKey[1], pageParam)),
    {
      keepPreviousData: true,
    },
  );

  return {
    purchases: data?.data ?? [],
    paginatorInfo: mapPaginatorData(data),
    error,
    loading: isLoading,
  };
};

export const usePurchaseQuery = ({ slug, language }: GetParams) => {
  const { data, error, isLoading } = useQuery<Purchase, Error>(
    [API_ENDPOINTS.PURCHASES, { slug, language }],
    () => purchaseClient.get({ slug, language }),
  );

  return {
    purchase: data,
    error,
    isLoading,
  };
};

export const useCreatePurchaseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(purchaseClient.create, {
    onSuccess: () => {
      Router.push(Routes.purchase.list, undefined, {
        locale: Config.defaultLanguage,
      });
      toast.success(t('common:successfully-created'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PURCHASES);
    },
  });
};

export const useUpdatePurchaseMutation = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation(purchaseClient.update, {
    onSuccess: async (data) => {
      //   const generateRedirectUrl = router.query.shop
      //     ? `/${router.query.shop}${Routes.purchase.list}`
      //     : Routes.purchase.list;
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
      queryClient.invalidateQueries(API_ENDPOINTS.PURCHASES);
    },
  });
};

export const useDeletePurchaseMutation = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation(purchaseClient.delete, {
    onSuccess: () => {
      toast.success(t('common:successfully-deleted'));
    },
    // Always refetch after error or success:
    onSettled: () => {
      queryClient.invalidateQueries(API_ENDPOINTS.PURCHASES);
    },
  });
};
