#!/bin/bash
# docker-compose down
# docker-compose up -d
npx prisma migrate dev
npx prisma db seed
