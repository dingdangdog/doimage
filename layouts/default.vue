<template>
  <v-layout class="rounded rounded-md">
    <v-navigation-drawer>
      <v-list>
        <!-- <v-list-item title="Drawer left"></v-list-item> -->
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer location="right">
      <v-list>
        <!-- <v-list-item title="Drawer right"></v-list-item> -->
      </v-list>
    </v-navigation-drawer>

    <v-app-bar :elevation="2">
      <template v-slot:prepend>
        <v-img
          :width="40"
          aspect-ratio="1/1"
          cover
          src="/Doimage.png"
        ></v-img>
        <span class="title">{{ $t("title") }}</span>
      </template>
      <template v-slot:append>
        <v-icon
          color="#f6467c"
          icon="mdi-exit-to-app"
          size="large"
          @click="logout"
          class="exit-icon"
        ></v-icon>
      </template>
      <v-app-bar-title>
        <v-tabs v-model="tab" color="rgba(246, 70, 124)">
          <v-tab value="login" @click="toPage('login')">
            {{ $t("menu.login") }}
          </v-tab>
          <v-tab value="upload" @click="toPage('upload')">
            {{ $t("menu.upload") }}
          </v-tab>
          <v-tab value="store" @click="toPage('store')">
            {{ $t("menu.store") }}
          </v-tab>
        </v-tabs>
      </v-app-bar-title>
    </v-app-bar>
    <v-main>
      <slot></slot>
      <GlobalAlert />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";

const route = useRoute();
const tab = ref(route.path == "/" ? "login" : route.path.replace("/", ""));

const toPage = (path: string) => {
  tab.value = path;
  if (path == "login") {
    path = "/";
  }
  navigateTo(path);
  // tab.value = path == "/" ? "login" : path;
};

const logout = () => {
  warningAlert("Logout");
  window.localStorage.removeItem("key");
  navigateTo("/");
};
</script>

<style scoped>
@media screen and (max-width: 1280px) {
  .title {
    display: none;
  }
}

.exit-icon {
  cursor: pointer;
}
.exit-icon:hover {
  border: 1 solid #f6467c;
}
</style>
