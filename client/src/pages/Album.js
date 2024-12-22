import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { addAlbum } from "../http/contentAPI";
import { Context } from "../index";
import { SEARCH_ROUTE } from "../utils/consts";
import "./Album.css";

const Album = () => {
  const location = useLocation();
  const album = location.state?.album;
  const navigate = useNavigate();

  if (!album) {
    return <div>No album data available.</div>;
  }

  const release_date = new Date(album.release_date);
  const formatted = format(release_date, "MMMM dd, yyyy");

  const duration = album.duration;
  const [hours, minutes, seconds] = duration.split(":");

  const parsedHours = parseInt(hours, 10);
  const parsedMinutes = parseInt(minutes, 10);
  const parsedSeconds = parseInt(seconds, 10);

  let formattedDuration = "";

  if (parsedHours > 0) {
    formattedDuration += `${parsedHours} hour${parsedHours > 1 ? "s" : ""} `;
  }

  if (parsedMinutes > 0) {
    formattedDuration += `${parsedMinutes} minute${
      parsedMinutes > 1 ? "s" : ""
    } `;
  }

  if (parsedSeconds > 0) {
    formattedDuration += `${parsedSeconds} second${
      parsedSeconds > 1 ? "s" : ""
    }`;
  }

  formattedDuration = formattedDuration.trim();

  return (
    <div className="page-structure">
      <div className="left-block-ap">
        <FontAwesomeIcon
          icon={faArrowLeftLong}
          className="icon"
          onClick={() => navigate(SEARCH_ROUTE)}
        />
      </div>
      <div className="right-block">
        <div className="scroll-block">
          <div className="about-album">
            <div className="album-cover">
              {album.img && album.img.length > 0 ? (
                <img src={process.env.REACT_APP_API_URL + album.img} />
              ) : (
                <div className="placeholder">No image available</div>
              )}
            </div>
            <div className="album-info">
              <h4>{album.album_name}</h4>
              <h6>{album.author}</h6>
              <span className="genre">
                <span style={{ fontWeight: "500" }}>Genre: </span>
                <span>{album.genre}</span>
              </span>
              <span className="release-date">
                <span style={{ fontWeight: "500" }}>Release date: </span>
                <span>{formatted}</span>
              </span>
              <span className="duration">
                <span style={{ fontWeight: "500" }}>Duration: </span>
                <span>{formattedDuration}</span>
              </span>
            </div>
          </div>
          <div className="album-description">{album.description}</div>
        </div>
      </div>
    </div>
  );
};

export default Album;
