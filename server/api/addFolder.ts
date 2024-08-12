import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const folder = body.folder;
  if (folder) {
    const folderPath = path.join(process.cwd(), "public/images", folder);
    // 确保保存路径存在
    await fs.promises.mkdir(folderPath, { recursive: true });
  }
  return "OK";
});
