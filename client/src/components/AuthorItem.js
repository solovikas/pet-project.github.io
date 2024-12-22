import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AUTHOR_ROUTE } from "../utils/consts";
import "./AuthorsList.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartSolid } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartRegular } from "@fortawesome/free-regular-svg-icons";
import { Context } from "../index";
import { addAuthor, unaddAuthor, fetchLikedAuthors } from "../http/contentAPI";

const AuthorItem = ({ author }) => {
  const navigate = useNavigate();
  const [isPressed, setIsPressed] = useState(false);
  const { user } = useContext(Context);

  useEffect(() => {
    const likedAuthorsList = async () => {
      try {
        const likedAuthors = await fetchLikedAuthors(user.user.id);
        const isAuthorLiked = likedAuthors.some(
          (authorObject) => authorObject.id === author.id
        );
        setIsPressed(isAuthorLiked);
      } catch (error) {
        console.error("Error fetching liked authors:", error);
      }
    };

    likedAuthorsList();
  }, [user.user.id, author.id]);

  const toggleHeart = () => {
    if (!user.user.id) {
      return;
    }
    setIsPressed((prev) => {
      const newState = !prev;

      if (newState) {
        addAuthor(user.user.id, author.id)
          .then((response) => console.log("Author liked:", response))
          .catch((error) => console.error("Error adding author:", error));
      } else {
        unaddAuthor(user.user.id, author.id)
          .then((response) => console.log("Author unliked:", response))
          .catch((error) => console.error("Error unliking author:", error));
      }

      return newState;
    });
  };
  return (
    <div className="author-item">
      <div className="author-item-img">
        {!(user.user.role === "ADMIN") && (
          <FontAwesomeIcon
            icon={isPressed ? faHeartSolid : faHeartRegular}
            className="icon-heart-al"
            onClick={toggleHeart}
          />
        )}
        {author.img && author.img.length > 0 ? (
          <img src={process.env.REACT_APP_API_URL + author.img} />
        ) : (
          <div className="placeholder">No image</div>
        )}
      </div>
      <h6
        onClick={() =>
          navigate(AUTHOR_ROUTE + `/` + `${author.id}`, { state: { author } })
        }
      >
        {author.author_name}
      </h6>
    </div>
  );
};

export default AuthorItem;
