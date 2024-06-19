import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { ProjectController } from '@/controllers/projects.controller';
import { ValidationMiddleware } from '@/middlewares/validation.middleware';
import { NewVersionDto } from '@/dtos/projects.dto';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class ProjectRoute implements Routes {
  public path = '/projects';
  public router = Router();
  public project = new ProjectController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.project.getProjects);
    this.router.get(`${this.path}/:project_id/versions`, AuthMiddleware, this.project.getVersions);
    this.router.get(`${this.path}/:project_id/filters`, AuthMiddleware, this.project.getFilters);
    this.router.get(`${this.path}/:project_id/categories`, AuthMiddleware, this.project.getProjectCategories);
    this.router.post(`${this.path}/:project_id/versions`, AuthMiddleware, ValidationMiddleware(NewVersionDto), this.project.createProjectVersion);
  }
}
