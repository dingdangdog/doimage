import * as fs from "fs";
import * as path from "path";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const start = body.start ? Number(body.start) : 0;
  const end = start + (body.num ? Number(body.num) : 20);

  const files = getFileList(body.folder);
  if (files.length > 0) {
    const resFiles = files.slice(start, end);
    const config = await useRuntimeConfig(event);
    const domain = config.domain;
    const urls = resFiles.map(
      (file) => `${domain}/images/${body.folder}/thumbs/${file}`
    );
    return urls;
  }

  return files;
});

const getFileList = (dir: string): string[] => {
  const folderPath = path.join(process.cwd(), "public/images", dir, "thumbs");
  let imageList: string[] = [];

  try {
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
      const filePath = path.join(folderPath, file);
      if (fs.statSync(filePath).isFile()) {
        imageList.push(file);
      }
    }
  } catch (err) {
    // Handle the error or return an empty list
    return imageList;
  }

  return imageList;
};
