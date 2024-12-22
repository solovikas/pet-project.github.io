import React, { useContext, useEffect, useState, useRef } from "react";
import "./Profile.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPencilAlt,
  faArrowUpFromBracket,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import { Context } from "../index";
import { setUsername, addPhoto, fetchData } from "../http/userAPI";
import AlbumsList from "../components/AlbumsList";
import TracksList from "../components/TracksList";
import AuthorsList from "../components/AuthorsList";

import {
  fetchAlbums,
  fetchLikedAlbums,
  fetchLikedAuthors,
  fetchAuthors,
} from "../http/contentAPI";

const User = () => {
  const { user } = useContext(Context);
  const { content } = useContext(Context);
  const [isClicked, setIsClicked] = useState(false);
  const [usernameString, setUsernameString] = useState("");
  const [inputString, setInputString] = useState("");
  const fileInputRef = useRef(null);
  const [uploadedPhoto, setUploadedPhoto] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [selected, setSelected] = useState("savedAlbums");
  const [albumsList, setAlbumsList] = useState([]);
  const [allAlbumsList, setAllAlbumsList] = useState([]);
  const [authorsList, setAuthorsList] = useState([]);
  const [allAuthorsList, setAllAuthorsList] = useState([]);
  const [tracksList, setTracksList] = useState([]);
  const [allTracksList, setAllTracksList] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const albumsData = await fetchAlbums();
        content.setAlbums(albumsData);
        setAlbumsList(albumsData);

        const likedAlbumsData = await fetchLikedAlbums(user.user.id);
        const likedAlbumsIds = new Set(
          likedAlbumsData.map((album) => album.id)
        );

        const filteredAlbumsList = albumsData.map((album) => ({
          id: album.id,
          album_name: album.album_name,
          duration: album.duration,
          release_date: album.release_date,
          description: album.description,
          author: album.author,
          img: album.img,
          is_liked: likedAlbumsIds.has(album.id),
        }));

        setAlbumsList(
          filteredAlbumsList.filter((album) => likedAlbumsIds.has(album.id))
        );

        const authorsData = await fetchAuthors();
        content.setAuthors(authorsData);

        const likedAuthorsData = await fetchLikedAuthors(user.user.id);
        const likedAuthorsIds = new Set(
          likedAuthorsData.map((author) => author.id)
        );

        const filteredAuthorsList = authorsData.map((author) => ({
          id: author.id,
          author_name: author.author_name,
          description: author.description,
          img: author.img,
          is_liked: likedAuthorsIds.has(author.id),
        }));

        setAuthorsList(
          filteredAuthorsList.filter((author) => likedAuthorsIds.has(author.id))
        );
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadData();
  }, [content, user.user.id]);

  useEffect(() => {
    const storedValue = localStorage.getItem("selectedOption");
    if (storedValue) {
      setSelected(storedValue);
    }
  }, []);

  const handleSelect = (option) => {
    setSelected(option.value);
    localStorage.setItem("selectedOption", option.value);
  };

  useEffect(() => {
    const loadUserData = async () => {
      try {
        console.log("Fetching data for user:", user.user.id);
        const response = await fetchData(user.user.id);
        console.log("Response from fetchData:", response);

        if (response.imgPath) {
          console.log("Image path:", response.imgPath);
          setUploadedPhoto(response.imgPath);
        } else {
          console.warn("No image path returned from API.");
        }

        const username = response.username || "";
        setUsernameString(username);
        setInputString(username);
        localStorage.setItem("username", username);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    loadUserData();
  }, [user]);

  useEffect(() => {
    if (uploadedPhoto) {
      const fullImageURL = `${process.env.REACT_APP_API_URL + uploadedPhoto}`;
      setImageURL(fullImageURL);
      console.log("Full image URL:", fullImageURL);
    }
  }, [uploadedPhoto]);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const response = await addPhoto(user.user.id, file);
        console.log("Photo is uploaded successfully:", response);
        setUploadedPhoto(response.imgPath);
        console.log("Uploaded photo 2:", uploadedPhoto);
      } catch (error) {
        console.error("Error uploading photo:", error);
      }
    }
  };

  const handleEditClick = () => {
    setIsClicked((prev) => !prev);
    if (!isClicked) {
      setInputString(usernameString);
    }
  };

  const handleInputChange = (e) => {
    setInputString(e.target.value);
  };

  const handleSubmit = async () => {
    try {
      await setUsername(user.user.id, inputString);
      setUsernameString(inputString);
      localStorage.setItem("username", inputString);
      setIsClicked(false);
    } catch (error) {
      console.error("Failed to set username:", error);
    }
  };

  return (
    <div className="page-structure">
      <div className="left-block-pp">
        <div className="profile-block-content">
          <div className="profile-info-block">
            <div className="user-data">
              <div className="user-field">
                {isClicked ? (
                  <input
                    type="text"
                    value={inputString}
                    onChange={handleInputChange}
                    onBlur={handleSubmit}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleSubmit();
                      }
                    }}
                    style={{
                      position: "relative",
                      display: "inline",
                      color: "white",
                      fontSize: "20px",
                      fontWeight: "500",
                      backgroundColor: "transparent",
                      outline: "none",
                      border: "none",
                      cursor: "text",
                      padding: "0px",
                    }}
                  />
                ) : (
                  <input
                    type="text"
                    value={usernameString}
                    readOnly
                    placeholder="Username"
                    style={{
                      position: "relative",
                      display: "inline",
                      color: "white",
                      fontSize: "20px",
                      fontWeight: "500",
                      backgroundColor: "transparent",
                      outline: "none",
                      border: "none",
                      cursor: "text",
                      padding: "0px",
                    }}
                  />
                )}
                <FontAwesomeIcon
                  icon={faPencilAlt}
                  className="icon"
                  style={{
                    position: "relative",
                    fontSize: "14px",
                    color: "white",
                    cursor: "pointer",
                  }}
                  onClick={handleEditClick}
                />
              </div>
              <span>{user.user.email}</span>
            </div>
            <div
              className="saved-albums"
              onClick={() => handleSelect({ value: "savedAlbums" })}
            >
              <span>Saved albums</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{
                  fontSize: "16px",
                  margin: "0px",
                }}
              />
            </div>
            <div
              className="saved-authors"
              onClick={() => handleSelect({ value: "savedAuthors" })}
            >
              <span>Saved authors</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{
                  fontSize: "16px",
                  margin: "0px",
                }}
              />
            </div>
            <div
              className="favourites"
              onClick={() => handleSelect({ value: "favourites" })}
            >
              <span>Favourites</span>
              <FontAwesomeIcon
                icon={faArrowRight}
                style={{
                  fontSize: "16px",
                  margin: "0px",
                }}
              />
            </div>
          </div>
        </div>
        <div className="profile-photo-block">
          <div className="profile-photo">
            {imageURL ? (
              <img src={imageURL} />
            ) : (
              <div>
                <span>Upload image</span>
              </div>
            )}
          </div>
          <div className="upload-new" onClick={handleUploadClick}>
            Upload
            <FontAwesomeIcon
              icon={faArrowUpFromBracket}
              style={{
                fontSize: "16px",
                margin: "0px",
                marginLeft: "8px",
              }}
            />
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            style={{ display: "none" }}
            accept="image/*"
          />
        </div>
      </div>
      <div className="right-block">
        <div className="scroll-block">
          {selected === "savedAlbums" && <AlbumsList albums={albumsList} />}
          {selected === "savedAuthors" && <AuthorsList authors={authorsList} />}
          {selected === "favourites" && <TracksList tracks={tracksList} />}
        </div>
      </div>
    </div>
  );
};

export default User;
