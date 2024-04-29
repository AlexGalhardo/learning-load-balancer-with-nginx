curl -X POST \
  http://localhost:3000/graphql \
  -H 'Content-Type: application/json' \
  -d '{
  "query": "mutation login($email: String!, $password: String!) { login(email: $email, password: $password) { success message user { id name email password updated_at created_at jwt_token_session } } }",
  "variables": {
    "email": "test@gmail.com",
    "password": "testqweBR@123"
  }
}'
