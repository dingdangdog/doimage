import * as fs from "fs";
import * as path from "path";
import sharp from "sharp";

export default defineEventHandler(async (event) => {
  const formdata = await readFormData(event);
  const files: File[] = formdata.getAll("images") as File[];
  if (files.length <= 0) {
    return [];
  }
  // console.log(formdata.getAll("images"));
  const folder = String(formdata.get("folder"));
  const time = String(formdata.get("time"));
  const watermark = String(formdata.get("watermark"));
  const folderPath = path.join(process.cwd(), "images", folder);
  const thumbnailPath = path.join(folderPath, "thumbs");

  // 确保保存路径存在
  await fs.promises.mkdir(folderPath, { recursive: true });
  await fs.promises.mkdir(thumbnailPath, { recursive: true });

  const imageNames: string[] = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    // 获取文件扩展名
    const extension = path.extname(file.name);
    // 生成唯一文件名
    const filename = `${folder}-${time}-${i}${extension}`;
    // 读取文件数据
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // 处理支持的格式
    if (
      [".jpeg", ".jpg", ".png", ".webp", ".tiff", ".gif", ".avif"].includes(
        extension
      )
    ) {
      // 处理图像
      let image = sharp(fileBuffer);

      const metadata = await image.metadata();
      const width = metadata.width || 250;
      const height = metadata.height || 200;
      const fontFamily = "SmileySans-Oblique"; // 自定义字体名称
      if (watermark && watermark != "null") {
        try {
          image = image.composite([
            {
              input: Buffer.from(
                `<svg width="${width}" height="${height}">
                <text x="50%" y="50%" font-size="40" font-family="${fontFamily}" fill="rgba(128, 128, 128, 0.8)"
                  dominant-baseline="middle" text-anchor="middle">
                  ${watermark}
                </text>
              </svg>`
              ),
              gravity: "center",
            },
          ]);
        } catch {
          console.log(`Add WaterMark Error ${filename}`);
        }
      }
      // 保存原图
      await image.toFile(path.join(folderPath, filename));

      // 重新获取原图再去生成缩略图，否则会报错
      const newImage = sharp(path.join(folderPath, filename));
      try {
        // 获取图像的元数据（如宽度和高度）
        const widthRate = width / 250;
        const heightRate = height / 200;
        const rate = widthRate > heightRate ? widthRate : heightRate;
        // 缩放比例大于1.2才需要缩放，否则无需缩略图
        if (rate > 1.2) {
          // 生成缩略图
          await newImage
            .resize(Math.ceil(width / rate), Math.ceil(height / rate))
            .toFile(path.join(thumbnailPath, filename));
        } else {
          await newImage.toFile(path.join(thumbnailPath, filename));
        }
      } catch (err) {
        console.error(`Thumbnail creation failed for ${filename}:`, err);
        // 生成缩略图失败，
        await newImage.toFile(path.join(thumbnailPath, filename));
      }
    } else {
      // 对于不支持处理的格式，如svg、ico，直接保存
      await fs.promises.writeFile(path.join(folderPath, filename), fileBuffer);
      // 如果需要生成缩略图，可以使用其他方法
      // 这里只是保存副本
      await fs.promises.copyFile(
        path.join(folderPath, filename),
        path.join(thumbnailPath, filename)
      );
    }

    imageNames.push(filename);
  }

  const config = await useRuntimeConfig(event);
  const domain = config.domain;
  const urls = imageNames.map(
    (image) => `${domain}/images/${folder}/thumbs/${image}`
  );
  // const files = getFileList(body.folder);
  return urls;
});
