<div align="center">
  <h1 align="center">ToDo GraphQL API using Redis</a>
</div>

## Introduction

- A personal project I created to learn and improve my skills in:
  - [Elysia](https://elysiajs.com/)
  - [Redis](https://redis.io/)
  - [Apollo GraphQL](https://www.apollographql.com/)

- Techonologies:
  - [NodeJS v20](https://nodejs.org/en)
  - [TypeScript](https://www.typescriptlang.org/)
  - [Bun](https://bun.sh/)
  - [JWT](https://jwt.io/)

## Development Setup Local

1. Clone repository
```
git clone git@github.com:AlexGalhardo/todo-graphql-api-using-redis.git
```

2. Install dependencies
```
bun install
```

3. Create .env
```
cp .env.example .env
```

4. Up docker-compose redis
```
docker-compose up -d
```

5. Up Apollo GraphQL server
```
bun run server
```

6. Go to: [http://localhost:3000/graphql](http://localhost:3000/graphql)
   - Testing API:
      - a. See GraphQL Queries and Mutations on [./docs](./docs/) folder
      - b. You can use [./rest-client](./rest-client) requests also
      - c. You can use [./curl](./curl) requests too


## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) April 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)
