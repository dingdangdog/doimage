<template>
  <div id="manager-menu" :style="{ top: `${y}px`, left: `${x}px` }">
    <div class="menu" @click="copyThumbUrl">复制缩略图URL</div>
    <div class="menu" @click="copyUrl">复制原图URL</div>
    <div class="menu" @click="copyMarkdownl">复制Markdown</div>
    <div class="menu" @click="toDelete">删除</div>
  </div>
</template>

<script setup lang="ts">
import { showDeleteDialog, deleteImage } from "../utils";
const { showMenu, image, x, y } = defineProps(["showMenu", "image", "x", "y"]);
console.log(image);

const copyThumbUrl = () => {
  navigator.clipboard.writeText(image);
  successAlert("Copy Success");
};

const copyUrl = () => {
  const realUrl = image.replace("/thumbs/", "/");
  navigator.clipboard.writeText(realUrl);
  successAlert("Copy Success");
};

const copyMarkdownl = () => {
  const realUrl = image.replace("/thumbs/", "/");
  navigator.clipboard.writeText(`![image](${realUrl})`);
  successAlert("Copy Success");
};

const toDelete = () => {
  console.log("todelete");
  showDeleteDialog.value = true;
  deleteImage.value = image;
};
</script>

<style scoped>
#manager-menu {
  position: absolute;
  background-color: rgba(208, 78, 137, 0.8);
  border: 1px solid #ccc;
  padding: 5px;
  border-radius: 5px;
  z-index: 9999; /* make sure it appears on top of other elements */
}

.menu {
  color: #fff;
  text-align: center;
  margin: 0.1rem;
  padding: 0.5rem 1.5rem 0.5rem 1rem;
  border-radius: 5px;
  cursor: pointer;
}

.menu:hover {
  background: rgba(208, 78, 137, 0.5);
}
</style>
