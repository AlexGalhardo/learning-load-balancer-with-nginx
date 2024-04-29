FROM oven/bun:latest
WORKDIR /home/node/app
COPY . .
RUN bun install
RUN cp .env.example .env
EXPOSE 3000
CMD ["bun", "run", "server"]
