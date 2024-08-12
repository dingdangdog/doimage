<template>
  <v-dialog
    v-model="showDeleteDialog"
    transition="dialog-bottom-transition"
    max-width="30rem"
    min-width="20rem"
  >
    <v-card>
      <v-card-title>
        <span class="text-h5">{{ $t("upload.add-folder") }}</span>
      </v-card-title>
      <v-card-text>
        <p>确定删除当前选择的图片？删除后无法恢复！</p>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn
          density="default"
          @click="showDeleteDialog = false"
          variant="elevated"
        >
          Cancel
        </v-btn>
        &nbsp;
        <v-btn
          density="default"
          @click="delImage"
          color="blue-lighten-3"
          variant="elevated"
        >
          Confirm
        </v-btn>
        <v-spacer></v-spacer>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup lang="ts">
import { showDeleteDialog, deleteImage } from "../utils";

const delImage = () => {
  doApi("/api/delImage", { url: deleteImage.value })
    .then(() => {
      warningAlert("Delete Success");
    })
    .catch((err) => {
      errorAlert("Api Error");
    })
    .finally(() => {
      showDeleteDialog.value = false;
    });
};

</script>

<style scoped></style>
