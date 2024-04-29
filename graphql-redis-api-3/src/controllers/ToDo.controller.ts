import * as jsonwebtoken from "jsonwebtoken";
import { randomUUID } from "node:crypto";
import { redis } from "src/config/redis";
import { DeleteToDoDTO, GetToDoByIdDTO, NewToDoDTO, UpdateToDoDTO } from "src/models/todo.dto";

export default class ToDoController {
    static async isUserLoggedIn(authorization: string): Promise<{ id: string; email: string }> {
        const jwt_token = authorization;

        if (!jwt_token) throw new Error("Header authorization token missing");

        const decodedToken = jsonwebtoken.verify(jwt_token, process.env.JWT_SECRET_KEY) as {
            userId: string;
            userEmail: string;
        };

        const userFound = await redis
            .get(`user:${decodedToken.userEmail}`)
            .then((result) => {
                return JSON.parse(result);
            })
            .catch((error) => {
                throw new Error(error);
            });

        if (!userFound) throw new Error("User not found");

        return userFound;
    }

    static async getToDoById({ id }: GetToDoByIdDTO, { authorization }) {
        try {
            const userFound = await ToDoController.isUserLoggedIn(authorization);

            const todoFound = JSON.parse(await redis.get(`todo:${id}`));

            if (!todoFound) return { success: false, message: "Todo not found" };

            if (todoFound.user_id !== userFound.id) return { success: false, message: "This todo is not yours" };

            return { success: true, todo: todoFound };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    static async newToDo({ title }: NewToDoDTO, { authorization }) {
        try {
            const userFound = await ToDoController.isUserLoggedIn(authorization);

            const todo = {
                id: randomUUID(),
                user_id: userFound.id,
                user_email: userFound.email,
                title,
                done: false,
                updated_at: null,
                created_at: new Date().toISOString(),
            };

            await redis.set(`todo:${todo.id}`, JSON.stringify(todo));

            await redis.sadd(`user:${userFound.email}:todos`, todo.id);

            return { success: true, todo };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    static async updateToDo({ id, title, done }: UpdateToDoDTO, { authorization }) {
        try {
            const userFound = await ToDoController.isUserLoggedIn(authorization);

            const todoFound = JSON.parse(await redis.get(`todo:${id}`));

            if (!todoFound) return { success: false, message: "Todo not found" };

            if (todoFound.user_id !== userFound.id) return { success: false, message: "You can't update this todo" };

            const todo = {
                id,
                user_id: userFound.id,
                user_email: userFound.email,
                title,
                done,
                updated_at: new Date().toISOString(),
                created_at: todoFound.created_at,
            };

            await redis.set(`todo:${todo.id}`, JSON.stringify(todo));

            return { success: true, todo };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    static async deleteToDo({ id }: DeleteToDoDTO, { authorization }) {
        try {
            const userFound = await ToDoController.isUserLoggedIn(authorization);

            const todoFound = JSON.parse(await redis.get(`todo:${id}`));

            if (!todoFound) return { success: false, message: "Todo not found" };

            if (todoFound.user_id !== userFound.id) return { success: false, message: "You can't delete this todo" };

            await redis.del(`todo:${id}`);

            await redis.srem(`user:${userFound.email}:todos`, id);

            return { success: true, message: `Todo with id ${id} deleted` };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }

    static async allToDos({ authorization }) {
        try {
            const userFound = await ToDoController.isUserLoggedIn(authorization);

            const todoIds = await redis.smembers(`user:${userFound.email}:todos`);

            const todos = await Promise.all(
                todoIds.map(async (id) => {
                    const todoString = await redis.get(`todo:${id}`);
                    return JSON.parse(todoString);
                }),
            );

            return { success: true, todos };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}
