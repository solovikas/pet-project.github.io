const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const User = sequelize.define(
  "user",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
    role: { type: DataTypes.STRING, defaultValue: "USER" },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Album = sequelize.define(
  "album",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.TIME, allowNull: false },
    release_date: { type: DataTypes.DATE, allowNull: false },
    type: {
      type: DataTypes.ENUM("ALBUM", "SINGLE"),
      defaultValue: "ALBUM",
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Track = sequelize.define(
  "track",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    title: { type: DataTypes.STRING, allowNull: false },
    duration: { type: DataTypes.TIME, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Artist = sequelize.define(
  "author",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    artist_name: { type: DataTypes.STRING, unque: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Genre = sequelize.define(
  "genre",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    genre_name: { type: DataTypes.STRING, unique: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Label = sequelize.define(
  "label",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    label_name: { type: DataTypes.STRING, unique: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Photo = sequelize.define(
  "photo",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    img: { type: DataTypes.STRING, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Info = sequelize.define(
  "info",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    description: { type: DataTypes.TEXT, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const Lyrics = sequelize.define(
  "lyric",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    text: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    timestamps: false,
  }
);

const Activity = sequelize.define(
  "activity",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    activity: { type: DataTypes.TEXT, allowNull: false },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const AdminActivity = sequelize.define(
  "adminactivity",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

const AlbumInfo = sequelize.define(
  "albuminfo",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const ArtistInfo = sequelize.define(
  "albuminfo",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const LabelInfo = sequelize.define(
  "albuminfo",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const GenreInfo = sequelize.define(
  "albuminfo",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserAlbum = sequelize.define(
  "useralbum",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserUser = sequelize.define(
  "useruser",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserTrack = sequelize.define(
  "usertrack",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const UserArtist = sequelize.define(
  "userauthor",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

const ArtistAlbum = sequelize.define(
  "authoralbum",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

const ArtistTrack = sequelize.define(
  "authortrack",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

const GenreAlbum = sequelize.define(
  "genrealbum",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

const GenreArtist = sequelize.define(
  "genreauthor",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

const GenreTrack = sequelize.define(
  "genretrack",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

const TrackAlbum = sequelize.define(
  "trackalbum",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

const LabelAlbum = sequelize.define(
  "labelalbum",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

const LabelArtist = sequelize.define(
  "labelartist",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  },
  {
    timestamps: false,
  }
);

User.belongsToMany(User, {
  through: UserUser,
  as: "follower",
  foreignKey: "userId",
  otherKey: "followerId",
  onDelete: "CASCADE",
});

User.belongsToMany(Album, { through: UserAlbum, onDelete: "CASCADE" });
Album.belongsToMany(User, { through: UserAlbum, onDelete: "CASCADE" });

User.belongsToMany(Track, { through: UserTrack, onDelete: "CASCADE" });
Track.belongsToMany(User, { through: UserTrack, onDelete: "CASCADE" });

User.belongsToMany(Artist, { through: UserArtist, onDelete: "CASCADE" });
Artist.belongsToMany(User, { through: UserArtist, onDelete: "CASCADE" });

User.belongsToMany(Activity, { through: AdminActivity, onDelete: "CASCADE" });
Activity.belongsToMany(User, { through: AdminActivity, onDelete: "CASCADE" });

User.hasOne(Photo, { foreignKey: "userId", onDelete: "CASCADE" });
Photo.belongsTo(User, { foreignKey: "userId" });

Genre.hasOne(Photo, { foreignKey: "genreId", onDelete: "CASCADE" });
Photo.belongsTo(Genre, { foreignKey: "genreId" });

Album.hasOne(Photo, { foreignKey: "albumId", onDelete: "CASCADE" });
Photo.belongsTo(Album, { foreignKey: "albumId" });

Artist.hasOne(Photo, { foreignKey: "artistId", onDelete: "CASCADE" });
Photo.belongsTo(Artist, { foreignKey: "artistId" });

Track.hasOne(Lyrics, { foreignKey: "trackId", onDelete: "CASCADE" });
Lyrics.belongsTo(Track, { foreignKey: "trackId" });

Album.belongsToMany(Info, { through: AlbumInfo, onDelete: "CASCADE" });
Info.belongsToMany(Album, { through: AlbumInfo, onDelete: "CASCADE" });

Artist.belongsToMany(Info, { through: ArtistInfo, onDelete: "CASCADE" });
Info.belongsToMany(Artist, { through: ArtistInfo, onDelete: "CASCADE" });

Label.belongsToMany(Info, { through: LabelInfo, onDelete: "CASCADE" });
Info.belongsToMany(Label, { through: LabelInfo, onDelete: "CASCADE" });

Genre.belongsToMany(Info, { through: GenreInfo, onDelete: "CASCADE" });
Info.belongsToMany(Genre, { through: GenreInfo, onDelete: "CASCADE" });

Album.belongsToMany(Genre, { through: GenreAlbum, onDelete: "CASCADE" });
Genre.belongsToMany(Album, { through: GenreAlbum, onDelete: "CASCADE" });

Album.belongsToMany(Label, { through: LabelAlbum, onDelete: "CASCADE" });
Label.belongsToMany(Album, { through: LabelAlbum, onDelete: "CASCADE" });

Artist.belongsToMany(Genre, { through: GenreArtist, onDelete: "CASCADE" });
Genre.belongsToMany(Artist, { through: GenreArtist, onDelete: "CASCADE" });

Artist.belongsToMany(Label, { through: LabelArtist, onDelete: "CASCADE" });
Label.belongsToMany(Artist, { through: LabelArtist, onDelete: "CASCADE" });

Artist.belongsToMany(Album, { through: ArtistAlbum, onDelete: "CASCADE" });
Album.belongsToMany(Artist, { through: ArtistAlbum, onDelete: "CASCADE" });

Artist.belongsToMany(Track, { through: ArtistTrack, onDelete: "CASCADE" });
Track.belongsToMany(Artist, { through: ArtistTrack, onDelete: "CASCADE" });

Track.belongsToMany(Album, { through: TrackAlbum, onDelete: "CASCADE" });
Album.belongsToMany(Track, { through: TrackAlbum, onDelete: "CASCADE" });

module.exports = {
  User,
  Album,
  Track,
  Artist,
  Genre,
  Label,
  Lyrics,
  Photo,
  Info,
  UserUser,
  UserAlbum,
  UserArtist,
  UserTrack,
  GenreAlbum,
  GenreArtist,
  GenreTrack,
  AlbumInfo,
  ArtistInfo,
  GenreInfo,
  LabelInfo,
  AdminActivity,
  Activity,
  LabelAlbum,
  LabelAlbum,
  ArtistAlbum,
  ArtistTrack,
  TrackAlbum,
};
