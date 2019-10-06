const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const axios = require("axios");
const querystring = require("querystring");
const request = require("request");

const redirect_uri = "http://localhost:3000/";
const client_secret = "c5082a4127ae4ae7b61dd87abe544784";
const client_id = "200fe6a2e65643b4bada24a59cebc2cb";

const scope =
  "playlist-read-private playlist-modify-private playlist-modify-public user-library-read";

const generateRandomString = length => {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

const randomString = generateRandomString(16);

const app = express();
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/auth", (req, res) => {
  res.status(200).send(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id,
        scope,
        redirect_uri,
        state: randomString
      })
  );
});

app.post("/login", async (req, res) => {
  if (req.body.state !== randomString) {
    res.status(500).send("State does not match");
  }

  const base64data = new Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  request.post(
    {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: req.body.code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code"
      },
      headers: {
        Authorization: `Basic ${base64data}`
      }
    },
    (error, response, body) => {
      if (error) {
        res.status(500).send("There has been an error");
      }
      if (response.statusCode === 200) {
        console.log(body);
        res.status(200).send(body);
      }
    }
  );
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
