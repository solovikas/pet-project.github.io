const { User, Playlist, Photo } = require("../models/models");
const jwt = require("jsonwebtoken");
const ApiError = require("../error/ApiError");
const bcrypt = require("bcrypt");
const sequelize = require("../db");
const path = require("path");
const { v4: uuidv4 } = require("uuid");
const { resolve } = require("path");
const fs = require("fs");

const generateJwt = (id, email, role) => {
  return jwt.sign({ id, email, role }, process.env.SECRET_KEY, {
    expiresIn: "24h",
  });
};

class UserController {
  async registration(req, res, next) {
    const { email, password, role="ADMIN" } = req.body;
    if (!email || !password) {
      return next(ApiError.badRequest("Email or password is not correct!"));
    }

    const candidate = await User.findOne({ where: { email } });
    if (candidate) {
      return next(ApiError.badRequest("User with this email already exists!"));
    }

    const hashPassword = await bcrypt.hash(password, 5);

    const t = await sequelize.transaction();

    try {
      const user = await User.create(
        { email, role, password: hashPassword },
        { transaction: t }
      );

      const token = generateJwt(user.id, user.email, user.role);

      await t.commit();

      return res.json({ token });
    } catch (error) {
      await t.rollback();
      return next(ApiError.internal("Registration failed!"));
    }
  }

  async login(req, res, next) {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return next(ApiError.internal("User with this email is not found!"));
    }

    let comparePassword = bcrypt.compareSync(password, user.password);
    if (!comparePassword) {
      return next(ApiError.internal("Invalid password!"));
    }
    const token = generateJwt(user.id, user.email, user.role);
    return res.json({ token });
  }

  async addPhoto(req, res, next) {
    const { user_id } = req.body;
    const img = req.files ? req.files.img : null;

    try {
      const userExists = await sequelize.query(
        `SELECT COUNT(*) AS count FROM users WHERE id = :user_id`,
        { replacements: { user_id } }
      );

      if (userExists === 0) {
        return res.status(404).json("No user found.");
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
        `SELECT img FROM photos WHERE userId = :user_id`,
        { replacements: { user_id } }
      );

      console.log("Inserting/updating photo with:", { user_id, img: imgPath });

      if (photoExists[0] && photoExists[0].length > 0) {
        await sequelize.query(
          `UPDATE photos SET img = :img WHERE userId = :user_id`,
          { replacements: { user_id, img: imgPath } }
        );
        return res.json({ message: "Photo is updated successfully!", imgPath });
      } else {
        await sequelize.query(
          `INSERT INTO photos (userId, img) VALUES (:user_id, :img)`,
          { replacements: { user_id, img: imgPath } }
        );
        return res.json({ message: "Photo is set successfully!", imgPath });
      }
    } catch (error) {
      console.error("Database error:", error);
      return next(ApiError.badRequest(error.message));
    }
  }

  async getData(req, res, next) {
    const { user_id } = req.query;

    try {
      const userExists = await sequelize.query(
        `SELECT COUNT(*) AS count FROM users WHERE id = :user_id`,
        { replacements: { user_id } }
      );

      if (userExists[0][0].count === 0) {
        return res.status(404).json("No user found.");
      }

      const userData = await sequelize.query(
        `SELECT username, (SELECT img FROM photos WHERE userId = :user_id) AS imgPath
         FROM users WHERE id = :user_id`,
        { replacements: { user_id } }
      );

      if (userData[0] && userData[0].length > 0) {
        const { username, imgPath } = userData[0][0];
        return res.json({
          message: "User data fetched successfully!",
          username,
          imgPath,
        });
      } else {
        return res.json({
          message: "No photo found for this user.",
          username: "",
          imgPath: "",
        });
      }
    } catch (error) {
      console.error("Database error:", error);
      return next(ApiError.badRequest(error.message));
    }
  }

  async check(req, res, next) {
    try {
      const token = generateJwt(req.user.id, req.user.email, req.user.role);
      return res.json({ token });
    } catch (error) {
      console.error("Error generating token:", error);
      return res.status(500).json({ message: "Server error" });
    }
  }

  async setUsername(req, res, next) {
    const { user_id, username } = req.body;

    try {
      const userExists = await sequelize.query(
        `SELECT COUNT(*) AS count FROM users WHERE id = :user_id`,
        { replacements: { user_id } }
      );

      if (userExists === 0) {
        return res.status(404).json("No user found.");
      }

      const usernameExists = await sequelize.query(
        `SELECT username FROM users WHERE id = :user_id`,
        { replacements: { user_id } }
      );

      if (usernameExists.username) {
        await sequelize.query(
          `UPDATE users SET username = :username WHERE id = :user_id`,
          { replacements: { user_id, username } }
        );
        return res.send("Username is updated successfully!");
      } else {
        await sequelize.query(
          `UPDATE users SET username = :username WHERE id = :user_id`,
          { replacements: { user_id, username } }
        );
        return res.send("Username is set successfully!");
      }
    } catch (error) {
      return next(ApiError.badRequest(error.message));
    }
  }
}

module.exports = new UserController();
