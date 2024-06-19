import { Container } from 'typedi';
import { NextFunction, Request, Response } from 'express';
import { ChangelogService } from '@/services/changelogs.service';
import htmlToPdf from '@/utils/htmlToPdf';
import htmlTemplate from '@/constants/htmlTemplate';
import { IssuesQueries } from '@/queries/issues.query';
import { HttpException } from '@/exceptions/httpException';
import { ChangelogPdfDto } from '@/dtos/changelogs.dto';

export class ChangelogController {
  public changelog = Container.get(ChangelogService);

  public getMarkdownChangelogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const query = req.query as unknown as IssuesQueries;

      if (!query.project_id) {
        throw new HttpException(400, 'You must set <project_id>');
      }
      query.project_id = +query.project_id;

      if (!query.fixed_in_version) {
        throw new HttpException(400, 'You must set <fixed_in_version>');
      }

      const data = await this.changelog.generateChangelogMd(query);

      res.status(200).json(data);
    } catch (error) {
      next(error);
    }
  };

  public getHtmlChangelog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as ChangelogPdfDto;
      const query = req.query as unknown as IssuesQueries;

      if (!query.project_id) {
        throw new HttpException(400, 'You must set <project_id>');
      }
      query.project_id = +query.project_id;

      if (!query.fixed_in_version) {
        throw new HttpException(400, 'You must set <fixed_in_version>');
      }

      const { html, categories } = await this.changelog.generateChangelogHtml(query);
      const combinedHtml = !body.htmlHeader ? html : body.htmlHeader + html;
      const htmlPage = htmlTemplate(combinedHtml);

      res.status(200).send({ html: htmlPage, categories });
    } catch (error) {
      next(error);
    }
  };

  public getPdfChangelog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const body = req.body as ChangelogPdfDto;
      const query = req.query as unknown as IssuesQueries;

      if (!query.project_id) {
        throw new HttpException(400, 'You must set <project_id>');
      }
      query.project_id = +query.project_id;

      if (!query.fixed_in_version) {
        throw new HttpException(400, 'You must set <fixed_in_version>');
      }

      const versionName = query.fixed_in_version;
      const { html } = await this.changelog.generateChangelogHtml(query);
      const combinedHtml = !body.htmlHeader ? html : body.htmlHeader + html;
      const pdfBuffer = await htmlToPdf(htmlTemplate(combinedHtml));

      // Définir le nom du fichier PDF
      const fileName = `changelog_${versionName}.pdf`;

      // Définir l'en-tête Content-Disposition avec le nom de fichier
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

      res.contentType('application/pdf');
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  };
}
