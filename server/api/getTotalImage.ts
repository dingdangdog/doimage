import { getFileList } from "../utils";


export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  const files = getFileList(body.folder);
  return files.length;
});
