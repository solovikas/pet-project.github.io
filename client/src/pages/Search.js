import React, { useContext, useState, useRef, useEffect } from "react";
import "./Search.css";
import { Context } from "../index";
import CustomDropdown from "../components/CustomDropdown";
import AlbumsList from "../components/AlbumsList";
import AuthorsList from "../components/AuthorsList";
import TracksList from "../components/TracksList";
import { useNavigate } from "react-router-dom";
import { REGISTRATION_ROUTE } from "../utils/consts";
import { fetchGenres, fetchAlbums, fetchAuthors } from "../http/contentAPI";
import DOMPurify from "dompurify";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [genreOptions, setGenreOptions] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [albumsList, setAlbumsList] = useState([]);
  const [allAlbumsList, setAllAlbumsList] = useState([]);
  const [authorsList, setAuthorsList] = useState([]);
  const [allAuthorsList, setAllAuthorsList] = useState([]);
  const [tracksList, setTracksList] = useState([]);
  const [allTracksList, setAllTracksList] = useState([]);

  const { content } = useContext(Context);
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const { user } = useContext(Context);

  useEffect(() => {
    fetchGenres().then((data) => {
      content.setGenres(data);
      console.log("Fetched genres:", data);
      setGenreOptions(
        data.map((genre) => ({
          value: genre.id,
          label: genre.genre_name,
        }))
      );
    });
    fetchAlbums().then((data) => {
      content.setAlbums(data);
      setAllAlbumsList(data);
      setAlbumsList(
        data.map((album) => ({
          id: album.id,
          album_name: album.album_name,
          duration: album.duration,
          release_date: album.release_date,
          description: album.description,
          author: album.author,
          genre: album.genre,
          img: album.img,
        }))
      );
    });
    fetchAuthors().then((data) => {
      content.setAuthors(data);
      setAllAuthorsList(data);
      setAuthorsList(
        data.map((author) => ({
          id: author.id,
          author_name: author.author_name,
          description: author.description,
          author: author.author,
          img: author.img,
        }))
      );
    });
  }, [content]);

  const typeOptions = [
    ...content.types.map((type) => ({
      value: type.id,
      label: type.name,
    })),
  ];

  const handleSelect = (option, type) => {
    if (type === "genre") {
      if (selectedGenres.includes(option.value)) {
        setSelectedGenres((prev) =>
          prev.filter((value) => value !== option.value)
        );
      } else {
        setSelectedGenres((prev) => [...prev, option.value]);
      }
      filterByGenre();
    } else if (type === "type") {
      setSelectedType(option.value);
    }
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    filterBySearch(term);
  };

  const filterBySearch = (term) => {
    const filteredAlbums = allAlbumsList.filter((album) => {
      return (
        album.album_name.toLowerCase().includes(term.toLowerCase()) ||
        album.author.toLowerCase().includes(term.toLowerCase())
      );
    });
    const filteredAuthors = allAuthorsList.filter((author) => {
      return author.author_name.toLowerCase().includes(term.toLowerCase());
    });
    setAlbumsList(filteredAlbums);
    setAuthorsList(filteredAuthors);
  };

  const filterByGenre = () => {
    const filteredAlbums = allAlbumsList.filter((album) => {
      return (
        selectedGenres.length === 0 || selectedGenres.includes(album.genreId)
      );
    });
    const filteredAuthors = allAuthorsList.filter((author) => {
      return (
        selectedGenres.length === 0 || selectedGenres.includes(author.genreId)
      );
    });
    setAlbumsList(filteredAlbums);
    setAuthorsList(filteredAuthors);
  };

  const applyFilters = () => {
    let filteredAlbums = allAlbumsList;
    let filteredAuthors = allAuthorsList;

    if (selectedGenres.length > 0) {
      filteredAlbums = filteredAlbums.filter((album) =>
        selectedGenres.includes(album.genreId)
      );
      filteredAuthors = filteredAuthors.filter((author) =>
        selectedGenres.includes(author.genreId)
      );
    }
    if (searchTerm) {
      filteredAlbums = filteredAlbums.filter((album) => {
        return (
          album.album_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          album.author.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
      filteredAuthors = filteredAuthors.filter((author) => {
        return author.author_name
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
    }
    setAlbumsList(filteredAlbums);
    setAuthorsList(filteredAuthors);
  };

  useEffect(() => {
    applyFilters();
  }, [selectedGenres, searchTerm]);

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      console.log("Search term submitted:", searchTerm);
      if (inputRef.current) {
        inputRef.current.blur();
      }
    }
  };

  return (
    <div className="page-structure">
      <div className="left-block">
        <div className="filters-bar">
          <CustomDropdown
            options={genreOptions}
            onSelect={(option) => handleSelect(option, "genre")}
            dropdownHeader={"Genres"}
            multiple={true}
          />
          <div className="album-author">
            <button
              onClick={() => {
                const option = { value: 1, label: "albums" };
                handleSelect(option, "type");
              }}
            >
              Albums
            </button>
            <button
              onClick={() => {
                const option = { value: 2, label: "authors" };
                handleSelect(option, "type");
              }}
            >
              Authors
            </button>
          </div>
        </div>
        <div className="search-bar">
          <input
            type="text"
            placeholder="What do you want to search?"
            onChange={handleSearch}
            onKeyDown={handleKeyPress}
            ref={inputRef}
          />
        </div>
        <div className="about-collection-s"></div>
        <div className="about-search-s"></div>
      </div>
      <div className="right-block">
        <div className="scroll-block">
          {(selectedType === 1 || selectedType === "") && (
            <AlbumsList albums={albumsList} />
          )}
          {selectedType === 2 && <AuthorsList authors={authorsList} />}
          {selectedType === 3 && <TracksList tracks={tracksList} />}
        </div>
      </div>
    </div>
  );
};

export default Search;
