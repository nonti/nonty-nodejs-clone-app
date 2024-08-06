import { Router } from 'express';
import { RestaurantController } from '../controllers/RestaurantController';
import { GlobalMiddleWare } from '../middlewares/GlobalMiddleWare';
import { RestaurantValidators } from '../validators/RestaurantValidators';
import { Utils } from '../utils/Utils';

class RestaurantRouter {
  
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
    this.router.get('/getRestaurants',GlobalMiddleWare.auth,  GlobalMiddleWare.adminRole, RestaurantController.getRestaurant);
    this.router.get('/getNearbyRestaurants',GlobalMiddleWare.auth, RestaurantValidators.getNearbyRestaurant(), GlobalMiddleWare.checkError, RestaurantController.getNearbyRestaurant);
    this.router.get('/searchNearbyRestaurants',GlobalMiddleWare.auth, RestaurantValidators.searchNearbyRestaurant(), GlobalMiddleWare.checkError, RestaurantController.searchNearbyRestaurant);
  }

  postRoutes() {
    this.router.post('/create', GlobalMiddleWare.auth, GlobalMiddleWare.adminRole, new Utils().multer.single('restaurantImages'), RestaurantValidators.addRestaurant(),GlobalMiddleWare.checkError,  RestaurantController.addRestaurant);
  }

  patchRoutes() {

  }
    
  deleteRoutes() { }

  putRoutes() { }
}

export default new RestaurantRouter().router;