import React, { useContext, useState, useEffect } from "react";
import { Context } from "../index";
import CustomDropdown from "../components/CustomDropdown";
import AlbumsList from "../components/AlbumsList";
import AuthorsList from "../components/AuthorsList";
import TracksList from "../components/TracksList";
import "./Admin.css";
import { fetchAlbums, fetchAuthors } from "../http/contentAPI";

const Admin = () => {
  /*const [userOptions, setUserOptions] = useState([]);
  const [albumOptions, setAlbumOptions] = useState([]);
  const [authorOptions, setAuthorOptions] = useState([]);*/
  const [albumsList, setAlbumsList] = useState([]);
  const [allAlbumsList, setAllAlbumsList] = useState([]);
  const [authorsList, setAuthorsList] = useState([]);
  const [allAuthorsList, setAllAuthorsList] = useState([]);
  const [allUsersList, setAllUsersList] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [selectedType, setSelectedType] = useState("");

  const { content } = useContext(Context);

  useEffect(() => {
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

  const userOptions = [
    { value: 1, label: "Check users" },
    { value: 2, label: "Create user" },
    { value: 3, label: "Delete user" },
  ];

  const albumOptions = [
    { value: 4, label: "Check albums" },
    { value: 5, label: "Create album" },
    { value: 6, label: "Delete album" },
    { value: 7, label: "Update album" },
  ];

  const authorOptions = [
    { value: 8, label: "Check authors" },
    { value: 9, label: "Create author" },
    { value: 10, label: "Delete author" },
    { value: 11, label: "Update album" },
  ];

  const handleSelect = (option) => {
    setSelectedType(option.label);
  };

  return (
    <div className="page-structure">
      <div className="left-block">
        <div className="admin-info"></div>
        <div className="admin-options">
          <CustomDropdown
            options={userOptions}
            onSelect={(option) => handleSelect(option)}
            dropdownHeader={"Users"}
            multiple={false}
          />
          <CustomDropdown
            options={albumOptions}
            onSelect={(option) => handleSelect(option)}
            dropdownHeader={"Albums"}
            multiple={false}
          />
          <CustomDropdown
            options={authorOptions}
            onSelect={(option) => handleSelect(option)}
            dropdownHeader={"Authors"}
            multiple={false}
          />
        </div>
        <div className="hz"></div>
      </div>
      <div className="right-block">
        <div className="scroll-block">
          {selectedType === "Check albums" && (
            <AlbumsList albums={albumsList} />
          )}
          {selectedType === "Check authors" && (
            <AuthorsList authors={authorsList} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
