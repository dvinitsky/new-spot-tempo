import React, { useState, useEffect } from "react";
import { SongList } from "./SongList";
import styled from "styled-components";
import { getMatchingTracks } from "../helpers/helpers";
import Axios from "axios";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;
const Title = styled.div`
  font-size: 25px;
`;
const HeaderText = styled.div`
  text-align: center;
  color: white;
  margin: 20px 60px;
`;
const SearchBar = styled.input`
  font-size: 24px;
  margin-right: 20px;
`;
const SearchArea = styled.div`
  margin-bottom: 20px;
  display: flex;
  justify-content: center;
`;
const ListsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const Search = () => {
  const [likedSongs, setLikedSongs] = useState([]);
  const [destinationPlaylistTracks, setDestinationPlaylistTracks] = useState(
    []
  );
  const [searchResults, setSearchResults] = useState([]);
  const [bpm, setBpm] = useState();
  const [isLoading, setIsLoading] = useState();

  useEffect(() => {
    const getLikedSongs = async () => {
      setIsLoading(true);
      await Axios.get("/likedSongs", {});
      const firstBatch = await Axios.post("/getSongs", { limit: 100 });
      setLikedSongs(firstBatch.data);
      setIsLoading(false);
    };

    getLikedSongs();
  }, []);

  const handleSearch = () => {
    const newBpm = document.getElementById("searchbar").value;
    setBpm(newBpm);
    setSearchResults(getMatchingTracks(newBpm, likedSongs));
  };

  const addSongToDestination = async song => {
    setDestinationPlaylistTracks([...destinationPlaylistTracks, song]);
    setLikedSongs(likedSongs.filter(item => item.id !== song.id));
    setSearchResults(searchResults.filter(item => item.id !== song.id));

    // await Spotify.addTrack(song.uri);
  };

  const removeSongFromDestination = song => {
    setLikedSongs([...likedSongs, song]);
    setDestinationPlaylistTracks(
      destinationPlaylistTracks.filter(track => track.id !== song.id)
    );

    const bpm = document.getElementById("searchbar").value;
    if (song.tempo > bpm - 10 && song.tempo < bpm + 10) {
      setSearchResults([...searchResults, song]);
    }
  };

  return (
    <Wrapper>
      <Title>Spotify BPM Picker</Title>
      <HeaderText>
        This app will allow you to search for songs by BPM in your "SpotTempo"
        playlist, and add them to your "SpotTempo Workout" playlist.
      </HeaderText>

      <SearchArea>
        <SearchBar id="searchbar" type="text" />
        <button onClick={handleSearch}>Search</button>
      </SearchArea>

      {isLoading ? (
        <div>Loading ...</div>
      ) : (
        <ListsContainer>
          <SongList
            label="Search Results"
            songs={likedSongs}
            shiftSong={addSongToDestination}
            listName="searchResults"
          />

          <SongList
            label="Playlist"
            songs={destinationPlaylistTracks}
            shiftSong={removeSongFromDestination}
            listName="playlist"
          />
        </ListsContainer>
      )}
    </Wrapper>
  );
};
export default Search;
