import Joi from "joi";

const signUpSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const signInSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const transactionSchema = Joi.object({
    value: Joi.number().pattern(/^[1-9][0-9]*\,[0-9]{2}$/).required(),
    description: Joi.string().required(),
})

export { signUpSchema, signInSchema, transactionSchema };