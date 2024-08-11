<template>
  <div class="main-page">
    <div class="index-container">
      <div style="width: 100%">
        <div style="width: 100%">
          <v-row>
            <v-col cols="12" sm="6">
              <v-select
                prepend-icon="mdi-folder"
                chips
                :label="$t('index.select-folder')"
                :items="folders"
                v-model="folder"
              ></v-select>
            </v-col>
            <v-col cols="12" sm="6">
              <v-text-field
                prepend-icon="mdi-water-opacity"
                :label="$t('index.watermark')"
                v-model="watermark"
              ></v-text-field>
            </v-col>
          </v-row>
        </div>

        <div style="width: 100%">
          <v-row>
            <v-col cols="12" sm="6">
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
                  <template
                    v-for="(fileName, index) in fileNames"
                    :key="fileName"
                  >
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
            </v-col>
            <v-col cols="6" sm="3">
              <div class="text-center">
                <v-radio-group v-model="addWatermark" inline>
                  <v-radio :label="$t('index.set')" value="1"></v-radio>
                  <v-radio :label="$t('index.unset')" value="2"></v-radio>
                </v-radio-group>
              </div>
            </v-col>
            <v-col cols="6" sm="3">
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
            </v-col>
          </v-row>
        </div>
      </div>
      <div>
        <div class="images-container">
          <div v-if="resIamges.length <= 0">上传结果显示区</div>
          <div class="image-div" v-for="image in resIamges">
            <v-img
              :src="image"
              aspect-ratio="1"
              class="image bg-grey-lighten-2"
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
const watermark = ref("");
const addWatermark = ref("2");
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
  watermark.value = window.localStorage.getItem("watermark") || "";
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
