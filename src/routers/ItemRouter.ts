
import { Router } from 'express';
import { ItemController } from '../controllers/ItemController';
import { GlobalMiddleWare } from '../middlewares/GlobalMiddleWare';
import { ItemValidators } from '../validators/ItemValidators';
import { Utils } from '../utils/Utils';

export class ItemRouter {

  public router: Router;

  constructor() {
    this.router = Router();
    this.getRoutes();
    this.deleteRoutes();
    this.patchRoutes();
    this.postRoutes();
    this.putRoutes();
  }

  getRoutes() {
    this.router.get('/menuItems/:restaurantId',  GlobalMiddleWare.auth, ItemValidators.getMenuItems(), GlobalMiddleWare.adminRole , ItemController.getMenu);
  }

  postRoutes() {
    this.router.post('/create', GlobalMiddleWare.auth, GlobalMiddleWare.adminRole, new Utils().multer.single('itemImages'), ItemValidators.addItem(), GlobalMiddleWare.checkError, ItemController.addItem);
  }
  
  putRoutes() { }

  deleteRoutes() { }

  patchRoutes() {  }
}

export default new ItemRouter().router;

