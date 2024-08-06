import { body } from "express-validator";

export class BannerValidators{
  static addBanner() {
    return [
      body('bannerImages', 'Cover image is required')
        .custom((bannerImages, { req }) => {
          if (req.file) {
            return true;
          } else {
            // throw new Error('File not uploaded');
            throw ('File not uploaded');
          }
        }),
    ];
  }
}