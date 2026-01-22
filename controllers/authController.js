import User from "../models/userModel.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import Jwt from "jsonwebtoken";

const expireDate = new Date(Date.now() + 3600000);

/* ========================= SIGN UP ========================= */
export const signUp = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // ✅ input validation (prevents 500)
    if (!username || !email || !password) {
      return next(errorHandler(400, "All fields are required"));
    }

    if (password.length < 6) {
      return next(errorHandler(400, "Password must be at least 6 characters"));
    }

    const hashedPassword = bcryptjs.hashSync(password, 10);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isUser: true,
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    // ✅ handle duplicate email
    if (error.code === 11000) {
      return next(errorHandler(409, "Email already exists"));
    }
    next(error);
  }
};

/* ========================= REFRESH TOKEN ========================= */
export const refreshToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return next(errorHandler(401, "No authorization header"));
    }

    const tokens = authHeader.replace("Bearer ", "").split(",");
    const refreshToken = tokens[0];

    if (!refreshToken) {
      return next(errorHandler(401, "You are not authenticated"));
    }

    const decoded = Jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return next(errorHandler(403, "Invalid refresh token"));
    }

    const newAccessToken = Jwt.sign(
      { id: user._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    const newRefreshToken = Jwt.sign(
      { id: user._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    await User.findByIdAndUpdate(user._id, {
      refreshToken: newRefreshToken,
    });

    res
      .cookie("access_token", newAccessToken, {
        httpOnly: true,
        maxAge: 900000,
        sameSite: "None",
        secure: true,
        domain: ".vercel.app",
      })
      .cookie("refresh_token", newRefreshToken, {
        httpOnly: true,
        maxAge: 604800000,
        sameSite: "None",
        secure: true,
        domain: ".vercel.app",
      })
      .status(200)
      .json({ accessToken: newAccessToken, refreshToken: newRefreshToken });
  } catch (error) {
    next(errorHandler(403, "Invalid or expired refresh token"));
  }
};

/* ========================= SIGN IN ========================= */
export const signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(errorHandler(400, "Email and password are required"));
    }

    const validUser = await User.findOne({ email });
    if (!validUser) return next(errorHandler(404, "User not found"));

    const validPassword = bcryptjs.compareSync(
      password,
      validUser.password
    );
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials"));
    }

    const accessToken = Jwt.sign(
      { id: validUser._id },
      process.env.ACCESS_TOKEN,
      { expiresIn: "15m" }
    );

    const refreshToken = Jwt.sign(
      { id: validUser._id },
      process.env.REFRESH_TOKEN,
      { expiresIn: "7d" }
    );

    await User.findByIdAndUpdate(validUser._id, { refreshToken });

    const { password: _, isAdmin, ...rest } = validUser._doc;

    res.status(200).json({
      accessToken,
      refreshToken,
      isAdmin,
      ...rest,
    });
  } catch (error) {
    next(error);
  }
};

/* ========================= GOOGLE AUTH ========================= */
export const google = async (req, res, next) => {
  try {
    const { email, name, photo } = req.body;

    if (!email) {
      return next(errorHandler(400, "Email is required"));
    }

    let user = await User.findOne({ email });

    if (user && !user.isUser) {
      return next(errorHandler(409, "Email already used as vendor"));
    }

    if (!user) {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const hashedPassword = bcryptjs.hashSync(generatedPassword, 10);

      user = await User.create({
        username:
          name?.split(" ").join("").toLowerCase() +
          Math.random().toString(36).slice(-6),
        email,
        password: hashedPassword,
        profilePicture: photo,
        isUser: true,
      });
    }

    const token = Jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "15m",
    });

    const { password, ...rest } = user._doc;

    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: expireDate,
        sameSite: "None",
        secure: true,
        domain: ".vercel.app",
      })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};
