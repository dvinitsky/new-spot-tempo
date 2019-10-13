const getMatchingTracks = (bpm, tracks) => {
  return tracks.filter(
    track => track.tempo > bpm - 10 && track.tempo < bpm + 10
  );
};

module.exports = { getMatchingTracks };
