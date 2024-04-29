## Signup
```graphql
mutation signup($name: String!, $email: String!, $password: String!) {
  signup(name: $name, email: $email, password: $password) {
    success
    message
    user {
      id
      name
      email
      password
      updated_at
      created_at
      jwt_token_session
    }
  }
}
```

```json
{
  "name": "alex",
  "email": "alex@gmail.com",
  "password": "testeBR@123"
}
```

## Login
```graphql
mutation login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    success
    message
    user {
      name
      email
      password
      updated_at
      created_at
      jwt_token_session
    }
  }
}
```

```json
{
  "email": "pedro@gmail.com",
  "password": "testeBR@123"
}
```

## New todo
```graphql
mutation newToDo($title: String!) {
  newToDo(title: $title) {
    success
    message
    todo {
      id
      user_id
      user_email
      title
      done
      updated_at
      created_at
    }
  }
}
```

```json
{
  "title": "comer apokspaoksoas alex"
}
```

```json
{
  "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZTIzZmU5OS1hOGI3LTQyZWEtYWFmMS01NzNjOGIyNTg4YmMiLCJ1c2VyRW1haWwiOiJhbGV4QGdtYWlsLmNvbSIsImlhdCI6MTcxNDI0MTgyNCwiZXhwIjoxNzE0MjQ1NDI0fQ.ZtGbhX-kXOlTov_p8VEVWjeIQ-hyVxFoF1qhpQHSO0Y"
}
```

## Update todo
```graphql
mutation updateToDo($id: String!, $title: String!, $done: Boolean!) {
  updateToDo(id: $id, title: $title, done: $done) {
    success
    message
    todo {
      id
      user_id
      user_email
      title
      done
      updated_at
      created_at
    }
  }
}
```

```json
{
  "id": "7645df7c-79ac-410d-91e3-90d69a01d323",
  "title": "editando para false",
  "done": false
}
```

```json
{
  "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZTIzZmU5OS1hOGI3LTQyZWEtYWFmMS01NzNjOGIyNTg4YmMiLCJ1c2VyRW1haWwiOiJhbGV4QGdtYWlsLmNvbSIsImlhdCI6MTcxNDI0MTgyNCwiZXhwIjoxNzE0MjQ1NDI0fQ.ZtGbhX-kXOlTov_p8VEVWjeIQ-hyVxFoF1qhpQHSO0Y"
}
```

## Delete todo
```graphql
mutation deleteToDo($id: String!){
  deleteToDo(id: $id){
    success
    message
  }
}
```

```json
{
  "id": "7645df7c-79ac-410d-91e3-90d69a01d323"
}
```

```json
{
  "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZTIzZmU5OS1hOGI3LTQyZWEtYWFmMS01NzNjOGIyNTg4YmMiLCJ1c2VyRW1haWwiOiJhbGV4QGdtYWlsLmNvbSIsImlhdCI6MTcxNDI0MTgyNCwiZXhwIjoxNzE0MjQ1NDI0fQ.ZtGbhX-kXOlTov_p8VEVWjeIQ-hyVxFoF1qhpQHSO0Y"
}
```
