import React, { useContext, useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import AuthorItem from "./AuthorItem";
import "./AuthorsList.css";
import PropTypes from "prop-types";

const AuthorsList = observer(({ authors }) => {
  return (
    <div className="authors-list">
      {authors.map((author) => (
        <AuthorItem key={author.id} author={author} />
      ))}
    </div>
  );
});

AuthorsList.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      author_name: PropTypes.string.isRequired,
      description: PropTypes.string,
      img: PropTypes.string,
    })
  ).isRequired,
};

export default AuthorsList;
