<template>
  <div class="main-page">
    <div class="index-container">
      <div class="text-center row-input">
        <v-text-field
          bg-color="rgba(242, 197, 211, 0.5)"
          clearable
          label="Key"
          v-model="serverKey"
          @keyup.enter="login"
        >
          <template v-slot:prepend>
            <v-icon icon="mdi-key" color="rgba(246, 70, 124)"></v-icon>
          </template>
        </v-text-field>
      </div>

      <div class="text-center">
        <v-btn variant="outlined" @click="login" color="rgba(246, 70, 124)">
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
