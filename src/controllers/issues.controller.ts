import { Container } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { IssuesService } from '@/services/issues.service';
import { IssuesQueries } from '@/queries/issues.query';
import { HttpException } from '@/exceptions/httpException';
import { IssueFilesParams, IssueParams } from '@/params/issues.param';
import { AttachTagsDto, UpdateIssueDto } from '@/dtos/issues.dto';
import { RequestWithUser } from '@/interfaces/auth.interface';

export class IssueController {
  public issue = Container.get(IssuesService);

  public getIssues = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IssuesQueries;

      if (!query.project_id) {
        next(new HttpException(400, 'You must set <project_id>'));
        return;
      }
      query.project_id = +query.project_id;
      query.category_id = +query.category_id;

      if (!query.page) query.page = 1;
      if (!query.page_size) query.page_size = 50;

      const data = await this.issue.findAllIssues(query);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getFiles = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = req.params as unknown as IssueFilesParams;

      if (!params.issue_id) {
        next(new HttpException(400, 'You must set <issue_id>'));
        return;
      }

      if (!params.file_id) {
        next(new HttpException(400, 'You must set <file_id>'));
        return;
      }

      const data = await this.issue.findIssueFiles(req.user.token, params);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public updateIssue = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = req.params as unknown as IssueParams;

      if (!params.issue_id) {
        next(new HttpException(400, 'You must set <issue_id>'));
        return;
      }

      const dto = req.body as UpdateIssueDto;

      if (!dto.fixed_in_version && !dto.target_version && !dto.status && !dto.notes) {
        next(new HttpException(400, 'You must set <fixed_in_version> or <target_version> or <status> or <notes>'));
        return;
      }

      if (dto.fixed_in_version) {
        const issue = await this.issue.fixIssue(req.user.token, +params.issue_id, req.user.mantis.user.name, {
          fixed_in_version: dto.fixed_in_version,
          notes: dto.notes,
        });
        res.status(200).json(issue);
        return;
      }

      const issue = await this.issue.updateMinimal(req.user.token, +params.issue_id, req.user.mantis.user.name, dto);
      res.status(200).json(issue);
    } catch (error) {
      next(error);
    }
  };

  public attachTagToIssue = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
    try {
      const params = req.params as unknown as IssueParams;

      if (!params.issue_id) {
        next(new HttpException(400, 'You must set <issue_id>'));
        return;
      }

      const dto = req.body as AttachTagsDto;

      if (dto.tags.length <= 0) {
        next(new HttpException(400, 'You must set <tags> array'));
        return;
      }

      const issue = await this.issue.attachTags(req.user.token, +params.issue_id, dto);

      res.status(201).json(issue);
    } catch (error) {
      next(error);
    }
  };
}
