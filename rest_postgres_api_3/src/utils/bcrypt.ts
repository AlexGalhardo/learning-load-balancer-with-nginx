import * as bcrypt from 'bcrypt'

export default class Bcrypt {
  static async hash (password: string): Promise<string> {
    return bcrypt
      .genSalt(12)
      .then((salt) => bcrypt.hash(password, salt))
      .then((hash) => hash)
  }

  static async compare (password: string, hashPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashPassword).then((resp) => resp)
  }
}
