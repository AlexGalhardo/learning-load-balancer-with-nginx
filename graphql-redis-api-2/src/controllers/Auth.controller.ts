import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import * as jsonwebtoken from "jsonwebtoken";
import validateSignupPayload from "src/validate/signupPayload.validate";
import validateLoginPayload from "src/validate/loginPayload.validate";
import { LoginDTO, SignupDTO } from "src/models/auth.dto";
import { redis } from "src/config/redis";

export default class AuthController {
    static async signup(signupDTO: SignupDTO) {
        try {
            const { name, email, password } = signupDTO;

            validateSignupPayload({ name, email, password });

            const emailAlreadyRegistred = await redis
                .get(`user:${email}`)
                .then((result) => {
                    return JSON.parse(result);
                })
                .catch((error) => {
                    throw new Error(error);
                });

            if (emailAlreadyRegistred) return { success: false, message: "Email already registred" };

            const user = {
                id: randomUUID(),
                name,
                email,
                password: await bcrypt.hash(password, 10),
                updated_at: null,
                created_at: new Date().toISOString(),
                jwt_token_session: null,
            };

            const jwt_token = jsonwebtoken.sign(
                { userId: user.id, userEmail: user.email },
                process.env.JWT_SECRET_KEY,
                {
                    expiresIn: "1h",
                },
            );

            user.jwt_token_session = jwt_token;

            redis.set(`user:${user.email}`, JSON.stringify(user));

            return { success: true, user, jwt_token };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    static async login(loginDTO: LoginDTO) {
        try {
            const { email, password } = loginDTO;

            validateLoginPayload({ email, password });

            const user = await redis
                .get(`user:${email}`)
                .then((result) => {
                    return JSON.parse(result);
                })
                .catch((error) => {
                    throw new Error(error);
                });

            if (!user) return { success: false, message: "Email and/or password invalid" };

            const passwordMatch = await bcrypt.compare(password, user.password);

            if (!passwordMatch) return { success: false, message: "Email and/or password invalid" };

            const jwt_token = jsonwebtoken.sign(
                { userId: user.id, userEmail: user.email },
                process.env.JWT_SECRET_KEY,
                { expiresIn: "1h" },
            );

            user.jwt_token_session = jwt_token;

            redis.set(`user:${user.email}`, JSON.stringify(user));

            return { success: true, user, jwt_token };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}
