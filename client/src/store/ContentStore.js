import { makeAutoObservable } from "mobx";

export default class ContentStore {
  constructor() {
    this._albums = [];
    this._authors = [];
    this._genres = [];
    this._tracks = [];

    this._types = [
      { id: 1, name: "albums" },
      { id: 2, name: "authors" },
      { id: 3, name: "tracks" },
    ];
    makeAutoObservable(this);
  }

  setAlbums(albums) {
    this._albums = albums;
  }

  setAuthors(authors) {
    this._authors = authors;
  }

  setGenres(genres) {
    this._genres = genres;
  }

  setTracks(tracks) {
    this._tracks = tracks;
  }

  setTypes(types) {
    this._types = types;
  }

  get albums() {
    return this._albums;
  }

  get authors() {
    return this._authors;
  }

  get genres() {
    return this._genres;
  }

  get tracks() {
    return this._tracks;
  }

  get types() {
    return this._types;
  }
}
