import * as yup from 'yup';

export const purchaseValidationSchema = yup.object().shape({
  name: yup.string().required('form:error-name-required'),
  // email: yup.string().required('form:error-email-required'),
  // address: yup.string().required('form:error-address-required'),
});
