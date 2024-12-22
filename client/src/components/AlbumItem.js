import React, { useState, useContext, useEffect } from "react";
import "./AlbumsList.css";
import { useNavigate } from "react-router-dom";
import { ALBUM_ROUTE } from "../utils/consts";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { Context } from "../index";
import { addAlbum, unaddAlbum, fetchLikedAlbums } from "../http/contentAPI";

const AlbumItem = ({ album }) => {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);
  const { user } = useContext(Context);

  useEffect(() => {
    const likedAlbumsList = async () => {
      if (user.user.id) {
        try {
          const likedAlbums = await fetchLikedAlbums(user.user.id);
          const isAlbumLiked = likedAlbums.some(
            (albumObject) => albumObject.id === album.id
          );
          setIsPressed(isAlbumLiked);
        } catch (error) {
          console.error("Error fetching liked albums:", error);
        }
      } else {
        setIsPressed(false);
      }
    };

    likedAlbumsList();
  }, [user.user.id, album.id]);

  const toggleHeart = () => {
    if (!user.user.id) {
      return;
    }
    setIsPressed((prev) => {
      const newState = !prev;

      if (newState) {
        addAlbum(user.user.id, album.id)
          .then((response) => console.log("Album liked:", response))
          .catch((error) => console.error("Error adding album:", error));
      } else {
        unaddAlbum(user.user.id, album.id)
          .then((response) => console.log("Album unliked:", response))
          .catch((error) => console.error("Error unliking album:", error));
      }

      return newState;
    });
  };

  return (
    <div className="album-item">
      <div className="album-item-img">
        {!(user.user.role === "ADMIN") && (
          <FontAwesomeIcon
            icon={isPressed ? faHeartSolid : faHeartRegular}
            className="icon-heart-al"
            onClick={toggleHeart}
          />
        )}
        {album.img && album.img.length > 0 ? (
          <img src={process.env.REACT_APP_API_URL + album.img} />
        ) : (
          <div className="placeholder">No image</div>
        )}
      </div>
      <h6
        onClick={() =>
          navigate(ALBUM_ROUTE + `/` + `${album.id}`, { state: { album } })
        }
      >
        {album.album_name}
      </h6>
      <span>{album.author}</span>
    </div>
  );
};

AlbumItem.propTypes = {
  album: PropTypes.shape({
    id: PropTypes.number.isRequired,
    album_name: PropTypes.string.isRequired,
    duration: PropTypes.string,
    release_date: PropTypes.string,
    description: PropTypes.string,
    author: PropTypes.string,
    img: PropTypes.string,
  }).isRequired,
};

export default AlbumItem;
