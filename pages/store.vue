<script setup lang="ts">
import {
  doApi,
  errorAlert,
  warningAlert,
  check,
  showDeleteDialog,
} from "../utils";

const jumpPageDialog = ref(false);
const jumpPage = ref(1);
const toJumpPage = () => {
  if (jumpPage.value > Math.ceil(total.value / pageParam.value.size)) {
    warningAlert("Invalid Page Number");
  } else {
    pageParam.value.page = jumpPage.value;
    jumpPageDialog.value = false;
  }
};

const folders = ref<any[]>([]);
const folder = ref(""); // Initialize as empty string
const images = ref<any[]>([]);

const total = ref(0);
const pageParam = ref({
  page: 1,
  size: 40,
});

const changeFolder = () => {
  if (!folder.value) {
    return;
  }
  window.localStorage.setItem("folder", folder.value);
  getImages();

  doApi("/api/getTotalImage", { folder: folder.value })
    .then((res) => {
      total.value = Number(res);
    })
    .catch((err) => {
      errorAlert("Api Error");
    });
};

const refresh = () => {
  changeFolder();
};

const pageUp = () => {
  if (pageParam.value.page < Math.ceil(total.value / pageParam.value.size)) {
    pageParam.value.page++;
    if (pageParam.value.page > Math.ceil(total.value / pageParam.value.size)) {
      pageParam.value.page = Math.ceil(total.value / pageParam.value.size);
      warningAlert("This is the last page");
    }
  } else {
    warningAlert("No more page");
  }
};
const pageDown = () => {
  if (pageParam.value.page > 1) {
    pageParam.value.page--;
  } else {
    warningAlert("No pre page");
  }
};

const fullscrenn = ref(false);
const fullscreenImage = ref("");
const openFullscreen = (image: string) => {
  fullscrenn.value = true;
  fullscreenImage.value = image.replace("/thumbs", "");
  window.addEventListener("keydown", handleKeydown);
};
const closeFullscreen = () => {
  fullscrenn.value = false;
  window.removeEventListener("keydown", handleKeydown);
};

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === "Escape" && fullscrenn.value) {
    fullscrenn.value = false;
  }
};

const selectImage = ref("");
const showImageMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });
const showMenu = (image: string, event: MouseEvent) => {
  selectImage.value = image;
  menuPosition.value = { x: event.clientX, y: event.clientY - 64 };
  if (window.innerWidth > 1280) {
    menuPosition.value.x -= 256;
  }
  showImageMenu.value = true;
};

onMounted(() => {
  check();
  doApi("/api/getFolders", {})
    .then((res) => {
      folders.value = Array.isArray(res) ? res : [];
      if (folders.value.length > 0) {
        folder.value = String(
          window.localStorage.getItem("folder") || folders.value[0]
        ); // Select first folder if no folder in localStorage and folders are available
        changeFolder(); // Load images for the initial folder
      }
    })
    .catch((err) => {
      errorAlert("Api Error");
    });

  document.addEventListener("click", (event) => {
    showImageMenu.value = false;
  });
});

watch(pageParam.value, () => {
  getImages();
});

const getImages = () => {
  if (!folder.value) return; // Prevent API call if folder is not selected

  doApi("/api/getImages", {
    folder: folder.value,
    start: (pageParam.value.page - 1) * pageParam.value.size,
    num: pageParam.value.size,
  })
    .then((res) => {
      images.value = Array.isArray(res) ? res : [];
    })
    .catch(() => {
      errorAlert("Api Error");
    });
};
</script>

<template>
  <div class="main-page flex flex-col h-full">
    <div class="flex justify-center items-center w-full">
      <div class="max-w-lg min-w-[20rem] w-full">
        <div class="relative">
          <select
            class="block appearance-none w-full bg-[rgba(242,197,211,0.5)] border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
            :value="folder"
            @change="changeFolder"
          >
            <option v-for="item in folders" :key="item" :value="item">
              {{ item }}
            </option>
          </select>
          <div
            class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
          >
            <svg
              class="fill-current h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path
                d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
              />
            </svg>
          </div>
        </div>
      </div>

      <div class="relative group">
        <span
          class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 w-max bottom-full left-1/2 -translate-x-1/2 mb-1 z-10"
        >
          {{ $t("store.refresh") }}
        </span>
        <button
          class="m-2 mt-[-1rem] border border-[rgba(246,70,124)] text-[rgba(246,70,124)] hover:bg-[rgba(246,70,124,0.1)] font-semibold rounded-full p-2 focus:outline-none focus:shadow-outline"
          @click="refresh"
        >
          <IconRefresh class="w-6 h-6" color="rgba(246, 70, 124)" />
        </button>
      </div>
    </div>

    <div
      class="images-container flex-grow flex flex-wrap justify-center p-2 max-h-screen overflow-y-auto border border-gray-300 rounded-md"
    >
      <div v-if="images.length <= 0" class="text-gray-500">
        {{ $t("store.images-container") }}
      </div>
      <ImageCard
        v-for="image in images"
        :key="image"
        :image="image"
        @click="openFullscreen(image)"
        @contextmenu.prevent="showMenu(image, $event)"
      />
    </div>
    <div class="w-full">
      <div class="flex items-center justify-center flex-wrap pt-4">
        <div class="text-right text-gray-700">
          {{ $t("page.total") }}:{{ total }}
        </div>
        <div class="min-w-[3rem] text-center mx-2 text-gray-700">
          {{ $t("page.size") }}:{{ pageParam.size }}
        </div>
        <div class="flex items-center flex-wrap mx-2">
          <button
            class="page-action-icon cursor-pointer m-0.5 text-[rgba(246,70,124)] hover:text-[rgba(246,70,124,0.7)] focus:outline-none"
            @click="pageDown"
          >
            <IconLeft class="w-6 h-6" color="rgba(246, 70, 124)" />
          </button>
          <div class="min-w-[3rem] text-center text-gray-700">
            {{ $t("page.num") }}:{{ pageParam.page }}
          </div>
          <button
            class="page-action-icon cursor-pointer m-0.5 text-[rgba(246,70,124)] hover:text-[rgba(246,70,124,0.7)] focus:outline-none"
            @click="pageUp"
          >
            <IconRight class="w-6 h-6" color="rgba(246, 70, 124)" />
          </button>
        </div>
        <button
          @click="jumpPageDialog = true"
          class="text-sm text-[rgba(246,70,124)] cursor-pointer focus:outline-none"
        >
          跳页
        </button>
      </div>
    </div>
    <div
      v-if="jumpPageDialog"
      class="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center"
    >
      <div
        class="fixed inset-0 bg-black opacity-50"
        @click="jumpPageDialog = false"
      ></div>
      <div
        class="bg-[rgba(255,208,223,0.5)] rounded-lg p-4 shadow-xl z-10 min-w-[20rem] max-w-lg"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ $t("store.jump-page") }}
        </h3>
        <div class="mb-4">
          <div class="relative">
            <input
              type="number"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :placeholder="$t('page.num')"
              v-model.number="jumpPage"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <button
            class="bg-transparent hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded focus:outline-none focus:shadow-outline mr-2"
            @click="jumpPageDialog = false"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            @click="toJumpPage"
          >
            {{ $t("common.confirm") }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="overlay fixed z-40 top-0 left-0 w-full h-full bg-black bg-opacity-80 text-center"
      v-if="fullscrenn"
    >
      <img
        :src="fullscreenImage"
        alt="Fullscreen Image"
        class="fullscreen-image max-w-full max-h-full m-auto block absolute top-0 left-0 right-0 bottom-0"
      />
      <span
        class="close-button color-gray-300 text-3xl absolute top-2 right-5 cursor-pointer"
        @click="closeFullscreen"
        >&times;</span
      >
    </div>
    <ImageMenu
      v-if="showImageMenu"
      :showMenu="showImageMenu"
      :image="selectImage"
      :x="menuPosition.x"
      :y="menuPosition.y"
    />
    <DeleteDialog v-if="showDeleteDialog" />
  </div>
</template>

<style scoped>
/* Tailwind classes used - стили перенесены в template */
</style>
