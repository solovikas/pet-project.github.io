const sequelize = require("../db");
const {
  Album,
  Author,
  Photo,
  Info,
  Genre,
  GenreAlbum,
  AuthorAlbum,
} = require("../models/models");
const ApiError = require("../error/ApiError");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { resolve } = require("path");

class AlbumController {
  async create(req, res, next) {
    const dropProcedureQuery = `
      DROP PROCEDURE IF EXISTS CreateAlbum;
    `;
    const createProcedureQuery = `

      CREATE PROCEDURE CreateAlbum(
          IN p_name VARCHAR(255),
          IN p_duration TIME,
          IN p_release_date DATE,
          IN p_type VARCHAR(50),
          IN p_genre VARCHAR(255),
          IN p_description TEXT,
          IN p_author VARCHAR(255),
          IN p_img VARCHAR(255) 
      )
      BEGIN
          DECLARE album_id INT;
          DECLARE genre_id INT;
          DECLARE author_id INT;

          START TRANSACTION;

          SELECT id INTO genre_id FROM genres WHERE genre_name = p_genre;
          IF genre_id IS NULL THEN
              ROLLBACK;
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Genre does not exist. Please create it first.';
          END IF;

          SELECT id INTO author_id FROM authors WHERE author_name = p_author;
          IF author_id IS NULL THEN
              ROLLBACK;
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Author does not exist. Please create it first.';
          END IF;
  
          SELECT id INTO album_id FROM albums WHERE album_name = p_name;
          IF album_id IS NOT NULL THEN
              ROLLBACK;
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This album already exists!';
          END IF;
  
          INSERT INTO albums (album_name, duration, release_date, type)
          VALUES (p_name, p_duration, p_release_date, p_type);
          SET album_id = LAST_INSERT_ID();
  
          INSERT INTO genrealbums (albumId, genreId) VALUES (album_id, genre_id);
          INSERT INTO authoralbums (authorId, albumId) VALUES (author_id, album_id);
  
          IF p_img IS NOT NULL THEN
              INSERT INTO photos (albumId, img) VALUES (album_id, p_img);
          END IF;
  
          INSERT INTO infos (description, albumId) VALUES (p_description, album_id);
  
          COMMIT;
      END 
    `;

    try {
      await sequelize.query(dropProcedureQuery);
      await sequelize.query(createProcedureQuery);
      console.log("Procedure created successfully");
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }

    const {
      album_name,
      duration,
      release_date,
      type,
      genre,
      description,
      author,
    } = req.body;
    const img = req.files ? req.files.img : null;

    try {
      let imgPath = null;
      if (img) {
        const fileName = uuidv4() + path.extname(img.name);
        imgPath = path.join("static", fileName);

        await img.mv(path.resolve(__dirname, "..", imgPath));
      }

      await sequelize.query(
        `CALL CreateAlbum(:album_name, :duration, :release_date, :type, :genre, :description, :author, :img)`,
        {
          replacements: {
            album_name,
            duration,
            release_date,
            type,
            genre,
            description,
            author,
            img: imgPath,
          },
        }
      );

      return res.json({ message: "Album created successfully!" });
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const albums = await sequelize.query(
        `SELECT a.*,
                    p.img, 
                    i.description, 
                    g.id AS genreId, 
                    g.genre_name AS genre,
                    au.author_name AS author
             FROM albums a
             LEFT JOIN photos p ON a.id = p.albumId
             LEFT JOIN infos i ON a.id = i.albumId
             LEFT JOIN genrealbums ga ON a.id = ga.albumId
             LEFT JOIN genres g ON ga.genreId = g.id
             LEFT JOIN authoralbums aa ON a.id = aa.albumId
             LEFT JOIN authors au ON aa.authorId = au.id`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (albums.length === 0) {
        return res.status(404).json({ error: "No albums found!" });
      }

      return res.json(albums);
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async addAlbum(req, res, next) {
    const { user_id, album_id } = req.body;

    if (!user_id || !album_id) {
      return res
        .status(400)
        .json({ error: "User and album id's are required." });
    }

    try {
      const result = await sequelize.query(
        `INSERT INTO useralbums (userId, albumId)
         VALUES (:user_id, :album_id);`,
        {
          replacements: { user_id, album_id },
          type: sequelize.QueryTypes.INSERT,
        }
      );

      const lastInsertedId = await sequelize.query(
        `SELECT LAST_INSERT_ID() AS id;`
      );

      const newAlbum = lastInsertedId[0][0];

      return res.status(201).json(newAlbum);
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async getLikedAlbums(req, res, next) {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User id is required." });
    }

    try {
      const likedAlbums = await sequelize.query(
        `SELECT a.id
         FROM useralbums ua
         JOIN albums a ON ua.albumId = a.id
         WHERE ua.userId = :user_id`,
        {
          replacements: { user_id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      return res.json(likedAlbums);
    } catch (error) {
      console.error("Database error:", error);
      return next(ApiError.badRequest(error.message));
    }
  }

  async delete(req, res, next) {
    const dropProcedureQuery = `
      DROP PROCEDURE IF EXISTS DeleteAlbum;
    `;

    const createProcedureQuery = `
      CREATE PROCEDURE DeleteAlbum(IN p_id INT)
      BEGIN
          DECLARE album_exists INT;

          SELECT COUNT(*) INTO album_exists FROM albums WHERE id = p_id;
          IF album_exists = 0 THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Album does not exist!';
          END IF;

          START TRANSACTION;

          DELETE FROM albums WHERE id = p_id;

          COMMIT;
      END 
    `;

    try {
      await sequelize.query(dropProcedureQuery);
      await sequelize.query(createProcedureQuery);
      console.log("Procedure created successfully");
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }

    const { id } = req.params;

    try {
      await sequelize.query(`CALL DeleteAlbum(:id)`, {
        replacements: { id },
      });

      return res.send("Album deleted successfully!");
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async unaddAlbum(req, res, next) {
    console.log("Request body:", req.params);
    const { user_id, album_id } = req.params;

    if (!user_id || !album_id) {
      return res
        .status(400)
        .json({ error: "User and album id's are required." });
    }

    try {
      const result = await sequelize.query(
        `DELETE FROM useralbums
         WHERE userId = :user_id AND albumId = :album_id;`,
        {
          replacements: { user_id, album_id },
          type: sequelize.QueryTypes.DELETE,
        }
      );

      if (result === 0) {
        return res
          .status(404)
          .json({ error: "No album is found for this user." });
      }

      return res
        .status(200)
        .json({ message: "Album is removed successfully!" });
    } catch (error) {
      console.error("Error occurred:", error);
      return next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new AlbumController();
