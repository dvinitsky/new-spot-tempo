const express = require("express");
const path = require("path");
const PORT = process.env.PORT || 5000;
const bodyParser = require("body-parser");
const { getMatchingTracks } = require("./helpers/helpers");
const axios = require("axios");
const qs = require("querystring");

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
let accessToken;
let likedSongs = [];
let headers;

const app = express();
app.use(bodyParser.json());

// Serve static files from the React app
app.use(express.static(path.join(__dirname, "client/build")));

app.get("/auth", (req, res) => {
  res.status(200).send(
    "https://accounts.spotify.com/authorize?" +
      qs.stringify({
        response_type: "code",
        client_id,
        scope,
        redirect_uri,
        state: randomString
      })
  );
});

app.post("/login", async (req, res) => {
  if (accessToken) {
    return res.status(200).send(accessToken);
  }

  if (req.body.state !== randomString) {
    return res.status(200).send({ mismatch: true });
  }

  const base64data = new Buffer.from(`${client_id}:${client_secret}`).toString(
    "base64"
  );

  try {
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      qs.stringify({
        code: req.body.code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code"
      }),
      {
        headers: {
          Authorization: `Basic ${base64data}`
        },
        json: true
      }
    );

    accessToken = response.data.access_token;
    refreshToken = response.data.refresh_token;
    headers = { Authorization: `Bearer ${accessToken}` };

    await getLikedSongs();

    return res.status(200).send(accessToken);
  } catch (error) {
    return res.status(500).send("There has been an error.");
  }
});

app.post("/getNextSongs", (req, res) => {
  return res.status(200).send(likedSongs.slice(req.body.start, req.body.end));
});

app.post("/getMatchingSongs", (req, res) => {
  const matchingTracks = getMatchingTracks(req.body.bpm, likedSongs);

  return res
    .status(200)
    .send(matchingTracks.slice(req.body.start, req.body.end));
});

const getLikedSongs = async () => {
  try {
    const response = await axios.get(
      "https://api.spotify.com/v1/me/tracks?limit=50",
      { headers }
    );

    likedSongs.push(...response.data.items.map(item => item.track));
    total = response.data.total;

    let promises = [];
    for (let i = 50; i <= total; i += 50) {
      promises.push(
        axios.get(`https://api.spotify.com/v1/me/tracks?limit=50&offset=${i}`, {
          headers
        })
      );
    }

    let promisesResponse;
    promisesResponse = await Promise.all(promises);

    promisesResponse.forEach(response => {
      likedSongs.push(...response.data.items.map(item => item.track));
    });

    for (let j = 0; j <= total + 100; j += 100) {
      let audioFeatures;
      const response = await axios.get(
        `https://api.spotify.com/v1/audio-features/?ids=${likedSongs
          .slice(j, j + 100)
          .map(track => track.id)
          .join(",")}`,
        { headers }
      );
      audioFeatures = response.data.audio_features;

      audioFeatures.forEach((audioFeature, index) => {
        if (audioFeature && audioFeature.tempo) {
          likedSongs[j + index].tempo = Math.round(audioFeature.tempo);
        }
      });
    }
  } catch (error) {
    return { error };
  }
};

app.get("/playlists", async (req, res) => {
  let userData, playlists;
  try {
    const userResponse = await axios.get("https://api.spotify.com/v1/me", {
      headers
    });
    const playlistsResponse = await axios.get(
      "https://api.spotify.com/v1/me/playlists",
      { headers }
    );

    userData = userResponse.data;
    playlists = playlistsResponse.data;
  } catch (error) {
    return res.status(500).send("There has been an error.");
  }
});

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname + "/client/build/index.html"));
});

app.listen(PORT, () => console.log(`Listening on ${PORT}`));
