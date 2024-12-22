const sequelize = require("../db");
const ApiError = require("../error/ApiError");

class GenreController {
  async create(req, res, next) {
    const { genre_name } = req.body;

    const t = await sequelize.transaction();

    try {
      const existingGenre = await sequelize.query(
        "SELECT * FROM genres WHERE genre_name = :genre_name",
        {
          replacements: { genre_name },
          type: sequelize.QueryTypes.SELECT,
          transaction: t,
        }
      );

      if (existingGenre.length > 0) {
        await t.rollback();
        return next(ApiError.badRequest("This genre already exists!"));
      }

      const insertQuery =
        "INSERT INTO genres (genre_name) VALUES (:genre_name)";
      await sequelize.query(insertQuery, {
        replacements: { genre_name },
        type: sequelize.QueryTypes.INSERT,
        transaction: t,
      });

      const genre = await sequelize.query(
        "SELECT * FROM genres WHERE id = LAST_INSERT_ID()",
        { type: sequelize.QueryTypes.SELECT, transaction: t }
      );

      await t.commit();

      return res.json(genre);
    } catch (error) {
      await t.rollback();
      return next(ApiError.badRequest(error.message));
    }
  }

  async getAll(req, res, next) {
    try {
      const genres = await sequelize.query("SELECT * FROM genres", {
        type: sequelize.QueryTypes.SELECT,
      });

      return res.json(genres);
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async getCertain(req, res, next) {
    const genreId = req.params.id;

    try {
      const genre = await sequelize.query(
        "SELECT * FROM genres WHERE id = :genreId",
        {
          replacements: { genreId },
          type: sequelize.QueryTypes.SELECT,
        }
      );

      if (genre.length === 0) {
        return res.status(404).json({ error: "Genre is not found" });
      }

      return res.json(genre);
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }

  async addInfo(req, res, next) {
    const { genre_id, description } = req.body;

    const t = await sequelize.transaction();

    try {
      const [genreExists] = await sequelize.query(
        `SELECT COUNT(*) AS count FROM genres WHERE id = :genre_id`,
        { replacements: { genre_id }, transaction: t }
      );

      if (genreExists.count === 0) {
        await t.rollback();
        return res.status(404).json("No genre found.");
      }

      await sequelize.query(
        `INSERT INTO infos (genreId, description) VALUES (:genre_id, :description)`,
        { replacements: { genre_id, description }, transaction: t }
      );

      await t.commit();
      return res.json({ message: "Info is added successfully!" });
    } catch (error) {
      await t.rollback();
      return next(ApiError.badRequest(error.message));
    }
  }

  async addPhoto(req, res, next) {
    const { genre_id } = req.body;
    const img = req.files ? req.files.img : null;

    try {
      const genreExists = await sequelize.query(
        `SELECT COUNT(*) AS count FROM genres WHERE id = :genre_id`,
        { replacements: { user_id } }
      );

      if (genreExists === 0) {
        return res.status(404).json("No genre found.");
      }

      let imgPath = null;
      if (img) {
        const fileName = uuidv4() + path.extname(img.name);
        imgPath = path.join("static", fileName);

        await img.mv(path.resolve(__dirname, "..", imgPath));
      } else {
        return res.status(400).json("Image file is required.");
      }

      const photoExists = await sequelize.query(
        `SELECT img FROM photos WHERE genreId = :genre_id`,
        { replacements: { genre_id } }
      );

      console.log("Inserting/updating photo with:", { genre_id, img: imgPath });

      if (photoExists[0] && photoExists[0].length > 0) {
        await sequelize.query(
          `UPDATE photos SET img = :img WHERE genreId = :genre_id`,
          { replacements: { genre_id, img: imgPath } }
        );
        return res.json({ message: "Photo is updated successfully!", imgPath });
      } else {
        await sequelize.query(
          `INSERT INTO photos (genreId, img) VALUES (:genre_id, :img)`,
          { replacements: { genre_id, img: imgPath } }
        );
        return res.json({ message: "Photo is set successfully!", imgPath });
      }
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new GenreController();
