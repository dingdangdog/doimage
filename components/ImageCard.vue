<script setup lang="ts">
const { image } = defineProps<{ image?: string }>();
const loading = ref(true);

const onLoad = () => {
  loading.value = false;
};
</script>

<template>
  <div class="m-2 w-[10rem] h-[8rem] border border-[#f6467c] rounded-sm">
    <div
      class="relative image bg-[rgba(242,197,211,0.5)] p-2 rounded-sm cursor-pointer overflow-hidden"
    >
      <img
        v-if="!loading"
        :src="image"
        alt="image card"
        class="aspect-square w-full h-full object-cover rounded-sm"
        @load="onLoad"
      />
      <div
        v-if="loading"
        class="absolute inset-0 flex justify-center items-center rounded-sm bg-gray-100"
      >
        <div
          class="w-12 h-12 h-12 border-b-2 border-gray-300 border-opacity-50 rounded-full animate-spin"
        ></div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
