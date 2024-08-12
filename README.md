# Doimage

[English]  [[简体中文](./README_ZH.md)]

![logo](./public/Doimage.png)

Doimage can build a personal image storage service and provide a simple visual operation page to facilitate the management of your images.

## Features

- No Database
- Batch upload
- Can add watermark
- Automatically generate thumbnails
- Multiple folder management
- One-click deletion
- Automatically generate URLs
- Chinese and English support
- Docker deployment
- Multi-terminal adaptation
- Nuxt3 + Vuetify
- Pink Storm
- ...

## Get Started

Use This `docker-compose.yml` Quick Start:

```yml
services:
  doimage:
    image: dingdangdog/doimage:latest
    container_name: doimage
    #restart: always
    environment:
      # please change NUXT_API_SECRET value
      - NUXT_API_SECRET=123456
      # please change NUXT_DOMAIN value
      - NUXT_DOMAIN=http://localhost:11080
    volumes:
      - ./images:/app/images
    ports:
      - 80:3000
```

## Screenshots

[SCREENSHOTS.MD](./doc/SCREENSHOTS.md)
