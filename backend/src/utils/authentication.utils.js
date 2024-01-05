const jwt = require('jsonwebtoken');

const { statusCodes, ERROR_MESSAGES, errorResponse } = require("./response.utils");

const jwtSecret = process.env.JWT_SECRET;

const authenticator = async (req, res, next) => {
  try {
    const authToken = req?.headers?.authorization;
    if (!authToken) {
      throw {
        code: statusCodes.UNAUTHORIZED,
        message: ERROR_MESSAGES.UNAUTHORIZED_ACCESS,
      };
    }
    const authDecode = jwt.verify(authToken, jwtSecret);
    const userId = authDecode?.userId;
    req.user = {
      userId,
    };
    return next();
  } catch (error) {
    return errorResponse({
      res,
      code: statusCodes.UNAUTHORIZED,
      error,
    });
  }
};

module.exports = {
  authenticator,
};