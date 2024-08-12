# Doimage

[[English](./README.md)]  [简体中文]

![logo](./public/Doimage.png)

Doimage可以构建个人图片存储服务，提供简单的可视化操作页面，方便管理您的图片。

## 功能点

- 无数据库
- 批量上传
- 可添加水印
- 自动生成缩略图
- 多文件夹管理
- 删除
- 自动生成URL
- 中英文支持
- Docker部署
- 多终端适配
- Nuxt3 + Vuetify
- 粉红风暴
- ...

## 立即开始

使用此 `docker-compose.yml` 快速启动:

```yml
services:
  doimage:
    image: dingdangdog/doimage:latest
    container_name: doimage
    #restart: always
    environment:
      # 请修改NUXT_API_SECRET
      - NUXT_API_SECRET=123456
      # 请修改NUXT_DOMAIN
      - NUXT_DOMAIN=http://localhost:11080
    volumes:
      - ./images:/app/images
    ports:
      - 80:3000
```

## 截图

[SCREENSHOTS.MD](./doc/SCREENSHOTS.md)
