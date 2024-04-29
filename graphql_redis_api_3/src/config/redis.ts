import Redis from "ioredis";

export const redis = new Redis({
    port: 6379,
    host: "redis",
    // name: "default",
    // password: "my-top-secret",
    // db: 0,
});
