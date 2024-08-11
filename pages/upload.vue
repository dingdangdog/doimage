<template>
  <div class="main-page">
    <div class="index-container">
      <div class="row-input">
        <v-file-input
          :rules="rules"
          :label="$t('index.select-image')"
          v-model="selectIamges"
          accept="image/png, image/jpeg, image/bmp"
          multiple
          counter
          :show-size="1000"
          prepend-icon="mdi-image-multiple"
        >
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
                +{{ selectIamges.length - 4 }} {{ $t("index.file") }}(s)
              </span>
            </template>
          </template>
        </v-file-input>
      </div>

      <div class="text-center row-input">
        <v-select
          chips
          :label="$t('index.select-folder')"
          :items="folders"
          v-model="folder"
        ></v-select>
      </div>

      <div class="text-center">
        <v-btn
          variant="outlined"
          :disabled="uploading"
          @click="uploadImages"
          color="primary"
        >
          {{ $t("index.upload") }}
        </v-btn>
      </div>
      <div class="images-container" v-if="resIamges.length > 0">
        <div class="image-div" v-for="image in resIamges">
          <v-img :src="image" aspect-ratio="1" class="image bg-grey-lighten-2">
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
    </div>
    <!-- <div>Index</div> -->
  </div>
</template>

<script setup lang="ts">
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
const resIamges = ref<any[]>([]);

const selectIamges = ref<File[]>([]);

const uploading = ref(false);
const uploadImages = () => {
  uploading.value = true;
  console.log(selectIamges.value);

  if (!folder.value || selectIamges.value.length <= 0) {
    return;
  }
  const formdata = new FormData();
  const time = String(Date.now());
  formdata.append("folder", folder.value);
  selectIamges.value.forEach((file) => {
    formdata.append("images", file);
  });
  formdata.append("time", time);
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
      resIamges.value = Array.isArray(res) ? res : [];
    })
    .finally(() => {
      uploading.value = false;
    });
};

onMounted(() => {
  doApi("/api/getFolders", {}).then((res) => {
    folders.value = Array.isArray(res) ? res : [];
  });
});
</script>

<style scoped>
.index-container {
  display: flex;
  height: 80%;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

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
  margin: 0.5rem;

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
</style>
