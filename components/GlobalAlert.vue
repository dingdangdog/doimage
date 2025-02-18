<script setup lang="ts">
import { type AlertInfo, newAlert } from "../utils";

// 定义 Map，存储Alert信息集合，使用Map便于删除
const alertMap = ref<Map<string, AlertInfo>>(new Map());

// 监听新Alert创建
watch(newAlert.value, () => {
  alertMap.value.set(newAlert.value.id, { ...newAlert.value });
  // console.log(alertMap.value);
  deleteAlert(newAlert.value.id);
});

const deleteAlert = (id: string) => {
  // console.log(id);
  setTimeout(() => {
    alertMap.value.delete(id);
  }, 3000);
};
</script>

<template>
  <div class="fixed bottom-[5%] left-[5%] alert-container md:left-[5%]">
    <div
      v-for="(alert, index) in Array.from(alertMap.values())"
      :key="index"
      class="mb-1 alert-box z-[9999] border-l-4 p-4 rounded-md shadow-lg flex items-center justify-between"
      :class="{
        'bg-green-50 border-green-500 text-green-700': alert.type === 'success',
        'bg-red-50 border-red-500 text-red-700': alert.type === 'error',
        'bg-yellow-50 border-yellow-500 text-yellow-700':
          alert.type === 'warning',
        'bg-blue-50 border-blue-500 text-blue-700': alert.type === 'info',
      }"
      role="alert"
    >
      <div class="flex items-center">
        <strong class="font-bold mr-2 capitalize"> {{ alert.type }}: </strong>
        <span class="block sm:inline align-middle">{{ alert.message }}</span>
      </div>
      <button
        class="ml-2 text-gray-500 hover:text-gray-700 focus:outline-none"
        @click="deleteAlert(alert.id)"
        aria-label="Close Alert"
      >
        <svg
          class="h-4 w-4 fill-current"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 12.293a1 1 0 01-1.414-1.414L7.172 10 4.293 7.172a1 1 0 010-1.414z"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped></style>
