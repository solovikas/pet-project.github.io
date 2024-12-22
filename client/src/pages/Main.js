import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Context } from "../index";
import { REGISTRATION_ROUTE, SEARCH_ROUTE, USER_ROUTE } from "../utils/consts";
import "./Main.css";

const Main = () => {
  const navigate = useNavigate();
  const { user } = useContext(Context);

  return (
    <div className="page-structure">
      <div className="left-block"></div>
      <div className="right-block">
        <div className="scroll-block">
          <div className="genres-block">
            <div
              className="first-line"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <div
                style={{
                  backgroundColor: "#444",
                  marginRight: "10px",
                  borderRadius: "6px",
                }}
              >
                Block 1
              </div>
              <div
                style={{
                  backgroundColor: "#555",
                  marginRight: "10px",
                  borderRadius: "6px",
                }}
              >
                Block 2
              </div>
              <div style={{ backgroundColor: "#666", borderRadius: "6px" }}>
                Block 3
              </div>
            </div>
            <div
              className="second-line"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 2fr",
              }}
            >
              <div
                style={{
                  backgroundColor: "#444",
                  marginRight: "10px",
                  borderRadius: "6px",
                }}
              >
                Block 1
              </div>
              <div style={{ backgroundColor: "#555", borderRadius: "6px" }}>
                Block 2
              </div>
            </div>
            <div
              className="third-line"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
              }}
            >
              <div style={{ backgroundColor: "#444", borderRadius: "6px" }}>
                Block 1
              </div>
            </div>
            <div
              className="fourth-line"
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
              }}
            >
              <div
                style={{
                  backgroundColor: "#444",
                  marginRight: "10px",
                  borderRadius: "6px",
                }}
              >
                Block 1
              </div>
              <div style={{ backgroundColor: "#555", borderRadius: "6px" }}>
                Block 2
              </div>
            </div>
            <div
              className="fifth-line"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
              }}
            >
              <div
                style={{
                  backgroundColor: "#444",
                  marginRight: "10px",
                  borderRadius: "6px",
                }}
              >
                Block 1
              </div>
              <div
                style={{
                  backgroundColor: "#555",
                  marginRight: "10px",
                  borderRadius: "6px",
                }}
              >
                Block 2
              </div>
              <div style={{ backgroundColor: "#666", borderRadius: "6px" }}>
                Block 3
              </div>
            </div>
          </div>
          <div className="week-block">
            <h4>Under consideration</h4>
            <div className="week-banner">
              <div></div>
            </div>
          </div>
          <div className="maybe-block">
            <h4>May be interesting</h4>
            <div className="maybe-banner">
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Main;
