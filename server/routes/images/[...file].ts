import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  const file = getRouterParam(event, "file");
  if (file) {
    // 构建完整的文件路径
    const basePath = path.join(process.cwd(), "images", file); // 替换为你的实际路径

    // 检查文件是否存在
    if (fs.existsSync(basePath)) {
      // 返回文件内容
      return sendStream(event, fs.createReadStream(basePath));
    } else {
      return sendStream(
        event,
        fs.createReadStream(path.join(process.cwd(), "public/notfound.png"))
      );
    }
  }
  return sendStream(
    event,
    fs.createReadStream(path.join(process.cwd(), "public/notfound.png"))
  );
});
