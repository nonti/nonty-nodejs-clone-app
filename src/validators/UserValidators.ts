import { body, query } from "express-validator";
import User from "../models/User";

export class UserValidator {
  
  static signup() {
    return [
      body('name', 'Name is required').isString(),
      body('email', 'Email is required').isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email
          }).then(user => {
            if (user) {
              // throw new Error('User Already Exists');
              throw ('User Already Exists');
            } else {
              return true;
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
      body('password', 'Password is required').isAlphanumeric()
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8  and 20 characters'),
      body('type', 'User role type is required').isString(),
      body('status', 'User status is required').isString(),
      body('phone', 'Phone number is required').isString(),
    ];
  }

  static verifyUserEmailToken() {
    return [
      body('verification_token', 'Email Verification token is required').isNumeric(),
    ]
  }

  static signin() {
    return [
      query('email', 'Email is required').isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email
          }).then(user => {
            if (user) {
              //Check role
              if (user.type === 'user' || user.type === 'admin') {
                req.user = user;
                return true;
              } else {
                // throw new Error('You are not an authorised user');
              throw ('You are not an authorised user');
              }
            } else {
              // throw new Error('No user registered with such email);
              throw ('No user registered with such email');
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
      query('password', 'Password is required').isAlphanumeric()
    ];  
  }
  
  static checkResetPasswordEmail() {
    return [
      query('email', 'Email is required').isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email
          }).then(user => {
            if (user) {
              return true;
            } else {
              // throw new Error('User Does not  Exists');
              throw ('No user with such email');
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
    ];  
  }
  static verifyResetPasswordToken() {
    return [
      query('email', 'Email is required').isEmail(),
      query('reset_password_token', 'Reset Password token is required').isNumeric()
        .custom((reset_password_token, { req }) => {
          return User.findOne({
            email: req.query.email,
            reset_password_token: reset_password_token,
            reset_password_token_time: {$gt: Date.now()}
          }).then(user => {
            if (user) {
              return true;
            } else {
              // throw new Error('User Does not  Exists');
              throw ('Reset password token does not exist.Please regenerate a new one');
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
    ];  
  }

  static resetPassword() {
    return [
      body('email', 'Email is required').isEmail()
        .custom((email, { req }) => {
          return User.findOne({
            email: email
          }).then(user => {
            if (user) {
              req.user = user;
              return true;
            } else {
              // throw new Error('No User registered with such email');
              throw ('No User registered with such email');
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
      body('new_password', 'New Password is required').isAlphanumeric(),
      body('otp', 'Reset Password token is required').isNumeric()
        .custom((reset_password_token, { req }) => {
          if (req.user.reset_password_token === reset_password_token) {
              return true
          } else {
            req.errorStatus = 422;
            // throw new Error('Reset Password token is  invalid, please try again');
              throw ('Reset Password token is  invalid, please try again');
          }
        })
    ];  
  }

  static verifyPhone() {
    return [
      body('phone', 'Phone Number is required').isString(),
    ];  
  }

  static verifyUserProfile() {
    return [
      body('phone', 'Phone Number is required').isString(),
      body('email', 'Email is required').isEmail()
        .custom((email, { req }) => {
          // console.log(email);
          // if (req.user.email == email) throw('Please provide a  new unique email address to update the profile');
          return User.findOne({
            email: email
          }).then(user => {
            if (user) {
                 // throw new Error('User entered with email already exists, please provide a unique email id');
              throw ('User entered with email already exists, please provide a unique email id');
            } else {
              return true;
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
      body('password', 'Password is required').isAlphanumeric(),
      
    ];  
  }

  // static checkRefreshToken() {
  //   return [
  //     body('refresh_token', 'Refesh Token is required').isString()
  //       .custom((refresh_token, { req }) => {
  //         if (refresh_token) {
  //           return true;
  //         } else {
  //           req.errorStatus = 403;
  //           // throw new Error('Access is forbidden');
  //           throw ('Access is forbidden');
  //         }
  //       })
  //   ];
  // }

  static verifyUserProfilePic() {
    return [
      body('profileImages', 'Profile image is required')
        .custom((profileImages, { req }) => {
          if (req.file) {
            return true;
          } else {
            // throw new Error('File not uploaded');
            throw ('File not uploaded');
          }
        })
    ]
  }

}