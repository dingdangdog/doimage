FROM node:alpine3.20 AS BUILDER

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:alpine3.20 AS RUNNER

LABEL author.name="DingDangDog"
LABEL author.email="dingdangdogx@outlook.com"
LABEL project.name="Doimage"
LABEL project.version="1.0.0"

WORKDIR /app

COPY --from=BUILDER /app/.output/ ./

VOLUME /app/images/

ENV NUXT_API_SECRET=""
ENV NUXT_DOMAIN="https://doimage.oldmoon.com"

EXPOSE 3000
ENTRYPOINT [ "node","/app/server/index.mjs" ]
