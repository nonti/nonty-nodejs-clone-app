import { body, query } from "express-validator";
import User from "../models/User";

export class RestaurantValidators{
  
  static addRestaurant() {
    return [
      body('name', 'Owner Name is required').isString(),  
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
      body('phone', 'Phone number is required').isString(),
      body('password', 'Password is required').isAlphanumeric()
        .isLength({ min: 8, max: 20 })
        .withMessage('Password must be between 8  and 20 characters'),
      body('restaurantImages', 'Banner image is required')
        .custom((restaurantImages, { req }) => {
          if (req.file) {
            return true;
          } else {
            // throw new Error('File not uploaded');
            throw ('File not uploaded');
          }
        }),
      body('res_name', 'Restaurant Name is required').isString(),        
      body('short_name', 'Restaurant Name is required').isString(),        
      body('open_time', 'Opening time is required').isString(),        
      body('close_time', 'Closing time is required').isString(),        
      body('price', 'Price time is required').isString(),        
      body('delivery_time', 'Price time is required').isString(),            
      body('status', 'Status is required').isString(),
      body('address', 'Address is required').isString(),        
      body('location', 'Location is required').isString(),   
      body('cuisines', 'Cuisines is required').isString(),   
      body('city_id', 'City is required').isString(),   
    ];
  }

  static getNearbyRestaurant() {
    return [
      query('lat', 'Latitude is required').isNumeric(),        
      query('lng', 'Longitude is required').isNumeric(),      
      query('radius', 'Radius is required').isNumeric(),      
    ];
  }

  static searchNearbyRestaurant() {
    return [
      query('lat', 'Latitude is required').isNumeric(),        
      query('lng', 'Longitude is required').isNumeric(),      
      query('radius', 'Radius is required').isNumeric(),      
      query('name', 'Search query is required').isString(),      
    ];
  }
}