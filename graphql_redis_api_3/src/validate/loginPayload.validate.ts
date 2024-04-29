import Joi from "joi";

const validateLoginSchema = Joi.object({
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

const validateLoginPayload = (data) => {
    const { value, error } = validateLoginSchema.validate(data, { abortEarly: false });

    if (error) throw new Error(error.message);

    return value;
};

export default validateLoginPayload;
