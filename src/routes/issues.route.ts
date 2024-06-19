import { Router } from 'express';
import { Routes } from '@interfaces/routes.interface';
import { IssueController } from '@/controllers/issues.controller';
import { AuthMiddleware } from '@/middlewares/auth.middleware';

export class IssueRoute implements Routes {
  public path = '/issues';
  public router = Router();
  public issue = new IssueController();

  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.get(`${this.path}`, AuthMiddleware, this.issue.getIssues);
    this.router.get(`${this.path}/:issue_id/files/:file_id`, AuthMiddleware, this.issue.getFiles);
    this.router.patch(`${this.path}/:issue_id`, AuthMiddleware, this.issue.updateIssue);
    this.router.post(`${this.path}/:issue_id/tags`, AuthMiddleware, this.issue.attachTagToIssue);
  }
}
