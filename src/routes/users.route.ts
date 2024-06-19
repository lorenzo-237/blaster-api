import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { CreateUserDto, VerifyTokenDto } from '@/dtos/users.dto';
import { AdminMiddleware } from '@/middlewares/admin.middleware';
import { UserController } from '@/controllers/users.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class UserRoute implements Routes {
  public path = '/users';
  public router = Router();
  public user = new UserController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}/me`, AuthMiddleware, this.user.getMyUserInfo);
    this.router.post(`${this.path}/verify`, ValidationMiddleware(VerifyTokenDto), this.user.verifyToken);
    this.router.post(`${this.path}`, AdminMiddleware, ValidationMiddleware(CreateUserDto), this.user.newUser);
  }
}
