import Joi from 'joi'
import Bcrypt from './bcrypt'

export interface UserBody {
  name: string
  email: string
  password: string
}

const userSchema = Joi.object({
  name: Joi.string().max(255).required(),
  email: Joi.string()
    .email({
      minDomainSegments: 2,
      tlds: { allow: ['com'] }
    })
    .max(255)
    .required(),
  password: Joi.string()
    .min(8)
    .max(255)
    .pattern(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    )
    .required()
}).required()

const valiteUserSchema = async (data: UserBody) => {
  const { value, error } = userSchema.validate(data, { abortEarly: false })

  if (error) {
    console.log(error)
    throw new Error(error.message)
  }

  value.password = await Bcrypt.hash(value.password)

  return value
}

export default valiteUserSchema
