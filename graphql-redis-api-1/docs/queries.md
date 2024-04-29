## Get all todos
```graphql
query allToDos {
  allToDos {
    success
    message
    todos {
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
  "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZTIzZmU5OS1hOGI3LTQyZWEtYWFmMS01NzNjOGIyNTg4YmMiLCJ1c2VyRW1haWwiOiJhbGV4QGdtYWlsLmNvbSIsImlhdCI6MTcxNDI0MTgyNCwiZXhwIjoxNzE0MjQ1NDI0fQ.ZtGbhX-kXOlTov_p8VEVWjeIQ-hyVxFoF1qhpQHSO0Y"
}
```

## Get todo by id
```graphql
query getToDoById($id: String!){
  getToDoById(id: $id){
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
  "id": "7645df7c-79ac-410d-91e3-90d69a01d323"
}
```

```json
{
  "authorization": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIyZTIzZmU5OS1hOGI3LTQyZWEtYWFmMS01NzNjOGIyNTg4YmMiLCJ1c2VyRW1haWwiOiJhbGV4QGdtYWlsLmNvbSIsImlhdCI6MTcxNDI0MTgyNCwiZXhwIjoxNzE0MjQ1NDI0fQ.ZtGbhX-kXOlTov_p8VEVWjeIQ-hyVxFoF1qhpQHSO0Y"
}
```
