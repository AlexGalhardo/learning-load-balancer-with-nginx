## Build and up containers detached
```
sudo docker-compose up --build -d
```

## Stop containers
```
docker-compose down --remove-orphans
```

## Build image example
```
sudo docker build -t graphql_redis_api_1 .
```

## Docker error getting credentials - err: exit status 1, out: ``
```
rm ~/.docker/config.json
```

## Delete all .git recursively
```
find . -type d -name ".git" -exec rm -rf {} +
```

## See container logs detached
```
docker logs rest_postgres_api_1
```

## See container logs
```
docker logs nginx -f
```