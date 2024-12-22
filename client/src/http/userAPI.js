import { $host, $authHost } from "./index";
import { jwtDecode } from "jwt-decode";

export const registration = async (email, password) => {
  const role = "USER";
  const { data } = await $host.post("api/user/registration", {
    email,
    password,
    role,
  });
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

export const login = async (email, password) => {
  const { data } = await $host.post("api/user/login", {
    email,
    password,
  });
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

export const check = async () => {
  const { data } = await $authHost.get("api/user/auth");
  localStorage.setItem("token", data.token);
  return jwtDecode(data.token);
};

export const setUsername = async (user_id, username) => {
  const payload = {
    user_id: user_id,
    username: username,
  };

  const { data } = await $authHost.post("api/user/set", payload, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
};

export const addPhoto = async (user_id, img) => {
  const formData = new FormData();
  formData.append("user_id", user_id);
  formData.append("img", img);

  const { data } = await $authHost.post("api/user/add", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const fetchData = async (user_id) => {
  const { data } = await $authHost.get("api/user", {
    params: {
      user_id: user_id,
    },
    headers: {
      "Content-Type": "application/json",
    },
  });
  return data;
};
