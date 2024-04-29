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
sudo docker build -t graphql-redis-api-1 .
```

## Delete all .git recursively
```
find . -type d -name ".git" -exec rm -rf {} +
```