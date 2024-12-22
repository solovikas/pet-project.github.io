import { $host, $authHost } from "./index";

export const createGenre = async (genre_name) => {
  const { data } = await $authHost.post("api/genre", { genre_name });
  return data;
};

export const fetchGenres = async () => {
  const { data } = await $host.get("api/genre");
  return data;
};

export const createAlbum = async (
  album_name,
  duration,
  release_date,
  type,
  genre,
  description,
  author,
  imgFile
) => {
  const formData = new FormData();

  formData.append("album_name", album_name);
  formData.append("duration", duration);
  formData.append("release_date", release_date);
  formData.append("type", type);
  formData.append("genre", genre);
  formData.append("description", description);
  formData.append("author", author);
  formData.append("img", imgFile);

  const { data } = await $authHost.post("api/album", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const fetchAlbums = async () => {
  const { data } = await $host.get("api/album");
  return data;
};

export const fetchAuthors = async () => {
  const { data } = await $host.get("api/author");
  return data;
};

export const addAlbum = async (user_id, album_id) => {
  const payload = {
    user_id,
    album_id,
  };

  const { data } = await $authHost.post("api/album/add", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
};

export const unaddAlbum = async (user_id, album_id) => {
  const { data } = await $authHost.delete(
    `api/album/unadd/${user_id}/${album_id}`
  );

  return data;
};

export const addAuthor = async (user_id, author_id) => {
  const payload = {
    user_id,
    author_id,
  };

  const { data } = await $authHost.post("api/author/add", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
};

export const unaddAuthor = async (user_id, author_id) => {
  const { data } = await $authHost.delete(
    `api/album/unadd/${user_id}/${author_id}`
  );

  return data;
};

export const fetchLikedAlbums = async (user_id) => {
  const { data } = await $authHost.get("api/album/liked", {
    params: {
      user_id: user_id,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};

export const fetchLikedAuthors = async (user_id) => {
  const { data } = await $authHost.get("api/author/liked", {
    params: {
      user_id: user_id,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
