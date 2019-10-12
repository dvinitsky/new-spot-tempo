import React, { useState, useEffect } from "react";
import { getUrlParams } from "../helpers/helpers";
import Search from "./Search";
import Axios from "axios";

const App = () => {
  const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    const loginHandler = async () => {
      const { code, state } = getUrlParams();
      if (code && state) {
        const response = await Axios.post("/login", {
          code,
          state
        });
        if (response.data.mismatch) {
          const url = await Axios.get("/auth");
          window.location.href = url.data;
        }

        setAccessToken(response.data);
      } else {
        const url = await Axios.get("/auth");
        window.location.href = url.data;
      }
    };

    loginHandler();
  }, []);

  return accessToken ? <Search /> : null;
};

export default App;
