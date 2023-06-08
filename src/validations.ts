import * as yup from 'yup';

export const customerInfoSchema = yup
  .object({
    id: yup.number().nullable(),
    name: yup.string().required().min(2).max(50),
    email: yup.string().email().nullable(),
    // phone: yup.number().min(100000).max(999999999999).required(),
    // phone: yup.string().required().min(8).max(15),
    phone: yup.string().required(),
  })
  .required();

export const addressSchema = (method: string, t: any) =>
  yup
    .object()
    .shape({
      method: yup.string().required(),
      address_type: yup.number().required(),
      // block: yup
      //   .string()
      //   .max(100)
      //   .when('address_type', (address_type, schema) => {
      //     if (method === `delivery`) {
      //       return schema.required(t(`validation.required`));
      //     }
      //     return schema.nullable(true);
      //   }),
      street: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      house_no: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          console.log('address type', address_type)
          if (address_type === 1 && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      floor_no: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (address_type === 2 && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      building_no: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (address_type === 2 && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      apartment_no: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (address_type === 2 && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      office_no: yup.mixed().when('address_type', (address_type, schema) => {
        if (address_type === 3 && method === `delivery`) {
          return schema.required(t(`validation.required`));
        }
        return schema.nullable(true);
      }),
      avenue: yup.string().max(50).nullable(true),
      paci: yup.string().max(50).nullable(true),
      additional: yup.string().nullable(true),
      longitude: yup.string(),
      latitude: yup.string(),
      customer_id: yup.string().required(),
    })
    .required();

export const feedbackSchema = yup.object().shape({
  user_name: yup.string().min(2).max(50).required(),
  rate: yup.number().min(1).max(3).required(),
  note: yup.string().required().min(2).max(500),
  phone: yup.string().min(0).max(999999999999),
});

export const checkPhone = yup
  .object({
    phone: yup.number().min(10000000000).max(999999999999),
  })
  .required();
