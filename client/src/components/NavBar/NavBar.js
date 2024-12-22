import { Context } from "../../index";
import React, { useContext } from "react";
import { FaHome, FaSearch, FaUser } from "react-icons/fa";
import "./NavBar.css";
import { NavLink, useNavigate } from "react-router-dom";
import {
  MAIN_ROUTE,
  SEARCH_ROUTE,
  USER_ROUTE,
  ABOUT_ROUTE,
  REGISTRATION_ROUTE,
  LOGIN_ROUTE,
  ADMIN_ROUTE,
} from "../../utils/consts";
import styles from "../styles.module.css";
import { observer } from "mobx-react-lite";

const NavBar = observer(() => {
  const { user } = useContext(Context);
  const navigate = useNavigate();

  console.log("User Auth:", user.isAuth);
  console.log("User Role:", user.role);
  console.log("User ID:", user.id);

  const logOut = () => {
    localStorage.removeItem("token");
    user.setUser({});
    user.setIsAuth(false);
    navigate(MAIN_ROUTE);
  };

  return (
    <nav className="navbar">
      {user.isAuth ? (
        <React.Fragment>
          <ul className="nav-list" alt="nav-options-is-auth">
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.activeOption : styles.option
                }
                to={MAIN_ROUTE}
              >
                Main
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.activeOption : styles.option
                }
                to={SEARCH_ROUTE}
              >
                Search
              </NavLink>
            </li>
            {user.user.role === "ADMIN" ? (
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.activeOption : styles.option
                  }
                  to={ADMIN_ROUTE}
                >
                  Admin
                </NavLink>
              </li>
            ) : (
              <li>
                <NavLink
                  className={({ isActive }) =>
                    isActive ? styles.activeOption : styles.option
                  }
                  to={USER_ROUTE}
                >
                  Profile
                </NavLink>
              </li>
            )}
          </ul>
          <button className="custom-button" onClick={() => logOut()}>
            Log out
          </button>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <ul className="nav-list" alt="nav-options-isnt-auth">
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.activeOption : styles.option
                }
                to={MAIN_ROUTE}
              >
                Main
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.activeOption : styles.option
                }
                to={SEARCH_ROUTE}
              >
                Search
              </NavLink>
            </li>
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.activeOption : styles.option
                }
                to={ABOUT_ROUTE}
              >
                About
              </NavLink>
            </li>
          </ul>
          <ul className="nav-buttons">
            <li>
              <NavLink
                className={({ isActive }) =>
                  isActive ? styles.activeOption : styles.option
                }
                to={REGISTRATION_ROUTE}
              >
                Sign up
              </NavLink>
            </li>
            <li>
              <button
                className="custom-button"
                onClick={() => {
                  navigate(LOGIN_ROUTE);
                }}
              >
                Log in
              </button>
            </li>
          </ul>
        </React.Fragment>
      )}
    </nav>
  );
});

export default NavBar;
