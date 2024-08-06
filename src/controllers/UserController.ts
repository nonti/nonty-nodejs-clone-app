import User from '../models/User';
import { NodeMailer } from '../utils/NodeMailer';
import { Utils } from '../utils/Utils';
import { Jwt } from '../utils/Jwt';
import { Redis } from '../utils/Redis';

export class UserController {
  static async signup(req, res, next) {

    const name = req.body.name;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const type = req.body.type;
    const status = req.body.status;
    const verification_token = Utils.generateVerificationToken();

    try {
      const hash = await Utils.encryptPassword(password);
      const data = {
        email,
        verification_token,
        verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        password: hash,
        name,
        phone,
        type,
        status,
      };
      
      const user = await new User(data).save();
      const user_data = {
        email: user.email,
        email_verified: user.email_verified,
        phone: user.phone,
        name: user.name,
        photo: user.photo || null,
        type: user.type,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
      const payload = {
        // user_id: user._id,
        // aud: user._id,
        email: user.email,
        type: user.type,
      };
      const access_token = Jwt.jwtSign(payload, user._id);
      const refresh_token = await Jwt.jwtSignRefreshToken(payload, user._id);
      res.json({
        token: access_token,
        refresh_token: refresh_token,
        user: user_data
      });
      //send email to user for verification
      await NodeMailer.sendMail({
        to: [email],
        subject: 'Email Verification',
        html: `<h1> Your Otp is ${verification_token}</h1>`
      });
    } catch (err) {
      next(err);
    }
  }

  static async verifyUserEmailToken(req, res, next) {
    const verification_token = req.body.verification_token;
    const email = req.user.email;
    try {
      const user = await User.findOneAndUpdate(
        {
          email: email,
          verification_token: verification_token,
          verification_token_time: { $gt: Date.now() },
        },
        {
          email_verified: true,
          updated_at: new Date(),
        },
        {
          new: true,
          projection: {
            verification_token: 0,
            verification_token_time: 0,
            password: 0,
            reset_password_token: 0,
            reset_password_token_time: 0,
            __v: 0,
            _id: 0
          }
        }
      );
      if (user) {
        res.send(user);
      } else {
        throw new Error(
          'Wrong Otp or Email Verification Token expired. Please try again...'
        );
      }
    } catch (error) {
      next(error);
    }
  }

  static async resendVerificationEmail(req, res, next) {
    const email = req.user.email;
    const verification_token = Utils.generateVerificationToken();

    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          updated_at: new Date(),
          verification_token: verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: 'Resend Email Verification',
          html: `<h1> Your Otp is ${verification_token}</h1>`
        });
      } else {
        throw new Error('User does not exist');
      }
    } catch (error) {
      next(error);
    }
  }

  static async signin(req, res, next) {
    const user = req.user;
    const password = req.query.password;
    const data = {
      password,
      encrypt_password: user.password
    };
    try {
      await Utils.comparePassword(data);
      const payload = {
        // user_id: user._id,
        // aud: user._id,
        email: user.email,
        type: user.type
      }
      const access_token = Jwt.jwtSign(payload, user._id);
      const refresh_token = await Jwt.jwtSignRefreshToken(payload, user._id);
      const user_data = {
        email: user.email,
        email_verified: user.email_verified,
        phone: user.phone,
        name: user.name,
        photo: user.photo || null,
        type: user.type,
        status: user.status,
        created_at: user.created_at,
        updated_at: user.updated_at
      };
      res.json({
        token: access_token,
        refresh_token: refresh_token,
        user: user_data
      });
    } catch (e) {
      next(e)
    }
  }

  static async sendResetPasswordOtp(req, res, next) {
    const email = req.query.email;
    const reset_password_token = Utils.generateVerificationToken();

    try {
      const user = await User.findOneAndUpdate(
        { email: email },
        {
          updated_at: new Date(),
          reset_password_token: reset_password_token,
          reset_password_token_time: Date.now() + new Utils().MAX_TOKEN_TIME
        }
      );
      if (user) {
        res.json({ success: true });
        await NodeMailer.sendMail({
          to: [user.email],
          subject: 'Reset email Verification Otp',
          html: `<h1> Your Otp is ${reset_password_token}</h1>`
        });
      } else {
        throw new Error('User does not exist');
      }
    } catch (error) {
      next(error);
    }
  }

  static verifyResetPasswordToken(req, res, next) {
    res.json({ success: true });
  }

  static async resetPassword(req, res, next) {
    const user = req.user;
    const new_password = req.body.new_password;

    try {
      const encrypted_password = await Utils.encryptPassword(new_password);
      const updated_user = await User.findByIdAndUpdate(
        user._id,
        {
          updated_at: new Date(),
          password: encrypted_password,
        },
        {
          new: true,
          projection: {
            verification_token: 0,
            verification_token_time: 0,
            password: 0,
            reset_password_token: 0,
            reset_password_token_time: 0,
            __v: 0,
            _id: 0
          }
        }
      );
      if (updated_user) {
        res.send(updated_user);
      } else {
        throw new Error('User does not exist');
      }
    } catch (error) {
      next(error);
    }
  }


  static async profile(req, res, next) {
    const user = req.user;
    try {
      const profile = await User.findById(user.aud);
      if (profile) {
        const user_data = {
        email: profile.email,
        email_verified: profile.email_verified,
        phone: profile.phone,
        name: profile.name,
        photo: profile.photo || null,
        type: profile.type,
        status: profile.status,
        created_at: profile.created_at,
        updated_at: profile.updated_at
        };
        // res.sed(profile)
        res.send(user_data);
      } else {
        throw new Error('User does not exist');
      }
    } catch (error) {
      next(error);
    }
  }

  static async updatePhoneNumber(req, res, next) {
    const user = req.user;
    const phone = req.body.phone;
    try {
      const userData = await User.findByIdAndUpdate(
        user.aud,
        { phone: phone },
        {
          new: true,
          projection: {
            verification_token: 0,
            verification_token_time: 0,
            password: 0,
            reset_password_token: 0,
            reset_password_token_time: 0,
            __v: 0,
            _id: 0
          }
        }
      );
      res.send(userData);
    } catch (error) {
      next(error);
    }
  }

  static async updateUserProfile(req, res, next) {
    const user = req.user;
    const phone = req.body.phone;
    const new_email = req.body.email;
    const plain_password = req.body.password;
    const verification_token = Utils.generateVerificationToken();
    try {
      const userData = await User.findById(user.aud);
      if (!userData) throw new Error('User does not exist');
      await Utils.comparePassword({
        password: plain_password,
        encrypt_password: userData.password
      });
      const updated_user = await User.findByIdAndUpdate(
        user.aud,
        {
          phone: phone,
          email: new_email,
          email_verified: false,
          verification_token,
          verification_token_time: Date.now() + new Utils().MAX_TOKEN_TIME,
        },
        {
          new: true,
          projection: {
            verification_token: 0,
            verification_token_time: 0,
            password: 0,
            reset_password_token: 0,
            reset_password_token_time: 0,
            __v: 0,
            _id: 0
          }
        }
      );
      const payload = {
        // user_id: user._id,
        // aud: user.aud,
        email: updated_user.email,
        type: updated_user.type,
      }
      const access_token = Jwt.jwtSign(payload, user.aud);
      const refresh_token = await Jwt.jwtSignRefreshToken(payload, user.aud);
      res.json({
        token: access_token,
        refresh_token: refresh_token,
        user: updated_user
      });
      //send email to user for verification
      await NodeMailer.sendMail({
        to: [updated_user.email],
        subject: 'Email Verification',
        html: `<h1> Your Otp is ${verification_token}</h1>`
      });
    } catch (error) {
      next(error);
    }
  }

  static async getNewToken(req, res, next) {
    // const refresh_token = req.body.refresh_token;
    const decoded_data = req.user;
    try {
        if (decoded_data) {
          const payload = {
          // user_id: decoded_data.aud,
            email: decoded_data.email,
            type: decoded_data.type,
          };
      const access_token = Jwt.jwtSign(payload, decoded_data.aud);
      const refresh_token = await Jwt.jwtSignRefreshToken(payload, decoded_data.aud);
      res.json({
        access_token: access_token,
        refresh_token: refresh_token,
      });
      } else {
        req.errorStatus = 403;
        throw ('Access is forbidden');
      }
    } catch (err) {
      req.errorStatus = 403;
      next(err);
    }
  }
  static async logout(req, res, next) {
    // const refresh_token = req.body.refresh_token;
    const decoded_data = req.user;

    try {
      if (decoded_data) {
        // delete refresh_token from redis database;
        await Redis.deleteKey(decoded_data.aud);
        res.json({success: true})
      } else {
        req.errorStatus = 403;
        throw ('Access is forbidden');
      }
    } catch (err) {
      req.errorStatus = 403;
      next(err);
    }
  }

  static async updateUserProfilePic(req, res, next) {
    const path = req.file.path;
    const user = req.user;
    try {
      const updated_user = await User.findByIdAndUpdate(
        user.aud,
        {
          photo: path,
          updated_at: new Date()
        },
        {
          new: true,
          projection: {
            verification_token: 0,
            verification_token_time: 0,
            password: 0,
            reset_password_token: 0,
            reset_password_token_time: 0,
            __v: 0,
            _id: 0
          }
        }
      );
      res.send(updated_user);
    } catch (e) {
      next(e);
    }
  }
}
