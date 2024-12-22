import Admin from "./pages/Admin";
import Author from "./pages/Author";
import Auth from "./pages/Auth";
import Main from "./pages/Main";
import User from "./pages/Profile";
import Search from "./pages/Search";
import About from "./pages/About";
import Album from "./pages/Album";
import Genre from "./pages/Album";
import {
  ADMIN_ROUTE,
  AUTHOR_ROUTE,
  REGISTRATION_ROUTE,
  LOGIN_ROUTE,
  USER_ROUTE,
  MAIN_ROUTE,
  SEARCH_ROUTE,
  ABOUT_ROUTE,
  ALBUM_ROUTE,
  GENRE_ROUTE,
} from "./utils/consts";

export const authRoutes = [
  {
    path: ADMIN_ROUTE,
    Component: Admin,
  },
  {
    path: USER_ROUTE,
    Component: User,
  },
];

export const publicRoutes = [
  {
    path: AUTHOR_ROUTE + "/:id",
    Component: Author,
  },
  {
    path: ALBUM_ROUTE + "/:id",
    Component: Album,
  },
  {
    path: GENRE_ROUTE + "/:id",
    Component: Genre,
  },
  {
    path: REGISTRATION_ROUTE,
    Component: Auth,
  },
  {
    path: LOGIN_ROUTE,
    Component: Auth,
  },
  {
    path: MAIN_ROUTE,
    Component: Main,
  },
  {
    path: SEARCH_ROUTE,
    Component: Search,
  },
  {
    path: ABOUT_ROUTE,
    Component: About,
  },
];
