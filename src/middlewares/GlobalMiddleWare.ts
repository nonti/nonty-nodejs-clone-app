import { validationResult } from "express-validator";
import { Jwt } from "../utils/Jwt";


export class GlobalMiddleWare {
  
  static checkError(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      next(new Error(errors.array()[0].msg));
    } else {
      next();
    }
  }

  static async auth(req, res, next) {
    const header_auth = req.headers.authorization; // Bearer token
    const token = header_auth ? header_auth.slice(7, header_auth.length) : null;
    try {
      req.errorStatus = 401;
      if (!token) next(new Error('User does not exist'));
      const decoded = await Jwt.jwtVerify(token);
      req.user = decoded;
      next();
    } catch (e) {
      req.errorStatus = 401;
      // next(e);
      next(new Error('User does not exist'));
    }
  }
  static async decodeRefreshToken(req, res, next) {
    const refresh_token = req.body.refresh_token;
    try {
      if (!refresh_token) {
        req.errorStatus = 403;
        next(new Error('Access is forbidden.User does not exist'));
      }
      const decoded = await Jwt.jwtVerifyRefreshToken(refresh_token);
      req.user = decoded;
      next();
    } catch (e) {
      req.errorStatus = 403;
      // next(e);
      next(new Error('Your session expired! Please sign in again...'));
    }
  }

    static adminRole(req, res, next) {
    const user = req.user;
    if (user.type !== 'admin') {
      // req.errorStatus = 401;
      next(new Error('User is unauthorized '));
    }
    next();
  }

}