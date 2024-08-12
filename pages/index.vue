<template>
  <div class="main-page">
    <div class="index-container">
      <div class="text-center row-input">
        <v-text-field
          prepend-icon="mdi-key"
          clearable
          label="Key"
          v-model="serverKey"
          @keyup.enter="login"
        ></v-text-field>
      </div>

      <div class="text-center">
        <v-btn variant="outlined" @click="login" color="primary">
          {{ $t("menu.login") }}
        </v-btn>
      </div>
    </div>
    <!-- <div>Index</div> -->
  </div>
</template>

<script setup lang="ts">
const serverKey = ref("");
const login = () => {
  window.localStorage.setItem("key", serverKey.value);
  check();
};

onMounted(() => {
  serverKey.value = window.localStorage.getItem("key") || "";
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

.actions {
  display: flex;
  justify-content: space-between;
}

.select-input {
  width: 15rem;
}

.row-input {
  width: 20rem;
}
</style>
