import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import { Context } from "..";
import TrackItem from "./TrackItem";
import "./TracksList.css";

const TracksList = observer(() => {
  const { content } = useContext(Context);

  return (
    <div className="tracks-list">
      {content.tracks.map((track) => (
        <TrackItem key={track.id} track={track} />
      ))}
    </div>
  );
});

export default TracksList;
