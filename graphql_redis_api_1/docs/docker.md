## Stop and delete all containers
```bash
docker stop $(docker ps -aq)
docker rm $(docker ps -aq)
```
