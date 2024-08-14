FROM node:alpine3.20 AS BUILDER

WORKDIR /app
COPY . .
RUN npm install && npm run build

FROM node:alpine3.20 AS RUNNER

LABEL author.name="DingDangDog"
LABEL author.email="dingdangdogx@outlook.com"
LABEL project.name="Doimage"
LABEL project.version="1.0.1"

WORKDIR /app
# 安装字体配置工具
RUN apk add --no-cache fontconfig
# 复制自定义字体文件到容器中
COPY fonts/ /usr/share/fonts/custom/
# 更新字体缓存
RUN fc-cache -fv

COPY --from=BUILDER /app/.output/ ./

VOLUME /app/images/

ENV NUXT_API_SECRET=""
ENV NUXT_DOMAIN="https://doimage.oldmoon.com"

# 设置字体路径
ENV FONTCONFIG_PATH="/etc/fonts"

EXPOSE 3000
ENTRYPOINT [ "node","/app/server/index.mjs" ]
