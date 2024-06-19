import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { PackageController } from '@/controllers/packages.controller';

export class PackageRoute implements Routes {
  public path = '/packages';
  public router = Router();
  public package = new PackageController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, this.package.getPackages);
    this.router.post(`${this.path}`, this.package.createPackage);
    this.router.patch(`${this.path}/:package_id`, this.package.updatePackage);
  }
}
