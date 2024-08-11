import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  const formdata = await readFormData(event);
  const files: File[] = formdata.getAll("images") as File[];
  // console.log(formdata.getAll("images"));
  const folder = String(formdata.get("folder"));
  const time = String(formdata.get("time"));
  const folderPath = path.join(process.cwd(), "public/images", folder);

  const imageNames: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    // 获取文件扩展名
    const extension = path.extname(file.name);
    // 生成唯一文件名
    const filename = `${folder}-${time}-${i}${extension}`;
    // 保存文件
    await fs.writeFileSync(
      path.join(folderPath, filename),
      Buffer.from(await file.arrayBuffer())
    );
    imageNames.push(filename);
  }

  const config = await useRuntimeConfig(event);
  const domain = config.domain;
  const urls = imageNames.map((image) => `${domain}/${folder}/${image}`);
  // const files = getFileList(body.folder);
  return urls;
});
