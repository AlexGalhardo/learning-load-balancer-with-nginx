<div align="center">
  <h1 align="center">Learning Load Balance with NGINX</a>
</div>

## Introduction

- A personal project I created to learn and improve my skills in:
  - [NGINX](https://www.nginx.com/)
  - [Docker & Docker Compose](https://www.docker.com/)
  - [DockerHub](https://hub.docker.com/)
  - Reverse Proxy
  - Web Server
  - Performance Benchmarks

## Development Setup Local

1. Clone repository
```
git clone git@github.com:AlexGalhardo/learning-load-balance-with-nginx.git
```

2. Build containers and up databases & API servers
```
sudo docker-compose up --build -d
```

3. Start DDoS Attack
```
node start-ddos-attack.mjs
```

4. See responses (reports) in [responses/](./responses/)

## License

[MIT](http://opensource.org/licenses/MIT)

Copyright (c) April 2024-present, [Alex Galhardo](https://github.com/AlexGalhardo)