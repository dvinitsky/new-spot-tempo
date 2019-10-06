import React, { useState, useEffect } from "react";
import {
  getAccessTokenAndExpirationSeconds,
  getUrlParams
} from "../helpers/helpers";
import Login from "./Login";
import Search from "./Search";
import { login } from "../services/serverCalls";

const App = () => {
  // const [accessToken, setAccessToken] = useState();

  useEffect(() => {
    const loginHandler = async () => {
      const { code, state } = getUrlParams();
      if (code && state) {
        const response = await login(code, state);
        console.log(response);
      }
    };

    loginHandler();
  });

  console.log("app");
  // return accessToken ? <Search accessToken={accessToken} /> : <Login />;
  return <Login />;
};

export default App;
