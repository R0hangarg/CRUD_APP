import joi from 'joi'

export const productValidation = joi.object({
    name:joi.string().min(6).required(),
    price:joi.number().required(),
    description:joi.string().required(),
    stock:joi.number().required(),
    category:joi.string().required(),
})