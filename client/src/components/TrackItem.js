import React from "react";
import "./TracksList.css";

const TrackItem = ({ track }) => {
  return (
    <div className="track-item">
      <div className="track-item-img-1"></div>
      <h6>{track.name}</h6>
    </div>
  );
};

export default TrackItem;
