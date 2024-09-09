import joi from 'joi'

export const userValidation = joi.object({
    username:joi.string().min(6).required(),
    password:joi.string().required(),
    role:joi.string().required()
})

export const loginValidations = joi.object({
    username:joi.string().min(6).required(),
    password:joi.string().required()
})