<script setup lang="ts">
import { showDeleteDialog, deleteImage, successAlert } from "../utils";
const { image, x, y } = defineProps<{
  image?: string;
  x?: number;
  y?: number;
}>();
// console.log(image);

const copyThumbUrl = () => {
  navigator.clipboard.writeText(image || "");
  successAlert("Copy Success");
};

const copyUrl = () => {
  const realUrl = image?.replace("/thumbs/", "/");
  if (realUrl) {
    navigator.clipboard.writeText(realUrl);
    successAlert("Copy Success");
  }
};

const copyMarkdownl = () => {
  const realUrl = image?.replace("/thumbs/", "/");
  if (realUrl) {
    navigator.clipboard.writeText(`![image](${realUrl})`);
    successAlert("Copy Success");
  }
};

const toDownload = () => {
  console.log("toDownload");
  const fileUrl = `/download?url=${image}`;

  // 创建一个隐藏的 <a> 标签
  const link = document.createElement("a");
  link.href = fileUrl;
  document.body.appendChild(link);
  link.click();
  successAlert("Downloading started");

  // 移除 <a> 标签
  document.body.removeChild(link);
};

const toDelete = () => {
  console.log("todelete");
  showDeleteDialog.value = true;
  deleteImage.value = image || "";
};
</script>

<template>
  <div
    id="manager-menu"
    class="absolute bg-[rgba(208,78,137,0.9)] border border-gray-300 p-1 rounded-md z-[9999]"
    :style="{ top: `${y}px`, left: `${x}px` }"
  >
    <div
      class="menu text-gray-200 text-center px-4 py-2 rounded-md cursor-pointer hover:text-white hover:bg-[rgba(208,78,137,2)]"
      @click="copyThumbUrl"
    >
      复制缩略图URL
    </div>
    <div
      class="menu text-gray-200 text-center px-4 py-2 rounded-md cursor-pointer hover:text-white hover:bg-[rgba(208,78,137,2)]"
      @click="copyUrl"
    >
      复制原图URL
    </div>
    <div
      class="menu text-gray-200 text-center px-4 py-2 rounded-md cursor-pointer hover:text-white hover:bg-[rgba(208,78,137,2)]"
      @click="copyMarkdownl"
    >
      复制Markdown
    </div>
    <div
      class="menu text-gray-200 text-center px-4 py-2 rounded-md cursor-pointer hover:text-white hover:bg-[rgba(208,78,137,2)]"
      @click="toDownload"
    >
      下载
    </div>
    <div
      class="menu text-gray-200 text-center px-4 py-2 rounded-md cursor-pointer hover:text-white hover:bg-[rgba(208,78,137,2)]"
      @click="toDelete"
    >
      删除
    </div>
  </div>
</template>

<style scoped></style>
