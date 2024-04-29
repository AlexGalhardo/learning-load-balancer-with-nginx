curl -X POST \
  http://localhost:3000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "mutation signup($name: String!, $email: String!, $password: String!) { signup(name: $name, email: $email, password: $password) { success message user { id name email password updated_at created_at jwt_token_session } } }",
  "variables": {
    "name": "test",
    "email": "test@gmail.com",
    "password": "testqweBR@123"
  }
}'
