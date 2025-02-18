import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const url = String(body.url);
  // console.log(url);

  if (url && url != "null") {
    const config = await useRuntimeConfig(event);
    const thumbFile = url.replace(config.domain, "");
    const thumbFilePath = path.join(process.cwd(), thumbFile);
    try {
      // 删除缩略图文件
      // console.log("Delete:", thumbFilePath);
      fs.unlinkSync(thumbFilePath);
    } catch {}
    // const Slash = thumbFilePath.concat("/thumbs/") ? "/" : "\\";
    const filePath = thumbFilePath.replace("thumbs", "");
    try {
      // 删除原图文件
      // console.log("Delete:", filePath);
      fs.unlinkSync(filePath);
    } catch {}
  }
  return "OK";
});
