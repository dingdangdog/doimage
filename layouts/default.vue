<script setup lang="ts">
import { warningAlert } from "../utils";

const loading = ref(true);
onMounted(() => {
  loading.value = false;
});

const router = useRouter();
const route = useRoute();
const { locale, setLocale } = useI18n();

const tab = ref(route.path === "/" ? "login" : route.path.replace("/", ""));

const toPage = (path: string) => {
  tab.value = path;
  router.push(path === "login" ? "/" : `/${path}`);
};

const logout = () => {
  warningAlert("Logout");
  window.localStorage.removeItem("key");
  router.push(`/`);
};

const changeLang = () => {
  setLocale(locale.value === "zh" ? "en" : "zh");
};

const toGithub = () => {
  window.open("https://github.com/dingdangdog/Doimage", "_blank");
};
</script>

<template>
  <div class="rounded-md flex flex-col h-screen">
    <header
      class="bg-[rgba(242,197,211,0.5)] shadow-md flex justify-between items-center p-2 md:p-4 rounded-t-md"
    >
      <div class="flex items-center">
        <img
          :src="'/Doimage.png'"
          :width="40"
          class="aspect-square object-cover mr-2"
          alt="Logo"
        />
        <h2 class="hidden lg:block font-bold text-xl text-gray-800">
          {{ $t("title") }}
        </h2>
      </div>

      <nav class="space-x-2 md:space-x-4">
        <button
          class="text-lg md:text-xl text-gray-700 hover:text-white hover:bg-[rgba(246,70,124,0.7)] px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
          :class="{ 'bg-[rgba(246,70,124)] text-white': tab === 'login' }"
          @click="toPage('login')"
        >
          {{ $t("menu.login") }}
        </button>
        <button
          class="text-lg md:text-xl text-gray-700 hover:text-white hover:bg-[rgba(246,70,124,0.7)] px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
          :class="{ 'bg-[rgba(246,70,124)] text-white': tab === 'upload' }"
          @click="toPage('upload')"
        >
          {{ $t("menu.upload") }}
        </button>
        <button
          class="text-lg md:text-xl text-gray-700 hover:text-white hover:bg-[rgba(246,70,124,0.7)] px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
          :class="{ 'bg-[rgba(246,70,124)] text-white': tab === 'store' }"
          @click="toPage('store')"
        >
          {{ $t("menu.store") }}
        </button>
        <button
          class="text-lg md:text-xl text-gray-700 hover:text-white hover:bg-[rgba(246,70,124,0.7)] px-3 py-2 rounded-md text-sm font-medium focus:outline-none"
          :class="{ 'bg-[rgba(246,70,124)] text-white': tab === 'donate' }"
          @click="toPage('donate')"
        >
          Donate
        </button>
      </nav>

      <div class="hidden md:flex flex items-center space-x-2 md:space-x-4">
        <div class="relative" v-if="locale == 'zh'">
          <!-- <span
            class="absolute hidden bg-gray-800 text-white text-xs rounded py-1 px-2 w-max bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 group-hover:block"
            >Change to English</span
          > -->
          <button
            @click="changeLang"
            title="Click Change Language"
            class="group relative w-8 h-8 cursor-pointer rounded-full hover:bg-[rgba(246,70,124,0.2)] focus:outline-none"
          >
            En
          </button>
        </div>
        <div class="relative" v-else>
          <!-- <span
            class="absolute hidden bg-gray-800 text-white text-xs rounded py-1 px-2 w-max bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 group-hover:block"
            >切换中文</span
          > -->
          <button
            @click="changeLang"
            title="点击切换语言"
            class="group relative w-8 h-8 cursor-pointer rounded-full hover:bg-[rgba(246,70,124,0.2)] focus:outline-none"
          >
            简
          </button>
        </div>

        <div class="relative">
          <span
            class="absolute hidden bg-gray-800 text-white text-xs rounded py-1 px-2 w-max bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 group-hover:block"
            >To Github</span
          >
          <button
            @click="toGithub"
            class="group relative m-1 p-2 cursor-pointer rounded-full hover:bg-[rgba(246,70,124,0.2)] focus:outline-none"
          >
            <IconGithub class="w-8 h-8" :color="`rgb(243 244 246)`" />
          </button>
        </div>

        <div class="relative">
          <span
            class="absolute hidden bg-gray-800 text-white text-xs rounded py-1 px-2 w-max bottom-full left-1/2 -translate-x-1/2 mb-1 z-10 group-hover:block"
            >Logout</span
          >
          <button
            @click="logout"
            class="group relative m-1 p-2 cursor-pointer rounded-full hover:bg-[rgba(246,70,124,0.2)] focus:outline-none"
          >
            <IconExit class="w-8 h-8" color="#f6467c" />
          </button>
        </div>
      </div>
    </header>

    <main class="flex-grow overflow-auto">
      <div v-show="loading" class="text-center pt-[10vh]">Loading</div>
      <div v-show="!loading" class="h-full"><slot></slot></div>
      <GlobalAlert />
    </main>
  </div>
</template>
