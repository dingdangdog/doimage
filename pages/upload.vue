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

const folders = ref<any[]>([]); // 可选文件夹
const folder = ref(""); // 选中的上传文件夹
const watermark = ref(""); // 水印内容
const addWatermark = ref("2"); // 是否添加水印，1开启，2不开启

const resIamges = ref<any[]>([]); // 上传结果
const selectIamges = ref<File[] | any[]>([]); // 选中的上传文件
const uploading = ref(false); // 上传中

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
    menuPosition.value.x -= 64;
  }
  showImageMenu.value = true;
};

const dragOver = ref(false);
// 处理拖放文件
const handleDrop = async (e: any) => {
  dragOver.value = false;
  const files = Array.from(e.dataTransfer.files);
  selectIamges.value = files; // 存储 File 对象，而不是 URL
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
  <div class="bg-gray-50 h-full flex flex-col p-2">
    <!-- Header Section -->
    <div
      class="max-w-5xl w-full mx-auto p-2 md:p-6 bg-pink-50 rounded-xl shadow-lg space-y-3 flex-grow"
    >
      <h3 class="text-xl font-semibold text-gray-900">上传配置</h3>
      <!-- 水印设置 -->
      <div>
        <label for="watermark" class="block text-sm font-semibold text-pink-700"
          >水印内容</label
        >
        <input
          type="text"
          id="watermark"
          class="mt-2 w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-pink-500 focus:ring-pink-500"
          placeholder="请输入水印文字"
          v-model="watermark"
        />
      </div>

      <div class="flex flex-col md:flex-row justify-between md:space-x-4">
        <fieldset class="p-4 border border-pink-300 rounded-lg bg-white">
          <legend class="text-sm font-semibold text-pink-700">
            是否添加水印
          </legend>
          <div class="mt-3 flex space-x-6">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                name="watermark"
                type="radio"
                value="1"
                v-model="addWatermark"
                class="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
              />
              <span class="text-gray-700 text-sm font-medium">是</span>
            </label>
            <label class="flex items-center space-x-2 cursor-pointer">
              <input
                name="watermark"
                type="radio"
                value="2"
                v-model="addWatermark"
                class="h-4 w-4 text-pink-600 border-gray-300 focus:ring-pink-500"
              />
              <span class="text-gray-700 text-sm font-medium">否</span>
            </label>
          </div>
        </fieldset>
        <!-- 文件夹设置 -->
        <div>
          <div class="flex items-center space-x-4">
            <label
              for="folderSelect"
              class="block text-sm font-semibold text-pink-700"
              >选择上传文件夹</label
            >
            <button
              class="px-4 py-2 text-sm font-medium text-white bg-pink-500 rounded-lg shadow-md hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-400"
              @click="showAddFolder"
            >
              新建文件夹
            </button>
          </div>
          <select
            id="folderSelect"
            class="mt-2 w-full rounded-lg border border-pink-300 bg-white px-4 py-2 text-gray-900 shadow-sm focus:border-pink-500 focus:ring-pink-500"
            v-model="folder"
          >
            <option v-for="folder in folders" :key="folder" :value="folder">
              {{ folder }}
            </option>
          </select>
        </div>
      </div>

      <!-- 新建文件夹弹窗 -->

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
              选择图片
            </button>
          </p>
          <p class="text-sm mt-2"></p>
        </div>
      </div>
      <!-- 使其自动换行 -->
      <div class="flex flex-wrap space-x-2" v-if="selectIamges.length > 0">
        <span
          v-for="image in selectIamges"
          :key="image.name"
          :title="image.name"
          class="bg-gray-100 px-2 py-1 rounded-md shadow-md max-w-40 text-ellipsis line-clamp-1 mt-2"
        >
          {{ image.name }}
        </span>
      </div>
      <div class="flex justify-center mt-2">
        <button
          class="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
          :disabled="uploading"
          @click="uploadImages"
        >
          {{ $t("upload.upload") }}
        </button>
      </div>

      <div class="bg-white shadow-lg rounded-lg mb-8">
        <div class="p-6 border-b border-gray-200 bg-gray-100">
          <h3 class="text-xl font-semibold text-gray-900">上传结果</h3>
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

    <!-- File Upload Section -->
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
      class="close-button text-red-500 text-4xl absolute top-6 right-10 cursor-pointer"
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
    :showDialog="showAddFolderDialog"
    @addFolder="addFolder"
    @close-dialog="closeAddFolderDialog"
  />
</template>
