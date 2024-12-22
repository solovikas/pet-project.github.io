import React, { useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { faArrowLeftLong } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { SEARCH_ROUTE } from "../utils/consts";
import "./Author.css";

const Author = () => {
  const location = useLocation();
  const author = location.state?.author;
  const navigate = useNavigate();

  if (!author) {
    return <div>No author data available.</div>;
  }

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
          <div className="about-author">
            <div className="author-cover">
              {author.img && author.img.length > 0 ? (
                <img src={process.env.REACT_APP_API_URL + author.img} />
              ) : (
                <div className="placeholder">No image available</div>
              )}
            </div>
            <div className="author-info">
              <h4>{author.author_name}</h4>
              <span>{author.genre}</span>
            </div>
          </div>
          <div className="author-description">{author.description}</div>
        </div>
      </div>
    </div>
  );
};

export default Author;
