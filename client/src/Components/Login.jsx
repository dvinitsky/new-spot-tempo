import React from "react";
import { auth } from "../services/serverCalls";

export const Login = () => {
  return (
    <div>
      <button onClick={auth} className="spotifyLogin">
        Click here to log in with Spotify
      </button>
    </div>
  );
};

export default Login;
