import React, { Component, useContext, useEffect, useState } from "react";
import { BrowserRouter, useLocation } from "react-router-dom";
import AppRouter from "./components/AppRouter";
import NavBar from "./components/NavBar/NavBar";
import "./App.css";
import { observer } from "mobx-react-lite";
import { Context } from "./index";
import { check } from "./http/userAPI";

const App = observer(() => {
  const { user } = useContext(Context);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    setTimeout(() => {
      user
        .checkAuth()
        .then(() => {
          console.log("isAuth:", user.isAuth);
        })
        .finally(() => setLoading(false));
    }, 1000);
  }, [user]);

  useEffect(() => {
    const body = document.body;
    if (location.pathname === "/about") {
      body.classList.add("about");
      body.classList.remove("default");
    } else {
      body.classList.add("default");
      body.classList.remove("about");
    }

    return () => {
      body.classList.remove("about");
      body.classList.remove("default");
    };
  }, [location.pathname]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <NavBar />
      <AppRouter />
    </>
  );
});

const AppWrapper = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

export default AppWrapper;
