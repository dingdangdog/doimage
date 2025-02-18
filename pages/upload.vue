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

const showAddFolder = () => {
  showAddFolderDialog.value = true;
};
const addFolder = () => {
  showAddFolderDialog.value = false;
  getFolders();
};
const closeAddFolderDialog = () => {
  showAddFolderDialog.value = false;
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
  <div class="bg-gray-50 h-full flex flex-col">
    <!-- Header Section -->
    <div class="max-w-5xl w-full mx-auto sm:px-6 lg:px-8 py-6 flex-grow">
      <div class="bg-white shadow-lg rounded-lg mb-8">
        <div class="p-6 border-b border-gray-200 bg-gray-100">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ $t("upload.settings") }}
          </h3>
        </div>

        <!-- Watermark Settings -->
        <div class="space-y-6 bg-white p-6 rounded-xl shadow-md">
          <!-- Watermark Input -->
          <div>
            <label
              for="watermark"
              class="block text-sm font-semibold text-gray-800"
            >
              水印
            </label>
            <div class="mt-2 relative">
              <input
                type="text"
                id="watermark"
                class="block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="请输入水印文字"
                v-model="watermark"
              />
            </div>
          </div>

          <!-- Watermark Option -->
          <fieldset class="p-4 border border-gray-300 rounded-lg bg-gray-50">
            <legend class="text-sm font-semibold text-gray-800">
              水印选项
            </legend>
            <div class="mt-3 flex space-x-6">
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  id="setmark"
                  name="watermark-option"
                  type="radio"
                  value="1"
                  v-model="addWatermark"
                  class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="text-gray-700 text-sm font-medium">添加水印</span>
              </label>
              <label class="flex items-center space-x-2 cursor-pointer">
                <input
                  id="unsetmark"
                  name="watermark-option"
                  type="radio"
                  value="2"
                  v-model="addWatermark"
                  class="h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                />
                <span class="text-gray-700 text-sm font-medium"
                  >不添加水印</span
                >
              </label>
            </div>
          </fieldset>

          <!-- Folder Select -->
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label
                for="folderSelect"
                class="block text-sm font-semibold text-gray-800"
              >
                选择文件夹
              </label>
              <select
                id="folderSelect"
                class="mt-2 block w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                :value="folder"
                @change="changeFolder"
              >
                <option v-for="item in folders" :key="item" :value="item">
                  {{ item }}
                </option>
              </select>
            </div>

            <div class="flex justify-start sm:justify-end">
              <button
                class="inline-flex items-center px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
                @click="showAddFolder"
              >
                <svg
                  class="h-5 w-5 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                    clip-rule="evenodd"
                  />
                </svg>
                添加文件夹
              </button>
            </div>
          </div>

          <div
            @dragover.prevent="dragOver = true"
            @dragleave="dragOver = false"
            @drop.prevent="handleDrop"
            @click.stop="$refs.fileInput.click()"
            class="mt-6 border-2 border-dashed rounded-lg p-8 text-center cursor-pointer bg-gray-50 hover:bg-indigo-100/50 hover:border-indigo-700 transition-all ease-in-out"
            :class="{
              'border-indigo-700 bg-blue-50': dragOver,
              'border-gray-300': !dragOver,
            }"
          >
            <input
              type="file"
              multiple
              accept="image/*"
              @change="handleFileChange"
              class="hidden"
              ref="fileInput"
            />
            <div
              class="text-gray-500 transition-all"
              :class="{
                'my-0': selectIamges.length > 0,
                'my-16': selectIamges.length === 0,
              }"
            >
              <p>
                <!-- {{ $t("watermark.upload-tip") }} -->
                拖拽或
                <button
                  type="button"
                  @click.stop="$refs.fileInput.click()"
                  class="text-purple-800 font-semibold hover:text-purple-700 focus:outline-none"
                >
                  上传图片
                </button>
              </p>
              <p class="text-sm mt-2"></p>
            </div>
          </div>
          <div class="flex justify-center mt-4">
            <button
              class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
              :disabled="uploading"
              @click="uploadImages"
            >
              {{ $t("upload.upload") }}
            </button>
          </div>
        </div>
      </div>

      <!-- File Upload Section -->
      <div class="bg-white shadow-lg rounded-lg mb-8">
        <div class="p-6 border-b border-gray-200 bg-gray-100">
          <h3 class="text-xl font-semibold text-gray-900">
            {{ $t("upload.upload_result_title") }}
          </h3>
        </div>
        <!-- Result Display -->
        <div class="bg-white overflow-hidden shadow-lg rounded-lg mb-8">
          <div class="p-6">
            <div
              v-if="resIamges.length <= 0"
              class="text-gray-500 py-4 text-center"
            >
              {{ $t("upload.upload-result") }}
            </div>
            <div
              v-else
              class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
            >
              <ImageCard
                v-for="image in resIamges"
                :key="image"
                :image="image"
                @click="openFullscreen(image)"
                @contextmenu.prevent="showMenu(image, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Fullscreen Image View -->
  <div
    class="overlay fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 text-center z-50 flex justify-center items-center"
    v-if="fullscrenn"
  >
    <img
      :src="fullscreenImage"
      alt="Fullscreen Image"
      class="fullscreen-image max-w-full max-h-full m-auto block rounded-lg"
    />
    <span
      class="close-button text-gray-100 text-4xl absolute top-6 right-10 cursor-pointer"
      @click="closeFullscreen"
      >&times;</span
    >
  </div>

  <!-- Image Menu -->
  <ImageMenu
    v-if="showImageMenu"
    :showMenu="showImageMenu"
    :image="selectImage"
    :x="menuPosition.x"
    :y="menuPosition.y"
  />
  <!-- Delete Dialog -->
  <DeleteDialog v-if="showDeleteDialog" />
  <AddFolderDialog
    v-if="showAddFolderDialog"
    :addFolder="addFolder"
    :close-dialog="closeAddFolderDialog"
  />
</template>
