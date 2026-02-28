import * as yup from 'yup';

export const warehouseValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  code: yup.string().required('form:error-code-required'),
  address: yup.string().required('form:error-address-required'),
});
