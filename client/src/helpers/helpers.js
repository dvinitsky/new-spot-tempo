export const getMatchingTracks = (bpm, originPlaylistTracks) => {
  if (!bpm) return originPlaylistTracks;

  console.log("bpm is", bpm);

  const mathcingTracks = originPlaylistTracks.filter(track => {
    console.log(track.name, "has a tempo of", track.tempo);
    return track.tempo > bpm - 10 && track.tempo < bpm + 10;
  });

  console.log(mathcingTracks);
};

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
