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
      address_type: yup.string().required(),
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
          if (address_type === 'HOUSE' && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      floor_no: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (address_type === 'APARTMENT' && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      building_no: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (address_type === 'OFFICE' && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      apartment_no: yup
        .string()
        .max(100)
        .when('address_type', (address_type, schema) => {
          if (address_type === 'APARTMENT' && method === `delivery`) {
            return schema.required(t(`validation.required`));
          }
          return schema.nullable(true);
        }),
      office_no: yup.string().when('address_type', (address_type, schema) => {
        if (address_type === 'OFFICE' && method === `delivery`) {
          return schema.required(t(`validation.required`));
        }
        return schema.nullable(true);
      }),
      area: yup.string().when('address_type', (address_type, schema) => {
        if (method === `delivery`) {
          return schema.required(t(`validation.required`));
        }
        return schema.nullable(true);
      }),
      area_id: yup.string().when('address_type', (address_type, schema) => {
        if (method === `delivery`) {
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
  rate: yup.number().min(1).max(5).required(),
  note: yup.string().min(2).max(460).required(),
  phone: yup.string().min(0).max(999999999999),
});

export const checkPhone = yup
  .object({
    phone: yup.number().min(10000000000).max(999999999999),
  })
  .required();

export const loginSchema = (isResetPassword: boolean) => {
  return yup.lazy((values) => {
    if (isResetPassword) {
      return yup.object().shape({
        new_password: yup.string().required().min(6),
        confirmation_password: yup.string().required().oneOf([yup.ref('new_password'), null]),
      });
    } else {
      return yup.object().shape({
        password: yup.string().required().min(6),
      });
    }
  });
};
