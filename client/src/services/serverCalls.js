import Axios from "axios";

export const auth = async () => {
  const url = await Axios.get("/auth");
  window.location.href = url.data;
};

export const login = async (code, state) => {
  await Axios.post("/login", {
    code,
    state
  });
};
