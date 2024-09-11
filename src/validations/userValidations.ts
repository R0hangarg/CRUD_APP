import joi from 'joi'

export const userValidation = joi.object({
    username:joi.string().min(6),
    password:joi.string().required(),
    role:joi.string().required(),
    email:joi.string().required(),
    phone:joi.number().min(10).required(),
})

export const loginValidations = joi.object({
    username:joi.string().min(6).required(),
    password:joi.string().required(),
})

export const loginByOtpValidations = joi.object({
    email: joi.string().optional(),
    phone: joi.number().optional(),
    contactType:joi.string().optional(),
}).or('email', 'phone','contactType');