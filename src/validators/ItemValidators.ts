import { body, param } from 'express-validator';
import Restaurant from '../models/Restaurant';
import Category from '../models/Category';

export class ItemValidators {

  static addItem() {
    return [
      body('itemImages', 'Cover image is required')
        .custom((itemImages, { req }) => {
          if (req.file) {
            return true;
          } else {
            // throw new Error('File dnot uploaded');
            throw ('File not uploaded');
          }
        }),  
      body('name', 'Item Name is required').isString(),
      body('restaurant_id', 'Restaurant Id is required').isString()
        .custom((restaurant_id, { req }) => {
          return Restaurant.findById(restaurant_id).then(restaurant => {
            if (restaurant) {
              return true;
            } else {
              // throw new Error('Restaurant does not Exist');
              throw ('Restaurant does not Exist');
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
      
      body('category_id', 'Category Id  is required').isString()
        .custom((category_id, { req }) => {
          return Category.findOne({ _id: category_id, restaurant_id: req.body.restaurant_id}).then(category => {
            if (category) {
              return true;
            } else {
              // throw new Error('Category does not Exist');
              throw ('Category does not Exist');
            }
          }).catch(err => {
            throw new Error(err);
          })
        }),
      body('price', 'Category Id  is required').isString(),
      body('veg', 'Item veg or not is required').isBoolean(),
      body('status', 'Status is required').isBoolean(), 
    ];
  }

  static getMenuItems() {
    return [
      param('restaurantId', 'Restaurant Id is required').isString()
        .custom((restaurant_id, { req }) => {
          return Restaurant.findById(restaurant_id).then(restaurant => {
            if (restaurant) {
              req.restaurant = restaurant;
              return true;
            } else {
              // throw new Error('Restaurant does not Exist');
              throw ('Restaurant does not Exist');
            }
          }).catch(err => {
            throw new Error(err);
        })
      }),
    ];
  }
}