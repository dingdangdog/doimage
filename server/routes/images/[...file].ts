import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";
import { Readable } from "stream";

export default defineEventHandler(async (event) => {
  // 获取文件路径参数
  const file = decodeURIComponent(getRouterParam(event, "file") || "");
  const query = getQuery(event);

  // 获取指定的宽度和高度参数
  const requestedWidth = parseInt(query.w as string);
  const requestedHeight = parseInt(query.h as string);
  // 检查文件是否存在
  if (file) {
    const basePath = path.join(process.cwd(), "images", file); // 替换为你的实际路径

    if (fs.existsSync(basePath)) {
      try {
        // 检查文件格式，判断是否支持处理
        const supportedFormats = [
          ".jpeg",
          ".jpg",
          ".jfif",
          ".png",
          ".webp",
          ".tiff",
          ".avif",
        ];
        // console.log(path.extname(basePath));
        if (!supportedFormats.includes(path.extname(basePath))) {
          // 如果格式不支持，直接返回原图
          return sendStream(event, fs.createReadStream(basePath));
        }

        let image = sharp(basePath);
        const metadata = await image.metadata();
        // console.log(metadata.width, metadata.height);
        // 判断是否需要调整图片尺寸
        if (
          requestedWidth &&
          requestedHeight &&
          // @ts-ignore
          (requestedWidth < metadata.width || requestedHeight < metadata.height)
        ) {
          // console.log(requestedWidth, requestedWidth);
          image = image.resize({
            width: Math.min(requestedWidth, metadata.width!),
            height: Math.min(requestedHeight, metadata.height!),
            fit: "inside",
          });
        }

        // 将图片转换为 WebP 格式
        image = image.toFormat("webp");

        // 返回转换后的图片流
        const webpBuffer = await image.toBuffer();
        event.node.res.setHeader("Content-Type", "image/webp");
        return sendStream(event, Readable.from(webpBuffer));
      } catch (err) {
        console.error("Image processing error:", err);
        return sendStream(
          event,
          fs.createReadStream(path.join(process.cwd(), "public/notfound.png"))
        );
      }
    }
  }

  // 如果文件不存在或未找到
  return sendStream(
    event,
    fs.createReadStream(path.join(process.cwd(), "public/notfound.png"))
  );
});
