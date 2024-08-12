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
      <v-btn
        variant="outlined"
        :aria-label="$t('store.search')"
        icon="mdi-refresh"
        color="rgba(246, 70, 124)"
        style="margin: 0.5rem; margin-top: -1rem"
        @click="refresh"
      ></v-btn>
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
      <v-row style="width: 100%; margin-top: 0.5rem">
        <v-col cols="3" sm="4">
          <div style="text-align: right">Total:{{ total }}</div>
        </v-col>
        <v-col cols="4" sm="2">
          <v-text-field
            bg-color="rgba(242, 197, 211, 0.5)"
            label="Page Size"
            v-model="page.size"
          ></v-text-field>
        </v-col>
        <v-col cols="4" sm="2">
          <v-text-field
            bg-color="rgba(242, 197, 211, 0.5)"
            label="Page"
            v-model="page.page"
          ></v-text-field>
        </v-col>
        <v-col cols="1" sm="1">
          <div class="page-actions">
            <v-icon
              color="rgba(246, 70, 124)"
              icon="mdi-menu-up"
              class="page-action-icon"
              @click="pageDown"
            ></v-icon>
            <v-icon
              color="rgba(246, 70, 124)"
              icon="mdi-menu-down"
              class="page-action-icon"
              @click="pageUp"
            ></v-icon>
          </div>
        </v-col>
        <!-- <v-col cols="2" sm="2">
        总页数：{{ Math.ceil(total / page.size) }}
      </v-col> -->
      </v-row>
    </div>
  </div>

  <!-- 图片蒙版 -->
  <div class="overlay" v-if="fullscrenn">
    <v-img
      :src="fullscreenImage"
      alt="Fullscreen Image"
      class="fullscreen-image"
      id="fullscreen-image"
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

const folders = ref<any[]>([]);
const folder = ref();
const images = ref<any[]>([]);

const total = ref(0);
const page = ref({
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
  if (page.value.page < Math.ceil(total.value / page.value.size)) {
    page.value.page++;
  }
};
const pageDown = () => {
  if (page.value.page > 1) {
    page.value.page--;
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
    })
    .catch((err) => {
      errorAlert("Api Error");
    });
  folder.value = String(window.localStorage.getItem("folder") || "");

  document.addEventListener("click", (event) => {
    showImageMenu.value = false;
  });
});

watch(page.value, () => {
  getImages();
});

const getImages = () => {
  doApi("/api/getImages", {
    folder: folder.value,
    start: (page.value.page - 1) * page.value.size,
    num: page.value.size,
  })
    .then((res) => {
      successAlert("Success");
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
  padding: 0.5rem;

  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.image-div {
  margin: 0.5rem;
  width: 10rem;
  height: 8rem;
  border: 1px solid #f6467c;
  border-radius: 0.2rem;
}

.image {
  padding: 0.5rem;
  border-radius: 0.2rem;
  cursor: pointer;
}

.page-actions {
  margin-left: -1rem;
  display: flex;
  flex-direction: column;
}

.page-action-icon {
  cursor: pointer;
  border: 1px solid #f6467c;
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
