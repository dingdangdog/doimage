import CryptoJS from "crypto-js";
import { useRouter } from "nuxt/app";

// EncryptBySHA256 使用 SHA-256 算法加密字符串
export const encryptBySHA256 = (userName: string, password: string) => {
  return CryptoJS.SHA256(userName + password).toString();
};

export const check = () => {
  const router = useRouter();
  const key = window.localStorage.getItem("key");
  if (!key) {
    router.push({ path: "/" });
    errorAlert("No Permissions");
    return;
  }
  const time = String(Date.now());
  const Authorization = encryptBySHA256(key, time);

  $fetch("/api/check", {
    method: "POST",
    headers: {
      Authorization: Authorization,
    },
    body: { time },
  })
    .then((res) => {
      if (res != "ok") {
        errorAlert("No Permissions");
        router.push({ path: "/" });
      }
      successAlert("OK");
      if (router.currentRoute.value.path == "/") {
        router.push({ path: "/upload" });
      }
    })
    .catch(() => {
      errorAlert("No Permissions");
      router.push({ path: "/" });
    });
};

export const doApi = async (api: string, body: any) => {
  const key = window.localStorage.getItem("key");
  const time = String(Date.now());
  return $fetch(api, {
    method: "POST",
    headers: {
      Authorization: encryptBySHA256(key || "", time),
    },
    body: {
      time,
      ...body,
    },
  });
};

import { ref } from "vue";

export interface AlertInfo {
  id: string;
  type: string;
  message: string;
}

export const newAlert = ref<AlertInfo>({
  id: "alert" + 0,
  type: "",
  message: "",
});

export const alert = (type: string, message: string) => {
  newAlert.value.id = Math.random().toString();
  newAlert.value.type = type;
  newAlert.value.message = message;
};

export const errorAlert = (message: string) => {
  alert("error", message);
};

export const successAlert = (message: string) => {
  alert("success", message);
};

export const infoAlert = (message: string) => {
  alert("info", message);
};

export const warningAlert = (message: string) => {
  alert("warning", message);
};

export const showDeleteDialog = ref(false);
export const deleteImage = ref("");
