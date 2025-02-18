<script setup lang="ts">
import {
  doApi,
  showDeleteDialog,
  deleteImage,
  warningAlert,
  errorAlert,
} from "../utils";

const delImage = () => {
  doApi("/api/delImage", { url: deleteImage.value })
    .then(() => {
      warningAlert("Delete Success");
    })
    .catch((err) => {
      errorAlert("Api Error");
    })
    .finally(() => {
      showDeleteDialog.value = false;
    });
};
</script>

<template>
  <div v-if="showDeleteDialog" class="fixed z-50 inset-0 overflow-y-auto">
    <div class="flex items-center justify-center min-h-screen px-4">
      <div class="fixed inset-0 transition-opacity" aria-hidden="true">
        <div class="absolute inset-0 bg-gray-500 opacity-75"></div>
      </div>

      <div
        class="bg-white rounded-lg shadow-xl overflow-hidden transform transition-all sm:max-w-lg sm:w-full"
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-dialog-title"
      >
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <div class="sm:flex sm:items-start">
            <div
              class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10"
            >
              <IconDelete class="h-6 w-6" color="rgba(246, 70, 124)" />
            </div>
            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <h3
                class="text-lg leading-6 font-medium text-gray-900"
                id="delete-dialog-title"
              >
                删除确认
              </h3>
              <div class="mt-2">
                <p class="text-sm text-gray-500">
                  确定删除当前选择的图片？删除后无法恢复！
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            class="ml-2 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            @click="delImage"
          >
            确定
          </button>
          <button
            type="button"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
            @click="showDeleteDialog = false"
          >
            取消
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
```
