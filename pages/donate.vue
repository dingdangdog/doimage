<template>
  <div class="max-w-4xl mx-auto h-full">
    <iframe
      :src="`https://oldmoon.top${locale ? '/' + locale : ''}/idonate`"
      class="w-full h-full"
    ></iframe>
  </div>
</template>

<script setup lang="ts">
// 获取i18n的当前code
const { locale } = useI18n();
</script>

<style scoped></style>
