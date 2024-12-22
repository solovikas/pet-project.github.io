import React, { useState, useEffect, useContext } from "react";
import { observer } from "mobx-react-lite";
import AlbumItem from "./AlbumItem";
import "./AlbumsList.css";
import PropTypes from "prop-types";
import { Context } from "../index";

const AlbumsList = observer(({ albums }) => {
  const { user } = useContext(Context);

  return (
    <div className="albums-list">
      {albums.map((album) => (
        <AlbumItem key={album.id} album={album} />
      ))}
    </div>
  );
});

AlbumsList.propTypes = {
  albums: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      album_name: PropTypes.string.isRequired,
      duration: PropTypes.string,
      release_date: PropTypes.string,
      description: PropTypes.string,
      author: PropTypes.string,
      img: PropTypes.string,
    })
  ).isRequired,
};

export default AlbumsList;
