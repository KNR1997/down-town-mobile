import { useRouter } from 'next/router';
import { Control } from 'react-hook-form';
import { useTypesQuery } from '@/data/type';
import { useTranslation } from 'next-i18next';
import SelectInput from '@/components/ui/select-input';
import ValidationError from '@/components/ui/form-validation-error';

interface Props {
  control: Control<any>;
  error: string | undefined;
}

const ProductGroupInput = ({ control, error }: Props) => {
  const { t } = useTranslation();
  const { locale } = useRouter();
  const { types, loading } = useTypesQuery({
    limit: 200,
    language: locale,
  });
  return (
    <div className="mb-5">
      <SelectInput
        required
        name="type"
        control={control}
        label={t('form:input-label-group')}
        getOptionLabel={(option: any) => option.name}
        getOptionValue={(option: any) => option.id}
        options={types!}
        isLoading={loading}
      />
      <ValidationError message={t(error!)} />
    </div>
  );
};

export default ProductGroupInput;
