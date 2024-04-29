# REST API

## Local development setup

### Prerequisites
- Install k6: https://k6.io/docs/get-started/installation/
- Install NodeJS v20, docker, docker-compose
- The default setup with docker-compose is using PostgreSQL
   - If you want to use MongoDB, use [MongoAtlas](https://www.mongodb.com/atlas/database)
   - It's necessary because mongodb needs replicaSet configured to use transactions, etc

1. Clone repository
```bash
git clone git@github.com:AlexGalhardo/learning-load-stress-tests.git
```

2. Enter repository and install dependencies
```bash
cd learning-load-stress-tests/rest-postgres-api && npm install
```

3. Create .env file
```bash
cp .env.example .env
```

4. Up Postgre Docker container
```bash
docker-compose up -d
```

5. Create database with Prisma Migrations & Seed
- Using Postgres:
  ```bash
  npx prisma migrate dev && npx prisma db seed
  ```
- Using MongoDB:
  ```bash
  npx prisma db push && npx prisma db seed
  ```

6. Open Prisma Studio (Database GUI)
```bash
npx prisma studio
```

7. Up development server
```bash
npm run dev
```

8. Verify API endpoint: http://localhost:3333

## API
- You can see the HTTP Requests references inside folder [./rest-client](./rest-client)
- Or use cURL:
```bash
curl --request POST \
    --url http://localhost:3333/checkout \
    --header 'Content-Type: application/json'
```

```bash
curl --request POST \
    --url http://localhost:3333/signup \
    --header 'Content-Type: application/json' \
    --data '{ "name":"cURL Test Name", "email":"curl.test.name@gmail.com", "password":"qwe123BR@qwe123BR@" }'
```
