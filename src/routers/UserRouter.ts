import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { UserValidator } from "../validators/UserValidators";
import { GlobalMiddleWare } from "../middlewares/GlobalMiddleWare";
import { Utils } from "../utils/Utils";


class UserRouter {
  
  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.patchRoutes();
    this.postRoutes();
    this.putRoutes();
    this.deleteRoutes();
  }

  getRoutes() {
    this.router.get('/send/verification/email',GlobalMiddleWare.auth, UserController.resendVerificationEmail);
    this.router.get('/signin', UserValidator.signin(),  GlobalMiddleWare.checkError , UserController.signin);
    this.router.get('/send/reset/password/token', UserValidator.checkResetPasswordEmail(),  GlobalMiddleWare.checkError , UserController.sendResetPasswordOtp);
    this.router.get('/verify/resetPasswordToken', UserValidator.verifyResetPasswordToken(),  GlobalMiddleWare.checkError , UserController.verifyResetPasswordToken);
    this.router.get('/profile', GlobalMiddleWare.auth, UserController.profile);
  }

  postRoutes() {
    this.router.post('/signup',  UserValidator.signup(), GlobalMiddleWare.checkError , UserController.signup);
    this.router.post('/refreshToken', GlobalMiddleWare.decodeRefreshToken , UserController.getNewToken);
    this.router.post('/signout', GlobalMiddleWare.auth , GlobalMiddleWare.decodeRefreshToken , UserController.logout);
  }

  patchRoutes() {
    this.router.patch('/reset/password', UserValidator.resetPassword(), GlobalMiddleWare.checkError,  UserController.resetPassword);
    this.router.patch('/verify/emailToken',  GlobalMiddleWare.auth, UserValidator.verifyUserEmailToken(), GlobalMiddleWare.checkError, UserController.verifyUserEmailToken);
    this.router.patch('/update/phone',  GlobalMiddleWare.auth, UserValidator.verifyPhone(), GlobalMiddleWare.checkError, UserController.updatePhoneNumber);
    this.router.patch('/update/profile',  GlobalMiddleWare.auth, UserValidator.verifyUserProfile(), GlobalMiddleWare.checkError, UserController.updateUserProfile);

  }
    
  deleteRoutes() { }

  putRoutes() {
    this.router.put('/update/profilePic',  GlobalMiddleWare.auth, new Utils().multer.single('profileImages'), UserValidator.verifyUserProfilePic(), GlobalMiddleWare.checkError, UserController.updateUserProfilePic);

  }
}

export default new UserRouter().router;