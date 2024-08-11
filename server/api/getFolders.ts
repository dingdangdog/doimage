import { getFolderList } from "../utils";

export default defineEventHandler(async (event) => {
  const folders = getFolderList();
  return folders;
});
