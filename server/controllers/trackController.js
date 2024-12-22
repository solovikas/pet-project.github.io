const {
  Track,
  Author,
  Album,
  AuthorTrack,
  TrackAlbum,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { resolve } = require("path");
const sequelize = require("../db");

class TrackController {
  async create(req, res, next) {
    const { name, duration, albumName, authorName } = req.body;

    const t = await sequelize.transaction();

    try {
      const [track, createdTrack] = await Track.findOrCreate({
        where: { name },
        defaults: { duration },
        transaction: t,
      });

      if (!createdTrack) {
        await t.rollback();
        return next(ApiError.badRequest("This track already exists!"));
      }

      const existingAlbum = await Album.findOne({
        where: { name: albumName },
        transaction: t,
      });

      if (!existingAlbum) {
        await t.rollback();
        return next(
          ApiError.badRequest("Album does not exist. Please create it first.")
        );
      }

      const existingAuthor = await Author.findOne({
        where: { name: authorName },
        transaction: t,
      });

      if (!existingAuthor) {
        await t.rollback();
        return next(
          ApiError.badRequest("Author does not exist. Please create it first.")
        );
      }

      await AuthorTrack.create(
        { authorId: existingAuthor.id, trackId: track.id },
        { transaction: t }
      );

      await TrackAlbum.create(
        { albumId: existingAlbum.id, trackId: track.id },
        { transaction: t }
      );

      await t.commit();

      return res.json(track);
    } catch (error) {
      await t.rollback();
      console.error("Error in create track:", error);
      return next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const tracks = await sequelize.query("SELECT * FROM tracks", {
        type: sequelize.QueryTypes.SELECT,
      });

      if (tracks.length === 0) {
        return res.status(404).json({ error: "No tracks found!" });
      }

      return res.json(tracks);
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async getCertain(req, res, next) {
    const id = req.params.id;

    try {
      const track = await sequelize.query(
        "SELECT * FROM tracks WHERE id = :id",
        {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (track.length === 0) {
        return res.status(404).json({ error: "Track is not found!" });
      }

      return res.json(track);
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async delete(req, res) {
    const { id } = req.params;

    const t = await sequelize.transaction();

    try {
      const existingTrack = await sequelize.query(
        `SELECT * FROM tracks WHERE id = :id`,
        {
          replacements: { id },
          type: sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );

      if (existingTrack.length === 0) {
        await t.rollback();
        return res.status(404).send("Track is not found!");
      }

      await sequelize.query("DELETE FROM tracks WHERE id = :id", {
        replacements: { id: id },
        type: sequelize.QueryTypes.DELETE,
        transaction: t,
      });

      await t.commit();

      return res.send("Track information is deleted successfully!");
    } catch (error) {
      await t.rollback();
      return next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new TrackController();
