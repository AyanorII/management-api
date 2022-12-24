import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  DB_URL: Joi.string().required(),
  PORT: Joi.number().default(8000),
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),
});
