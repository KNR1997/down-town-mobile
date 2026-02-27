import { useEffect } from 'react';
import { Category } from '@/types';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { Control, useFormState, FieldErrors, useWatch } from 'react-hook-form';
// hooks
import { useCategoriesQuery } from '@/data/category';
// components
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';

export default function SelectCategories({
  control,
  setValue,
  errors,
  initialValue,
}: {
  control: Control<any>;
  setValue: any;
  errors: FieldErrors;
  initialValue?: Category;
}) {
  const { locale } = useRouter();
  const { t } = useTranslation();
  const type = useWatch({
    control,
    name: 'type',
  });
  const { dirtyFields } = useFormState({
    control,
  });
  useEffect(() => {
    if (type?.slug && dirtyFields?.type) {
      setValue('parent', []);
    }
  }, [type?.slug]);
  const { categories, loading } = useCategoriesQuery({
    limit: 999,
    type: type?.slug,
    language: locale,
    ...(Boolean(initialValue?.id) && { self: initialValue?.id }),
  });
  return (
    <div className="mb-5">
      <SelectInput
        name="parent"
        control={control}
        label={t('form:input-label-parent-category')}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={categories}
        isClearable={true}
        isLoading={loading}
      />
      <ValidationError message={t(errors.course?.message)} />
    </div>
  );
}
