export default defineEventHandler(async (event) => {
  const url = await getRequestURL(event);
  // 判断url
  if (url.pathname.startsWith("/api")) {
    const config = await useRuntimeConfig(event);
    const Authorization = await getHeader(event, "Authorization");
    const query = await readBody(event);
    let formdata;
    try {
      formdata = await readFormData(event);
    } catch {
      // console.log("not formdata");
    }

    const time = query.time
      ? String(query.time)
      : String(formdata?.get("time"));

    const pass = encryptBySHA256(config.apiSecret, time);
    config;
    // 判断Token
    if (!(Authorization && Authorization == pass)) {
      // setResponseStatus(event, 403)
      console.log("No Authorization");
      throw Error("No Permissions");
    }
  }
});
