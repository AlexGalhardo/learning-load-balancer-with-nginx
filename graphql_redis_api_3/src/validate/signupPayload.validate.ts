import Joi from "joi";

const validateSignupSchema = Joi.object({
    name: Joi.string().max(255).required(),
    email: Joi.string()
        .email({
            minDomainSegments: 2,
            tlds: { allow: ["com"] },
        })
        .max(255)
        .required(),
    password: Joi.string()
        .min(8)
        .max(255)
        .pattern(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
            "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
        )
        .required(),
}).required();

const validateSignupPayload = (data) => {
    const { value, error } = validateSignupSchema.validate(data, { abortEarly: false });

    if (error) throw new Error(error.message);

    return value;
};

export default validateSignupPayload;
