<template>
  <div
    v-if="showDialog"
    class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
  >
    <div class="bg-white p-6 rounded-lg shadow-lg w-96">
      <h3 class="text-lg font-semibold text-pink-700">新建文件夹</h3>
      <input
        type="text"
        class="mt-3 w-full rounded-lg border border-pink-300 px-4 py-2 text-gray-900 shadow-sm focus:border-pink-500 focus:ring-pink-500"
        placeholder="请输入文件夹名称"
        v-model="newFolder"
      />
      <div class="mt-5 flex justify-end space-x-3">
        <button
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
          @click="closeDialog"
        >
          取消
        </button>
        <button
          class="px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
          @click="addFolder"
        >
          确定
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const newFolder = ref("");
const { showDialog } = defineProps(["showDialog"]);
const emit = defineEmits(["add-folder", "close-dialog"]);

const addFolder = () => {
  doApi("/api/addFolder", { folder: newFolder.value })
    .then(() => {
      closeDialog();
      newFolder.value = "";
      emit("add-folder");
    })
    .catch((err) => {
      errorAlert("Api Error");
    });
};

const closeDialog = () => {
  console.log("closeDialog");
  emit("close-dialog");
};
</script>
