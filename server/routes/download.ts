import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  const query = await getQuery(event);
  const url = String(query.url);

  if (url && url != "null") {
    const config = await useRuntimeConfig(event);
    const thumbFile = url.replace(config.domain, "");
    const thumbFilePath = path.join(process.cwd(), thumbFile);
    const filePath = thumbFilePath.replace("thumbs", "");
    try {
      // 检查文件是否存在
      if (fs.existsSync(filePath)) {
        console.log("Downloading:", filePath);

        // 设置文件名（可选：从路径中提取文件名）
        const fileName = path.basename(filePath);

        // 设置响应头，告诉浏览器这是一个下载
        setHeader(
          event,
          "Content-Disposition",
          `attachment; filename=${fileName}`
        );
        setHeader(event, "Content-Type", "application/octet-stream");

        // 创建文件流并将其发送给客户端
        const fileStream = fs.createReadStream(filePath);
        return sendStream(event, fileStream);
      } else {
        throw new Error("File not found");
      }
      // 下载文件
    } catch {
      throw Error("Download Error");
    }
  }
});
