import * as Joi from '@hapi/joi';

export const configValidationSchema = Joi.object({
  // Database
  DB_URL: Joi.string().required(),

  // Server
  PORT: Joi.number().default(8000),
  CORS_ORIGIN: Joi.string().required(),
  ENV: Joi.string().valid('development', 'production').default('development'),
  THROTTLE_TTL: Joi.number().default(60),
  THROTTLE_LIMIT: Joi.number().default(10),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_REFRESH_SECRET: Joi.string().required(),

  // Cloudinary
  CLOUDINARY_CLOUD_NAME: Joi.string().required(),
  CLOUDINARY_API_KEY: Joi.string().required(),
  CLOUDINARY_API_SECRET: Joi.string(),
  CLOUDINARY_FOLDER: Joi.string(),

  // Mailer
  MAILER_SERVICE: Joi.string().required(),
  MAILER_USER: Joi.string().required(),
  MAILER_PASS: Joi.string().required(),
});
