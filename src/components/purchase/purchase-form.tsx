import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { yupResolver } from '@hookform/resolvers/yup';
// types
import { Supplier } from '@/types';
// validations
import { purchaseValidationSchema } from './purchase-validation-schema';
// hooks
import { useSettingsQuery } from '@/data/settings';
import {
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
} from '@/data/supplier';
// components
import Input from '@/components/ui/input';
import Card from '@/components/common/card';
import Button from '@/components/ui/button';
import Description from '@/components/ui/description';
import StickyFooterPanel from '@/components/ui/sticky-footer-panel';

type FormValues = {
  name: string;
  email: string;
  address: string;
};

const defaultValues = {
  name: '',
  email: '',
  address: '',
};

type IProps = {
  initialValues?: Supplier | undefined;
};
export default function CreateOrUpdateSupplierForm({ initialValues }: IProps) {
  const router = useRouter();
  const { t } = useTranslation();
  const isNewTranslation = router?.query?.action === 'translate';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    // shouldUnregister: true,
    //@ts-ignore
    defaultValues: initialValues
      ? {
          ...initialValues,
          ...(isNewTranslation && {
            type: null,
          }),
        }
      : defaultValues,
    //@ts-ignore
    resolver: yupResolver(purchaseValidationSchema),
  });

  const { locale } = router;
  const {
    // @ts-ignore
    settings: { options },
  } = useSettingsQuery({
    language: locale!,
  });

  const { mutate: createSupplier, isLoading: creating } =
    useCreateSupplierMutation();
  const { mutate: updateSupplier, isLoading: updating } =
    useUpdateSupplierMutation();

  const onSubmit = async (values: FormValues) => {
    const input = {
      name: values.name,
      email: values.email,
      address: values.address,
    };
    if (!initialValues) {
      createSupplier({
        ...input,
      });
    } else {
      updateSupplier({
        ...input,
        id: initialValues.id!,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="flex flex-wrap my-5 sm:my-8">
        <Description
          title={t('form:input-label-description')}
          details={`${
            initialValues
              ? t('form:item-description-edit')
              : t('form:item-description-add')
          } ${t('form:warehouse-description-helper-text')}`}
          className="w-full px-0 pb-5 sm:w-4/12 sm:py-8 sm:pe-4 md:w-1/3 md:pe-5 "
        />

        <Card className="w-full sm:w-8/12 md:w-2/3">
          <Input
            label={t('form:input-label-name')}
            {...register('name')}
            error={t(errors.name?.message!)}
            variant="outline"
            className="mb-5"
            required
          />
          <Input
            label={t('form:input-label-email')}
            {...register('email')}
            error={t(errors.email?.message!)}
            variant="outline"
            className="mb-5"
          />
          <Input
            label={t('form:input-label-address')}
            {...register('address')}
            error={t(errors.address?.message!)}
            variant="outline"
            className="mb-5"
          />
        </Card>
      </div>
      <StickyFooterPanel className="z-0">
        <div className="text-end">
          {initialValues && (
            <Button
              variant="outline"
              onClick={router.back}
              className="text-sm me-4 md:text-base"
              type="button"
            >
              {t('form:button-label-back')}
            </Button>
          )}

          <Button
            loading={creating || updating}
            disabled={creating || updating}
            className="text-sm md:text-base"
          >
            {initialValues
              ? t('form:button-label-update-warehouse')
              : t('form:button-label-add-warehouse')}
          </Button>
        </div>
      </StickyFooterPanel>
    </form>
  );
}
