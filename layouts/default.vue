<template>
  <v-layout class="rounded rounded-md">
    <!-- <v-navigation-drawer>
      <v-list>
      </v-list>
    </v-navigation-drawer>

    <v-navigation-drawer location="right">
      <v-list>
      </v-list>
    </v-navigation-drawer> -->

    <v-app-bar color="rgba(242, 197, 211, 0.5)" :elevation="2">
      <template v-slot:prepend>
        <v-img :width="40" aspect-ratio="1/1" cover src="/Doimage.png"></v-img>
        <h2 class="title">{{ $t("title") }}</h2>
      </template>

      <v-app-bar-title>
        <v-tabs v-model="tab" color="rgba(246, 70, 124)">
          <v-tab value="login" @click="toPage('login')">
            <h3>{{ $t("menu.login") }}</h3>
          </v-tab>
          <v-tab value="upload" @click="toPage('upload')">
            <h3>{{ $t("menu.upload") }}</h3>
          </v-tab>
          <v-tab value="store" @click="toPage('store')">
            <h3>{{ $t("menu.store") }}</h3>
          </v-tab>
          <v-tab value="donate" @click="toPage('donate')">
            <h3>Donate</h3>
          </v-tab>
        </v-tabs>
      </v-app-bar-title>

      <template v-slot:append>
        <v-tooltip text="Change to English" v-if="locale == 'zh'">
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              color="rgb(246, 70, 124)"
              icon="mdi-alpha-e-box-outline"
              size="large"
              @click="changeLang"
              class="exit-icon"
            ></v-icon>
          </template>
        </v-tooltip>

        <v-tooltip text="切换中文" v-if="locale != 'zh'">
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              color="rgb(246, 70, 124)"
              icon="mdi-translate"
              size="large"
              @click="changeLang"
              class="exit-icon"
            ></v-icon>
          </template>
        </v-tooltip>

        <v-tooltip text="To Github">
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              color="#f6467c"
              size="large"
              @click="toGithub"
              class="exit-icon"
            >
              <template v-slot:default>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    fill="#f6467c"
                    d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
                  />
                </svg>
              </template>
            </v-icon>
          </template>
        </v-tooltip>

        <v-tooltip text="Logout">
          <template v-slot:activator="{ props }">
            <v-icon
              v-bind="props"
              color="#f6467c"
              icon="mdi-exit-to-app"
              size="large"
              @click="logout"
              class="exit-icon"
            ></v-icon>
          </template>
        </v-tooltip>
      </template>
    </v-app-bar>

    <v-main>
      <div v-show="loading" style="text-align: center; padding-top: 10vh">
        Loading
      </div>
      <div v-show="!loading" style="height: 100%"><slot></slot></div>
      <GlobalAlert />
    </v-main>
  </v-layout>
</template>

<script setup lang="ts">
const loading = ref(true);
onMounted(() => {
  loading.value = false;
});

import { useRoute } from "vue-router";
const { locale, locales, setLocale } = useI18n();

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
  navigateTo(`/`);
};

const changeLang = () => {
  setLocale(locale.value == "zh" ? "en" : "zh");
};

const toGithub = () => {
  window.open("https://github.com/dingdangdog/Doimage", "_blank");
};
</script>

<style scoped>
@media screen and (max-width: 1280px) {
  .title {
    display: none;
  }
}

.exit-icon {
  margin: 0.5rem;
  cursor: pointer;
}
.exit-icon:hover {
  border: 1 solid #f6467c;
}
</style>
