import Axios from "axios";

export const getUrlParams = () => {
  if (
    window.location.href.match(/code=([^&]*)/) !== null &&
    window.location.href.match(/state=([^&]*)/) !== null
  ) {
    return {
      code: window.location.href.split("code=")[1].split("&state")[0],
      state: window.location.href.split("state=")[1]
    };
  }
  return {};
};

export const authRedirect = async () => {
  const url = await Axios.get("/auth");
  window.location.href = url.data;
};
