<script setup lang="ts">
const serverKey = ref("");
const login = () => {
  window.localStorage.setItem("key", serverKey.value);
  check();
};

onMounted(() => {
  serverKey.value = window.localStorage.getItem("key") || "";
});
</script>

<template>
  <div class="bg-gray-100 h-full flex items-center justify-center">
    <div
      class="index-container bg-white p-8 rounded-lg shadow-md w-full max-w-md -mt-40"
    >
      <div class="text-center row-input mb-4">
        <div class="relative">
          <input
            type="text"
            class="bg-[rgba(242,197,211,0.5)] shadow appearance-none border rounded w-full py-2 px-3 pl-10 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            :placeholder="$t('login.key')"
            v-model="serverKey"
            @keyup.enter="login"
            clearable
          />
          <div
            class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"
          >
            <IconKey class="w-6 h-6" color="rgba(246, 70, 124)" />
          </div>
        </div>
      </div>

      <div class="text-center">
        <button
          class="bg-transparent hover:bg-[rgba(246,70,124,0.7)] text-[rgba(246,70,124)] font-semibold hover:text-white py-2 px-4 border border-[rgba(246,70,124)] hover:border-transparent rounded focus:outline-none focus:shadow-outline"
          @click="login"
        >
          {{ $t("login.login") }}
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
