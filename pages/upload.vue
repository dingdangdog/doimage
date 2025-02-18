<script setup lang="ts">
import {
  doApi,
  errorAlert,
  successAlert,
  check,
  encryptBySHA256,
  showDeleteDialog,
} from "../utils";

const rules = ref([
  (value: File[]) => {
    for (let file of value) {
      if (file.size > 50000000) {
        return `${file.name} size should be less than 50 MB!`;
      }
    }
    return true;
  },
]);

const folders = ref<any[]>([]);
const folder = ref("");
const watermark = ref("");
const addWatermark = ref("2");
const resIamges = ref<any[]>([]);
const selectIamges = ref<File[]>([]);
const uploading = ref(false);
const showAddFolderDialog = ref(false);
const newFolder = ref("");
const addFolder = () => {
  doApi("/api/addFolder", { folder: newFolder.value })
    .then(() => {
      showAddFolderDialog.value = false;
      folder.value = newFolder.value;
      newFolder.value = "";
      getFolders();
    })
    .catch((err) => {
      errorAlert("Api Error");
    });
};

const showAddFolder = () => {
  showAddFolderDialog.value = true;
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target && target.files) {
    selectIamges.value = Array.from(target.files);
  }
};

const uploadImages = () => {
  uploading.value = true;

  if (!folder.value || selectIamges.value.length <= 0) {
    errorAlert("Please select folder and upload images");
    uploading.value = false;
    return;
  }
  const formdata = new FormData();
  const time = String(Date.now());
  formdata.append("folder", folder.value);
  selectIamges.value.forEach((file) => {
    formdata.append("images", file);
  });
  formdata.append("time", time);
  if (addWatermark.value == "1") {
    // 设置水印
    formdata.append("watermark", watermark.value);
  }
  $fetch("/api/uploadImages", {
    method: "POST",
    headers: {
      Authorization: encryptBySHA256(
        window.localStorage.getItem("key") || "",
        time
      ),
    },
    body: formdata,
  })
    .then((res) => {
      successAlert("Success");
      resIamges.value = Array.isArray(res) ? res : [];
      window.localStorage.setItem("folder", folder.value);
      if (addWatermark.value == "1") {
        window.localStorage.setItem("watermark", watermark.value);
      }
    })
    .catch((err) => {
      errorAlert("Api Error");
    })
    .finally(() => {
      uploading.value = false;
    });
};

const getFolders = () => {
  doApi("/api/getFolders", {})
    .then((res) => {
      folders.value = Array.isArray(res) ? res : [];
    })
    .catch((err) => {
      errorAlert("Api Error");
    });
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
  getFolders();

  folder.value = String(window.localStorage.getItem("folder") || "");
  watermark.value = window.localStorage.getItem("watermark") || "";
  // 隐藏菜单
  document.addEventListener("click", (event) => {
    showImageMenu.value = false;
  });
});
</script>

<template>
  <div class="main-page">
    <div class="w-full p-2">
      <div class="flex flex-col sm:flex-row">
        <div class="w-full sm:w-1/2 px-2">
          <div class="relative">
            <input
              type="text"
              class="bg-[rgba(242, 197, 211, 0.5)] shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :placeholder="$t('upload.watermark')"
              v-model="watermark"
            />
            <div
              class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"
            >
              <IconWatermark class="w-6 h-6" color="rgba(246, 70, 124)" />
            </div>
          </div>
        </div>
        <div class="w-full sm:w-1/3 px-2 flex items-center justify-center">
          <div class="text-center">
            <div class="inline-flex items-center">
              <input
                type="radio"
                id="setmark"
                value="1"
                v-model="addWatermark"
                class="form-radio h-5 w-5 text-[rgba(246, 70, 124)] focus:ring-0"
              />
              <label for="setmark" class="ml-2 text-gray-700">{{
                $t("upload.setmark")
              }}</label>
            </div>
            <div class="inline-flex items-center ml-4">
              <input
                type="radio"
                id="unsetmark"
                value="2"
                v-model="addWatermark"
                class="form-radio h-5 w-5 text-[rgba(246, 70, 124)] focus:ring-0"
              />
              <label for="unsetmark" class="ml-2 text-gray-700">{{
                $t("upload.unsetmark")
              }}</label>
            </div>
          </div>
        </div>
      </div>
      <div class="flex flex-col sm:flex-row mt-2">
        <div class="w-full sm:w-5/12 px-2">
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
        <div class="w-full sm:w-1/12 px-2 flex items-center justify-center">
          <div class="text-center">
            <div class="relative group">
              <span
                class="absolute hidden group-hover:block bg-gray-800 text-white text-xs rounded py-1 px-2 w-max bottom-full left-1/2 -translate-x-1/2 mb-1 z-10"
              >
                {{ $t("upload.add-folder") }}
              </span>
              <button
                class="border border-[rgba(246,70,124)] text-[rgba(246,70,124)] hover:bg-[rgba(246,70,124,0.1)] font-semibold rounded-full p-2 focus:outline-none focus:shadow-outline"
                @click="showAddFolder"
              >
                <IconPlus class="w-6 h-6" color="rgba(246, 70, 124)" />
              </button>
            </div>
          </div>
        </div>
        <div class="w-full sm:w-4/12 px-2">
          <div class="relative">
            <input
              type="file"
              class="bg-[rgba(242, 197, 211, 0.5)] shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :placeholder="$t('upload.select-image')"
              @change="handleFileChange"
              accept="image/png, image/jpeg, image/bmp, image/webp, image/gif, image/avif, image/apng, image/svg+xml, image/tiff, image/x-icon, image/vnd.microsoft.icon"
              multiple
            />
            <div
              class="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center"
            >
              <IconImages class="w-6 h-6" color="rgba(246, 70, 124)" />
            </div>
          </div>
        </div>
        <div
          class="w-full sm:w-2/12 px-2 flex items-center justify-center mt-2 sm:mt-0"
        >
          <div class="text-center">
            <button
              class="bg-transparent hover:bg-[rgba(246,70,124,0.7)] text-[rgba(246,70,124)] font-semibold hover:text-white py-2 px-4 border border-[rgba(246,70,124)] hover:border-transparent rounded focus:outline-none focus:shadow-outline"
              :disabled="uploading"
              @click="uploadImages"
            >
              {{ $t("upload.upload") }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <div
      class="images-container flex-grow flex flex-wrap justify-center max-h-screen w-full p-2 m-2 overflow-y-auto border border-gray-300 rounded-md"
    >
      <div v-if="resIamges.length <= 0" class="text-gray-500">
        {{ $t("upload.upload-result") }}
      </div>

      <ImageCard
        v-for="image in resIamges"
        :key="image"
        :image="image"
        @click="openFullscreen(image)"
        @contextmenu.prevent="showMenu(image, $event)"
      />
    </div>

    <div
      v-if="showAddFolderDialog"
      class="fixed z-50 inset-0 overflow-y-auto flex items-center justify-center"
    >
      <div
        class="fixed inset-0 bg-black opacity-50"
        @click="showAddFolderDialog = false"
      ></div>
      <div
        class="bg-white rounded-lg p-4 shadow-xl z-10 min-w-[20rem] max-w-lg bg-[rgba(255,208,223,0.5)]"
      >
        <h3 class="text-lg font-semibold text-gray-900 mb-2">
          {{ $t("upload.add-folder") }}
        </h3>
        <div class="mb-4">
          <div class="relative">
            <input
              type="text"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :placeholder="$t('upload.folder-name')"
              v-model="newFolder"
            />
          </div>
        </div>
        <div class="flex justify-end">
          <button
            class="bg-transparent hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded focus:outline-none focus:shadow-outline mr-2"
            @click="showAddFolderDialog = false"
          >
            {{ $t("common.cancel") }}
          </button>
          <button
            class="bg-[rgba(246,70,124,0.5)] hover:bg-[rgba(246,70,124,0.7)] text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            @click="addFolder"
          >
            {{ $t("common.add") }}
          </button>
        </div>
      </div>
    </div>

    <div
      class="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 text-center z-40"
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
```
