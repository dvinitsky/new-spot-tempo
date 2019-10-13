import React, { useState, useEffect } from "react";
import { getUrlParams, authRedirect } from "../helpers/helpers";
import Search from "./Search";
import Axios from "axios";

const App = () => {
  const [accessToken, setAccessToken] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const loginHandler = async () => {
      setIsLoading(true);

      const response = await Axios.get("/getAccessToken");

      if (response.data) {
        setAccessToken(response.data);
        setIsLoading(false);
        return;
      }

      const { code, state } = getUrlParams();
      try {
        if (code && state) {
          const response = await Axios.post("/login", {
            code,
            state
          });
          if (response.data.mismatch) {
            return await authRedirect();
          }

          setAccessToken(response.data);
        } else {
          await authRedirect();
        }
      } catch (error) {
        await authRedirect();
      }

      setIsLoading(false);
    };

    loginHandler();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return accessToken ? <Search /> : null;
};

export default App;
