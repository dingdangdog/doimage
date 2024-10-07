<template>
  <div class="main-page">
    <div
      style="
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
      "
    >
      <div style="max-width: 30rem; min-width: 20rem">
        <v-select
          chips
          bg-color="rgba(242, 197, 211, 0.5)"
          :label="$t('store.select-folder')"
          :items="folders"
          v-model="folder"
          @update:model-value="changeFolder"
        ></v-select>
      </div>

      <v-tooltip :text="$t('store.refresh')">
        <template v-slot:activator="{ props }">
          <v-btn
            v-bind="props"
            variant="outlined"
            icon="mdi-refresh"
            color="rgba(246, 70, 124)"
            style="margin: 0.5rem; margin-top: -1rem"
            @click="refresh"
          >
          </v-btn>
        </template>
      </v-tooltip>
    </div>

    <div class="images-container">
      <div v-if="images.length <= 0">
        {{ $t("store.images-container") }}
      </div>
      <ImageCard
        v-for="image in images"
        :key="image"
        :image="image"
        @click="openFullscreen(image)"
        @contextmenu.prevent="showMenu(image)"
      />
    </div>
    <div style="width: 100%">
      <div
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          padding-top: 1rem;
        "
      >
        <div style="text-align: right">{{ $t("page.total") }}:{{ total }}</div>
        <div style="min-width: 3rem; text-align: center; margin: 0 0.5rem">
          {{ $t("page.size") }}:{{ pageParam.size }}
          <!-- <v-autocomplete
            bg-color="rgba(242, 197, 211, 0.5)"
            :label="$t('page.size')"
            variant="underlined"
            hide-details="auto"
            v-model="page.size"
            :items="[20, 40, 60, 80, 100]"
          ></v-autocomplete> -->
        </div>
        <div
          style="
            display: flex;
            align-items: center;
            flex-wrap: wrap;
            margin: 0 0.5rem;
          "
        >
          <v-icon
            color="rgba(246, 70, 124)"
            icon="mdi-chevron-left-circle-outline"
            class="page-action-icon"
            @click="pageDown"
          ></v-icon>
          <div style="min-width: 3rem; text-align: center">
            {{ $t("page.num") }}:{{ pageParam.page }}
            <!-- <v-text-field
              hide-details="auto"
              variant="underlined"
              :label="$t('page.num')"
              v-model="page.page"
            ></v-text-field> -->
          </div>
          <v-icon
            color="rgba(246, 70, 124)"
            icon="mdi-chevron-right-circle-outline"
            class="page-action-icon"
            @click="pageUp"
          ></v-icon>
        </div>
        <span @click="jumpPageDialog = true" style="cursor: pointer">跳页</span>
      </div>
    </div>
  </div>
  <v-dialog v-model="jumpPageDialog" style="max-width: 30rem">
    <v-card color="rgba(255, 208, 223, 0.5)">
      <v-card-title>
        <span class="text-h5">{{ $t("store.jump-page") }}</span>
      </v-card-title>
      <v-card-text>
        <v-text-field
          hide-details="auto"
          variant="underlined"
          :label="$t('page.num')"
          v-model="jumpPage"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-btn @click="jumpPageDialog = false">{{ $t("common.cancel") }}</v-btn>
        <v-btn @click="toJumpPage">{{ $t("common.confirm") }}</v-btn>
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
</template>

<script setup lang="ts">
import { showDeleteDialog } from "../utils";

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
const folder = ref();
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
  doApi("/api/getFolders", {})
    .then((res) => {
      folders.value = Array.isArray(res) ? res : [];

      changeFolder();
    })
    .catch((err) => {
      errorAlert("Api Error");
    });
  folder.value = String(window.localStorage.getItem("folder") || "");

  document.addEventListener("click", (event) => {
    showImageMenu.value = false;
  });
});

watch(pageParam.value, () => {
  getImages();
});

const getImages = () => {
  doApi("/api/getImages", {
    folder: folder.value,
    start: (pageParam.value.page - 1) * pageParam.value.size,
    num: pageParam.value.size,
  })
    .then((res) => {
      // successAlert("Success");
      images.value = Array.isArray(res) ? res : [];
    })
    .catch(() => {
      errorAlert("Api Error");
    });
};
</script>

<style scoped>
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
  /* padding: 0.5rem; */

  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.page-action-icon {
  cursor: pointer;
  margin: 0.2rem;
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
