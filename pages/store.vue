<template>
  <div class="main-page">
    <div class="text-center row-input">
      <v-select
        chips
        :label="$t('index.select-folder')"
        :items="folders"
        v-model="folder"
        @update:model-value="changeFolder"
      ></v-select>
    </div>

    <div class="images-container">
      <div class="image-div" v-for="image in iamges">
        <v-img
          :src="image"
          aspect-ratio="1"
          class="image bg-grey-lighten-2"
          @click="openFullscreen(image)"
        >
          <template v-slot:placeholder>
            <v-row class="fill-height ma-0" justify="center" align="center">
              <v-progress-circular
                color="grey-lighten-5"
                indeterminate
              ></v-progress-circular>
            </v-row>
          </template>
        </v-img>
      </div>
    </div>

    <v-row style="width: 100%">
      <v-col cols="1"></v-col>
      <v-col cols="5">
        <v-text-field label="Size" v-model="page.size"></v-text-field>
      </v-col>
      <v-col cols="5">
        <v-text-field label="Page" v-model="page.page"></v-text-field>
      </v-col>
      <v-col cols="1">
        <div class="page-actions">
          <v-icon
            icon="mdi-menu-up"
            class="page-action-icon"
            @click="pageDown"
          ></v-icon>
          <v-icon
            icon="mdi-menu-down"
            class="page-action-icon"
            @click="pageUp"
          ></v-icon>
        </div>
      </v-col>
    </v-row>
  </div>

  <!-- 图片蒙版 -->
  <div class="overlay" v-if="fullscrenn">
    <img
      :src="fullscreenImage"
      alt="Fullscreen Image"
      class="fullscreen-image"
      id="fullscreen-image"
    />
    <span class="close-button" @click="closeFullscreen">&times;</span>
  </div>
</template>

<script setup lang="ts">
const folders = ref<any[]>([]);
const folder = ref();
const iamges = ref<any[]>([]);

const total = ref(0);
const page = ref({
  page: 1,
  size: 20,
});

const changeFolder = () => {
  if (!folder.value) {
    return;
  }

  getImages();

  doApi("/api/getTotalImage", { folder: folder.value }).then((res) => {
    total.value = Number(res);
  });
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
  fullscreenImage.value = image;
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

onMounted(() => {
  doApi("/api/getFolders", {}).then((res) => {
    // folders.value = res;
    folders.value = Array.isArray(res) ? res : [];
  });
});

watch(page.value, () => {
  // console.log("page change");
  getImages();
});

const getImages = () => {
  doApi("/api/getImages", {
    folder: folder.value,
    start: (page.value.page - 1) * page.value.size,
    num: page.value.size,
  }).then((res) => {
    // iamges.value = res;
    iamges.value = Array.isArray(res) ? res : [];
  });
};
</script>

<style scoped>
.row-input {
  width: 20rem;
}

.images-container {
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
  border: 1px solid #ccc;
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
