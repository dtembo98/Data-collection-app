const Joi = require("joi");

// accepts name only as letters and converts to loerrcase
const name = Joi.string()
  .min(1)
  .max(30)
  .trim()
  .required()
  .regex(/^[A-Za-z]+$/)
  .lowercase();

const phoneNumber = Joi.string()
  .trim()
  .required()
  .regex(/^[0-9]{10}$/);
const password = Joi.string().min(6).max(30).required().strict();

const phrase = Joi.string().required();

const userSignUPDataSchema = Joi.object({
  firstName: name,
  lastName: name,
  phoneNumber,
  password,
});

const userSignInDataSchema = Joi.object({
  phoneNumber,
  password,
});

const translatedPhraseSchema = Joi.object({
  phrase,
});

// export the schemas
module.exports = {
  "/auth/signin": userSignInDataSchema,
  "/auth/signup": userSignUPDataSchema,
  "/translate/translate": translatedPhraseSchema,
};
