import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { GlobalMiddleWare } from '../middlewares/GlobalMiddleWare';
import { OrderValidators } from '../validators/OrderValidators';

export class OrderRouter {

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
    this.router.get('/userOrders', GlobalMiddleWare.auth, OrderController.getUserOrders);
    
  }

  postRoutes() {
    this.router.post('/create', GlobalMiddleWare.auth, GlobalMiddleWare.adminRole, OrderValidators.placeOrder(), GlobalMiddleWare.checkError, OrderController.placeOrder);
  }

  putRoutes() {
    
  }

  deleteRoutes() {
  }

  patchRoutes() {
    
  }
}

export default new OrderRouter().router;