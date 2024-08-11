import * as fs from "fs";
import * as path from "path";
import crypto from "crypto";

export const getFileList = (dir: string): string[] => {
  const folderPath = path.join(process.cwd(), "public/images", dir);
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

export const getFolderList = (): string[] => {
  const folderPath = path.join(process.cwd(), "public/images");
  let folderList: string[] = [];

  try {
    const folders = fs.readdirSync(folderPath);

    for (const folder of folders) {
      const fPath = path.join(folderPath, folder);
      if (fs.statSync(fPath).isDirectory()) {
        folderList.push(folder);
      }
    }
  } catch (err) {
    // Handle the error or return an empty list
    return folderList;
  }

  return folderList;
};

// EncryptBySHA256 使用 SHA-256 算法加密字符串
export const encryptBySHA256 = (userName: string, password: string) => {
  const hash = crypto.createHash("sha256");
  hash.update(userName + password);
  return hash.digest("hex");
};
