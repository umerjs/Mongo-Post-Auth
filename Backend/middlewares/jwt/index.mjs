import jwt from "jsonwebtoken";
import { UserModel } from "../../models/index.mjs";

export const authGuard = async (req, res, next) => {
  try {
    //1. take out token from request headers
    const { token } = req.headers;

    //2. if no token is there
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "No token found",
      });
    }

    //3. verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //4. find the user by id and attach user object to req
    const user = await UserModel.findOne({ _id: decoded._id });

    //5. if user not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
