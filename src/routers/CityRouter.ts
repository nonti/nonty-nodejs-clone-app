import { Router } from 'express';
import { CityController } from '../controllers/CityController';
import { CityValidators } from '../validators/CityValidators';
import { GlobalMiddleWare } from '../middlewares/GlobalMiddleWare';


class CityRouter {
  
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
    this.router.get('/cities', CityController.getCities);
  }

  postRoutes() {
    this.router.post('/create', CityValidators.addCity(), GlobalMiddleWare.checkError, CityController.addCity);
  }

  patchRoutes() {

  }
    
  deleteRoutes() { }

  putRoutes() { }
}

export default new CityRouter().router;