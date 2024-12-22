import React, { useEffect, useState, useCallback, useContext } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LOGIN_ROUTE, MAIN_ROUTE, REGISTRATION_ROUTE } from "../utils/consts";
import "./Auth.css";
import "../components/NavBar/NavBar.css";
import { login, registration } from "../http/userAPI";
import { Context } from "../index";
import { observer } from "mobx-react-lite";
import DOMPurify from "dompurify";

const Auth = observer(() => {
  const { user } = useContext(Context);
  const location = useLocation();

  console.log(location);
  const navigate = useNavigate();
  const isLogin = location.pathname === LOGIN_ROUTE;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 8;
  };

  const click = useCallback(async () => {
    try {
      const sanitizedEmail = DOMPurify.sanitize(email);
      const sanitizedPassword = DOMPurify.sanitize(password);

      let data;
      if (isLogin) {
        data = await login(sanitizedEmail, sanitizedPassword);
      } else {
        data = await registration(sanitizedEmail, sanitizedPassword);
      }
      user.setUser(data);
      user.setIsAuth(true);
      navigate(MAIN_ROUTE);
    } catch (error) {
      alert(error.response.message);
    }
  }, [email, password, isLogin, user, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    let valid = true;

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address.");
      valid = false;
    } else {
      setEmailError("");
    }

    if (!validatePassword(password)) {
      setPasswordError("Password must be at least 8 characters long.");
      valid = false;
    } else {
      setPasswordError("");
    }

    if (valid) {
      click();
    }
  };

  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
    if (validateEmail(e.target.value)) {
      setEmailError("");
    }
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
    if (validatePassword(e.target.value)) {
      setPasswordError("");
    }
  }, []);

  return (
    <div className={"auth-form"}>
      <h2>{isLogin ? "Log in" : "Sign up"}</h2>
      <form onSubmit={handleSubmit}>
        <div className="auth-fields">
          <label htmlFor="username">Email</label>
          <input
            type="text"
            id="username"
            name="username"
            value={email}
            onChange={handleEmailChange}
            placeholder="name@example.com"
            required
          />
          {emailError && <span className="error">{emailError}</span>}
        </div>
        <div className="auth-fields">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder={
              isLogin
                ? "Enter your password"
                : "Must have at least 8 characters"
            }
            required
          />
          {passwordError && <span className="error">{passwordError}</span>}
        </div>
        {isLogin ? (
          <div className="auth-cap">
            <span style={{ color: "#757575" }}>No account?</span>
            <NavLink
              style={{ fontSize: "16px", color: "#000000" }}
              to={REGISTRATION_ROUTE}
            >
              Sign up.
            </NavLink>
          </div>
        ) : (
          <div className="auth-cap">
            <span style={{ color: "#757575" }}>Already have an account?</span>
            <NavLink
              style={{ fontSize: "16px", color: "#000000" }}
              to={LOGIN_ROUTE}
            >
              Log in here.
            </NavLink>
          </div>
        )}
        <button type="submit">{isLogin ? "Log in" : "Sign up"}</button>
      </form>
    </div>
  );
});

export default Auth;
