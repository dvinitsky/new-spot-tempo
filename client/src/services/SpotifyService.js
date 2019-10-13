// //   this.destinationPlaylistId = await this.getPlaylistId(
// //     "SpotTempo Workout",
// //     userPlaylists
// //   );
// //   const destinationPlaylistTracks = await this.getPlaylistTracks(
// //     this.destinationPlaylistId
// //   );

// //
// //   const destinationTrackIds = destinationPlaylistTracks
// //     .map(track => track.id)
// //     .join(",");

// //   let destinationAudioFeatures = [];
// //   if (destinationTrackIds.length > 0) {
// //     destinationAudioFeatures = await this.getTempo(destinationTrackIds);
// //   }

// //   destinationAudioFeatures.forEach(
// //     (item, index) =>
// //       (destinationPlaylistTracks[index].tempo = Math.round(item.tempo))
// //   );

// createPlaylist = async userId => {
//   try {
//     let response = await fetch(
//       "https://api.spotify.com/v1/users/" + userId + "/playlists",
//       {
//         headers: this.postHeaders,
//         method: "POST",
//         body: JSON.stringify({
//           name: "SpotTempo Workout"
//         })
//       }
//     );

//     if (response.ok) {
//       let playlist = await response.json();
//       return playlist.id;
//     }
//     throw new Error("Request failed!");
//   } catch (error) {
//     console.log(error);
//   }
// };

// getPlaylistTracks = async playlistId => {
//   try {
//     let response = await fetch(
//       "https://api.spotify.com/v1/users/" +
//         this.userId +
//         "/playlists/" +
//         playlistId +
//         "/tracks",
//       { headers: this.headers }
//     );
//     if (response.ok) {
//       let playlist = await response.json();
//       return playlist.items.map(item => item.track);
//     }
//     throw new Error("Request failed!");
//   } catch (error) {
//     console.log(error);
//   }
// };

// addTrack = async trackId => {
//   try {
//     let url =
//       "https://api.spotify.com/v1/users/" +
//       this.userId +
//       "/playlists/" +
//       this.destinationPlaylistId +
//       "/tracks?uris=" +
//       trackId;
//     let response = await fetch(url, {
//       headers: this.headers,
//       method: "POST"
//     });
//     if (response.ok) {
//       let res = await response.json();
//       return res;
//     }
//     throw new Error("Request Failed!");
//   } catch (error) {
//     console.log(error);
//   }
// };

// // Creates the playlist if it doesn't exist, and returns its ID.
// getPlaylistId = async (playlistName, userPlaylists) => {
//   const playlist =
//     userPlaylists.find(playlist => playlist.name === playlistName) || {};
//   return playlist
//     ? playlist.id
//     : await this.createPlaylist(playlistName, this.userId);
// };
