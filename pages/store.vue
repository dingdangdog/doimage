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
  size: 30,
});

const changeFolder = () => {
  if (!folder.value) {
    return;
  }
  // console.log(folder.value);
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
  // if (window.innerWidth > 1280) {
  //   menuPosition.value.x;
  // }
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
  <div
    class="flex flex-col h-full bg-gradient-to-t from-pink-100 via-pink-50 to-white"
  >
    <!-- Folder Select and Refresh Section -->
    <div
      class="flex justify-center items-center space-x-2 w-full max-w-xl mx-auto p-2 bg-white shadow-md rounded-lg"
    >
      <!-- Folder Select Dropdown -->
      <select
        class="block w-full bg-gradient-to-r from-pink-100 to-pink-50 text-gray-700 py-3 px-4 pr-8 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-pink-400"
        v-model="folder"
        @change="changeFolder"
      >
        <option v-for="item in folders" :key="item" :value="item">
          {{ item }}
        </option>
      </select>

      <!-- Refresh Button -->
      <button
        class="border border-pink-500 text-pink-500 hover:bg-pink-100 font-semibold rounded-full p-2 focus:outline-none focus:shadow-outline transition"
        @click="refresh"
      >
        <IconRefresh class="w-6 h-6" color="rgba(246, 70, 124)" />
      </button>
    </div>

    <!-- Image Gallery Section -->
    <div
      class="mt-2 flex flex-wrap justify-left max-h-[80vh] p-4 overflow-y-auto border border-gray-300 rounded-md"
    >
      <div v-if="images.length <= 0" class="text-gray-500 text-lg">
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

    <!-- Pagination Section -->
    <div class="w-full px-4 sm:px-8 py-6">
      <div
        class="flex flex-col sm:flex-row justify-center items-center space-x-2 bg-white p-4 rounded-xl shadow-lg"
      >
        <!-- Pagination Controls -->
        <div class="flex items-center space-x-3 mt-4 sm:mt-0">
          <!-- Previous Page Button -->
          <button
            class="pagination-btn text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 rounded-lg p-2"
            :disabled="pageParam.page <= 1"
            @click="pageDown"
          >
            <IconLeft class="w-6 h-6" />
          </button>

          <!-- Page Numbers -->
          <div class="text-sm text-gray-700">
            <span>{{ $t("page.num") }}:</span>
            <span class="font-semibold">{{ pageParam.page }}</span> /
            <span class="font-semibold">{{
              Math.ceil(total / pageParam.size)
            }}</span>
          </div>

          <!-- Next Page Button -->
          <button
            class="pagination-btn text-white bg-pink-500 hover:bg-pink-600 focus:ring-4 focus:ring-pink-300 rounded-lg p-2"
            :disabled="pageParam.page >= Math.ceil(total / pageParam.size)"
            @click="pageUp"
          >
            <IconRight class="w-6 h-6" />
          </button>
        </div>

        <!-- Jump to Page -->
        <div class="flex space-x-2 items-center">
          <!-- Total and Size Info -->
          <div class="text-sm">
            <strong>{{ $t("page.total") }}:</strong> {{ total }}
          </div>
          <div class="text-sm">
            <strong>{{ $t("page.size") }}:</strong> {{ pageParam.size }}
          </div>
          <button
            @click="jumpPageDialog = true"
            class="text-sm text-pink-500 cursor-pointer focus:outline-none hover:underline"
          >
            {{ $t("page.jump") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Jump Page Dialog -->
    <div
      v-if="jumpPageDialog"
      class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
    >
      <div class="bg-white rounded-lg p-6 shadow-xl min-w-[20rem] max-w-lg">
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ $t("page.jump") }}
        </h3>
        <div class="mb-4">
          <input
            type="number"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-pink-500"
            :placeholder="$t('page.num')"
            v-model.number="jumpPage"
          />
        </div>
        <div class="flex justify-end space-x-4">
          <button
            class="bg-transparent hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded focus:outline-none"
            @click="jumpPageDialog = false"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            class="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-pink-400"
            @click="toJumpPage"
          >
            {{ $t("common.confirm") }}
          </button>
        </div>
      </div>
    </div>

    <!-- Fullscreen Image Overlay -->
    <div
      v-if="fullscrenn"
      class="overlay fixed z-50 top-0 left-0 w-full h-full bg-black bg-opacity-80 text-center flex items-center justify-center"
    >
      <img
        :src="fullscreenImage"
        alt="Fullscreen Image"
        class="fullscreen-image max-w-full max-h-full m-auto block"
      />
      <span
        class="close-button text-red-500 text-3xl absolute top-2 right-5 cursor-pointer"
        @click="closeFullscreen"
        >&times;</span
      >
    </div>

    <!-- Image Context Menu -->
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

<style scoped></style>
