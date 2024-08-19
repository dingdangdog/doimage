<template>
  <div class="main-page">
    <div style="width: 100%; padding: 0.5rem">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            bg-color="rgba(242, 197, 211, 0.5)"
            :label="$t('upload.watermark')"
            v-model="watermark"
          >
            <template v-slot:prepend>
              <v-icon
                icon="mdi-water-opacity"
                color="rgba(246, 70, 124)"
              ></v-icon>
            </template>
          </v-text-field>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="text-center">
            <v-radio-group v-model="addWatermark" inline>
              <v-radio
                :label="$t('upload.setmark')"
                value="1"
                color="rgba(246, 70, 124)"
              ></v-radio>
              <v-radio
                :label="$t('upload.unsetmark')"
                value="2"
                color="rgba(246, 70, 124)"
              ></v-radio>
            </v-radio-group>
          </div>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="10" sm="5">
          <v-select
            bg-color="rgba(242, 197, 211, 0.5)"
            chips
            :label="$t('upload.select-folder')"
            :items="folders"
            v-model="folder"
          >
            <template v-slot:prepend>
              <v-icon icon="mdi-folder" color="rgba(246, 70, 124)"></v-icon>
            </template>
          </v-select>
        </v-col>
        <v-col cols="2" sm="1">
          <div class="text-center">
            <v-tooltip :text="$t('upload.add-folder')">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="outlined"
                  @click="showAddFolder"
                  color="rgba(246, 70, 124)"
                  icon="mdi-plus"
                >
                </v-btn>
              </template>
            </v-tooltip>
          </div>
        </v-col>
        <v-col cols="8" sm="4">
          <v-file-input
            bg-color="rgba(242, 197, 211, 0.5)"
            :rules="rules"
            :label="$t('upload.select-image')"
            v-model="selectIamges"
            accept="image/png, image/jpeg, image/bmp, image/webp, image/gif, image/avif, image/apng, image/svg+xml, image/tiff, image/x-icon, image/vnd.microsoft.icon"
            multiple
            counter
            prepend-icon=""
            :show-size="1000"
          >
            <template v-slot:prepend>
              <v-icon
                icon="mdi-image-multiple"
                color="rgba(246, 70, 124)"
              ></v-icon>
            </template>
            <template v-slot:selection="{ fileNames }">
              <template v-for="(fileName, index) in fileNames" :key="fileName">
                <v-chip
                  v-if="index < 4"
                  class="me-2"
                  color="primary"
                  size="small"
                  label
                >
                  {{ fileName }}
                </v-chip>

                <span
                  v-else-if="index === 4"
                  class="text-overline text-grey-darken-3 mx-2"
                >
                  +{{ selectIamges.length - 4 }} {{ $t("uploadfile") }}(s)
                </span>
              </template>
            </template>
          </v-file-input>
        </v-col>
        <v-col
          cols="4"
          sm="2"
          style="display: flex; justify-content: center; align-items: center; margin-top: -1rem;"
        >
          <div class="text-center">
            <v-btn
              variant="outlined"
              :disabled="uploading"
              @click="uploadImages"
              color="rgba(246, 70, 124)"
            >
              {{ $t("upload.upload") }}
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </div>

    <div class="images-container">
      <div v-if="resIamges.length <= 0">
        {{ $t("upload.upload-result") }}
      </div>

      <ImageCard
        v-for="image in resIamges"
        :key="image"
        :image="image"
        @click="openFullscreen(image)"
        @contextmenu.prevent="showMenu(image)"
      />
    </div>
    <!-- <div>Index</div> -->

    <v-dialog
      v-model="showAddFolderDialog"
      transition="dialog-bottom-transition"
      max-width="30rem"
    >
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ $t("upload.add-folder") }}</span>
        </v-card-title>
        <v-card-text>
          <v-text-field
            :label="$t('upload.folder-name')"
            v-model="newFolder"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            density="default"
            @click="showAddFolderDialog = false"
            variant="elevated"
          >
            {{ $t("common.cancel") }}
          </v-btn>
          &nbsp;
          <v-btn
            density="default"
            @click="addFolder"
            color="rgba(246, 70, 124, 0.5)"
            variant="elevated"
          >
            {{ $t("common.add") }}
          </v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 图片蒙版 -->
    <div class="overlay" v-if="fullscrenn">
      <v-img
        :src="fullscreenImage"
        alt="Fullscreen Image"
        class="fullscreen-image"
      />
      <span class="close-button" @click="closeFullscreen">&times;</span>
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

<script setup lang="ts">
import { showDeleteDialog } from "../utils";

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
const folder = ref();
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
  // console.log("showAddFolder");
  showAddFolderDialog.value = true;
};

const uploadImages = () => {
  uploading.value = true;
  // console.log(selectIamges.value);

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
      // resIamges.value = res;
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
const showMenu = (image: string) => {
  // window.preventDefault();
  selectImage.value = image;
  // @ts-ignore
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

<style scoped>
.index-container {
  display: flex;
  height: 80%;
  width: 100%;
  flex-direction: column;
  /* justify-content: center; */
  align-items: center;
}

.row-input {
  width: 20rem;
}

.images-container {
  flex-grow: 1;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  max-height: 100vh;
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem;

  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* 在这里添加样式来隐藏 overlay 和 fullscreen-image */
.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  text-align: center;
}
.fullscreen-image {
  max-width: 100%;
  max-height: 100%;
  margin: auto;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.close-button {
  color: rgb(156, 156, 156);
  font-size: 30px;
  position: absolute;
  top: 10px;
  right: 20px;
  cursor: pointer;
}
</style>
