import CryptoJS from "crypto-js";
import { useRouter } from "nuxt/app";

// const hash = CryptoJS.SHA256("some data").toString();
// console.log(hash);

// EncryptBySHA256 使用 SHA-256 算法加密字符串
export const encryptBySHA256 = (userName: string, password: string) => {
  return CryptoJS.SHA256(userName + password).toString();
  // return hash.digest("hex");
};

export const check = () => {
  const router = useRouter();
  const key = window.localStorage.getItem("key");
  if (!key) {
    router.push({ path: "/" });
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
        router.push({ path: "/" });
      }
      router.push({ path: "/upload" });
    })
    .catch(() => {
      router.push({ path: "/" });
    });
};

export const doApi = async (api: string, body: {}) => {
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
