const sequelize = require("../db");
const { Author, Genre, GenreAuthor, Photo, Info } = require("../models/models");
const ApiError = require("../error/ApiError");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { resolve } = require("path");

class AuthorController {
  async create(req, res, next) {
    const dropProcedureQuery = `
      DROP PROCEDURE IF EXISTS CreateAuthor;
    `;
    const createProcedureQuery = `

      CREATE PROCEDURE CreateAuthor(
          IN p_name VARCHAR(255),
          IN p_genre VARCHAR(255),
          IN p_description TEXT,
          IN p_img VARCHAR(255)  
      )
      BEGIN
          DECLARE genre_id INT;
          DECLARE author_id INT;

          START TRANSACTION;

          SELECT id INTO genre_id FROM genres WHERE genre_name = p_genre;
          IF genre_id IS NULL THEN
              ROLLBACK;
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Genre does not exist. Please create it first.';
          END IF;

          SELECT id INTO author_id FROM authors WHERE author_name = p_name;
          IF author_id IS NOT NULL THEN
              ROLLBACK;
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'This author already exists!';
          END IF;
  
          INSERT INTO authors (author_name)
          VALUES (p_name);
          SET author_id = LAST_INSERT_ID();
  
          INSERT INTO genreauthors (authorId, genreId) VALUES (author_id, genre_id);
  
          IF p_img IS NOT NULL THEN
              INSERT INTO photos (authorId, img) VALUES (author_id, p_img);
          END IF;
  
          INSERT INTO infos (description, authorId) VALUES (p_description, author_id);
  
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

    const { author_name, genre, description } = req.body;
    const img = req.files ? req.files.img : null;

    try {
      let imgPath = null;
      if (img) {
        const fileName = uuidv4() + path.extname(img.name);
        imgPath = path.join("static", fileName);

        await img.mv(path.resolve(__dirname, "..", imgPath));
      }

      await sequelize.query(
        `CALL CreateAuthor(:author_name, :genre, :description, :img)`,
        {
          replacements: {
            author_name,
            genre,
            description,
            img: imgPath,
          },
        }
      );

      return res.json({ message: "Author is created successfully!" });
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const authors = await sequelize.query(
        `SELECT au.*, 
        p.img, 
        i.description, 
        g.id AS genreId
 FROM authors au
 LEFT JOIN photos p ON au.id = p.authorId
 LEFT JOIN infos i ON au.id = i.authorId
 LEFT JOIN genreauthors gau ON au.id = gau.authorId
 LEFT JOIN genres g ON gau.genreId = g.id`,
        {
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (authors.length === 0) {
        return res.status(404).json({ error: "No authors found!" });
      }

      return res.json(authors);
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async getLikedAuthors(req, res, next) {
    const { user_id } = req.query;

    if (!user_id) {
      return res.status(400).json({ error: "User id is required." });
    }

    try {
      const favoriteAuthors = await sequelize.query(
        `SELECT au.id
         FROM userauthors ua
         JOIN authors au ON ua.authorId = au.id
         WHERE ua.userId = :user_id`,
        {
          replacements: { user_id },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (favoriteAuthors.length === 0) {
        return res.status(404).json({ error: "No favorite authors found!" });
      }

      return res.json(favoriteAuthors);
    } catch (error) {
      console.error("Database error:", error);
      return next(ApiError.badRequest(error.message));
    }
  }

  async addAuthor(req, res, next) {
    const { user_id, author_id } = req.body;

    if (!user_id || !author_id) {
      return res
        .status(400)
        .json({ error: "User and author id's are required." });
    }

    try {
      const result = await sequelize.query(
        `INSERT INTO userauthors (userId, authorId)
         VALUES (:user_id, :author_id);`,
        {
          replacements: { user_id, author_id },
          type: sequelize.QueryTypes.INSERT,
        }
      );

      const lastInsertedId = await sequelize.query(
        `SELECT LAST_INSERT_ID() AS id;`
      );

      const newAuthor = lastInsertedId[0][0];

      return res.status(201).json(newAuthor);
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async update(req, res, next) {
    const { id } = req.params;
    const { files } = req;
    const img = files ? files.img : null;
    const { description, genre } = req.body;

    const t = await sequelize.transaction();

    try {
      let imgPath = null;
      const author = await sequelize.query(
        `SELECT * FROM authors WHERE id = :id`,
        {
          replacements: { id: id },
          type: sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );

      if (author.length === 0) {
        await t.rollback();
        return res.status(404).send("Author is not found!");
      }

      if (img) {
        const fileName = uuidv4() + path.extname(img.name);
        imgPath = path.join("static", fileName);

        await img.mv(path.resolve(__dirname, "..", imgPath));

        const existingPhoto = await sequelize.query(
          "SELECT * FROM photos WHERE authorId = :id",
          {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
            transaction: t,
          }
        );

        if (existingPhoto.length > 0) {
          await sequelize.query(
            "UPDATE photos SET img = :imgPath WHERE authorId = :id",
            {
              replacements: { imgPath, id },
              type: sequelize.QueryTypes.UPDATE,
              transaction: t,
            }
          );
        } else {
          await sequelize.query(
            "INSERT INTO photos (img, authorId) VALUES (:fileName, :id)",
            {
              replacements: { fileName, id },
              type: sequelize.QueryTypes.INSERT,
              transaction: t,
            }
          );
        }
      }

      if (description) {
        const existingInfo = await sequelize.query(
          "SELECT * FROM infos WHERE authorId = :id",
          {
            replacements: { id },
            type: sequelize.QueryTypes.SELECT,
            transaction: t,
          }
        );

        if (existingInfo.length > 0) {
          await sequelize.query(
            "UPDATE infos SET description = :description WHERE authorId = :id",
            {
              replacements: { description, id },
              type: sequelize.QueryTypes.UPDATE,
              transaction: t,
            }
          );
        } else {
          await sequelize.query(
            "INSERT INTO infos (description, authorId) VALUES (:description, :id)",
            {
              replacements: { description, id },
              type: sequelize.QueryTypes.INSERT,
              transaction: t,
            }
          );
        }

        if (genre) {
          const genreResult = await sequelize.query(
            "SELECT id FROM genres WHERE name = :genre",
            {
              replacements: { genre },
              type: sequelize.QueryTypes.SELECT,
              transaction: t,
            }
          );

          if (genreResult.length > 0) {
            const genreId = genreResult[0].id;

            await sequelize.query(
              "INSERT INTO genreauthors (genreId, authorId) VALUES (:genreId, :authorId)",
              {
                replacements: { genreId: genreId, authorId: id },
                type: sequelize.QueryTypes.INSERT,
                transaction: t,
              }
            );
          } else {
            await t.rollback();
            return res.status(404).send("Genre is not found. Create it first.");
          }
        }
      }

      await t.commit();

      return res.send("Author information is updated successfully!");
    } catch (error) {
      await t.rollback();
      return next(ApiError.badRequest(error.message));
    }
  }

  async delete(req, res, next) {
    const dropProcedureQuery = `
      DROP PROCEDURE IF EXISTS DeleteAuthor;
    `;

    const createProcedureQuery = `
      CREATE PROCEDURE DeleteAuthor(IN p_id INT)
      BEGIN
          DECLARE author_exists INT;

          SELECT COUNT(*) INTO author_exists FROM authors WHERE id = p_id;
          IF author_exists = 0 THEN
              SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Author does not exist!';
          END IF;

          START TRANSACTION;

          DELETE FROM authors WHERE id = p_id;

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
      await sequelize.query(`CALL DeleteAuthor(:id)`, {
        replacements: { id },
      });

      return res.send("Author deleted successfully!");
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async unaddAuthor(req, res, next) {
    console.log("Request body:", req.params);
    const { user_id, author_id } = req.params;

    if (!user_id || !author_id) {
      return res
        .status(400)
        .json({ error: "User and author id's are required." });
    }

    try {
      const result = await sequelize.query(
        `DELETE FROM userauthors
         WHERE userId = :user_id AND authorId = :author_id;`,
        {
          replacements: { user_id, author_id },
          type: sequelize.QueryTypes.DELETE,
        }
      );

      if (result === 0) {
        return res
          .status(404)
          .json({ error: "No author is found for this user." });
      }

      return res
        .status(200)
        .json({ message: "Author is removed successfully!" });
    } catch (error) {
      console.error("Error occurred:", error);
      return next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new AuthorController();
