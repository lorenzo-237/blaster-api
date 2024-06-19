import { NewPackageDto, UpdatePackageDto } from '@/dtos/packages.dto';
import { HttpException } from '@/exceptions/httpException';
import { PackageParams } from '@/params/packages.param';
import { ProjectParams } from '@/params/projects.param';
import { PackageService } from '@/services/packages.service';
import { NextFunction, Request, Response } from 'express';
import { Container } from 'typedi';

export class PackageController {
  public package = Container.get(PackageService);

  public getPackages = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { project_id } = req.query as unknown as ProjectParams;

      if (!project_id) {
        throw new HttpException(400, 'You must set <project_id>');
      }

      const packages = await this.package.findAllPackages(+project_id);

      res.status(200).json(packages);
    } catch (error) {
      next(error);
    }
  };

  public createPackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as unknown as NewPackageDto;

      if (!dto.project_id) {
        throw new HttpException(400, 'You must set <project_id>');
      }

      if (!dto.version) {
        throw new HttpException(400, 'You must set <version>');
      }

      if (!dto.html) {
        throw new HttpException(400, 'You must set <html>');
      }

      const packages = await this.package.newPackage(dto);

      res.status(200).json(packages);
    } catch (error) {
      next(error);
    }
  };

  public updatePackage = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const dto = req.body as unknown as UpdatePackageDto;
      const { package_id } = req.params as unknown as PackageParams;

      if (!package_id) {
        throw new HttpException(400, 'You must set <package_id>');
      }

      if (!dto.clientChangelog) {
        throw new HttpException(400, 'You must set <clientChangelog>');
      }

      if (dto.obsolete === undefined || dto.obsolete === null) {
        throw new HttpException(400, 'You must set <obsolete>');
      }

      const packages = await this.package.updatePackage(+package_id, dto);

      res.status(200).json(packages);
    } catch (error) {
      next(error);
    }
  };
}
