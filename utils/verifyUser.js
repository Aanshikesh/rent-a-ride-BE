import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/userModel.js";
import { refreshToken } from "../controllers/authController.js";

export const verifyToken = async (req, res, next) => {
  try {
    // prefer cookies
    const cookieAccess = req.cookies?.access_token;
    const cookieRefresh = req.cookies?.refresh_token;

    // fallback to Authorization header
    let headerAccess = null;
    let headerRefresh = null;
    if (req.headers.authorization) {
      const tokenPart = req.headers.authorization.split(" ")[1] || "";
      // support formats: "refresh,access" or just "access"
      const parts = tokenPart.split(",");
      if (parts.length === 2) {
        headerRefresh = parts[0];
        headerAccess = parts[1];
      } else {
        headerAccess = parts[0] || null;
      }
    }

    const accessToken = cookieAccess || headerAccess;
    const refreshToken = cookieRefresh || headerRefresh;

    if (accessToken) {
      // verify access token
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      req.user = { id: decoded.id };
      return next();
    }

    // no access token, try refresh
    if (!refreshToken) {
      return next(errorHandler(401, "You are not authenticated"));
    }

    const decodedRefresh = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
    const user = await User.findById(decodedRefresh.id);
    if (!user) return next(errorHandler(403, "Invalid refresh token"));
    if (user.refreshToken !== refreshToken)
      return next(errorHandler(403, "Invalid refresh token"));

    // generate new tokens and update DB
    const newAccessToken = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN, {
      expiresIn: "15m",
    });
    const newRefreshToken = jwt.sign({ id: user._id }, process.env.REFRESH_TOKEN, {
      expiresIn: "7d",
    });
    await User.updateOne({ _id: user._id }, { refreshToken: newRefreshToken });

    // set req.user as object to match controllers expectations
    req.user = { id: user._id };
    // also expose tokens on req for optional use
    req.newTokens = { accessToken: newAccessToken, refreshToken: newRefreshToken };
    return next();
  } catch (err) {
    return next(errorHandler(403, "Token is not valid or expired"));
  }
};
