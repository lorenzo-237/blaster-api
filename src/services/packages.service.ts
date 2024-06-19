import { PrismaBlaster } from '@/config/prisma';
import { NewPackageDto, UpdatePackageDto } from '@/dtos/packages.dto';
import { Package } from '@/interfaces/package.interface';
import { Service } from 'typedi';

@Service()
export class PackageService {
  public packages = PrismaBlaster.package;

  public async findAllPackages(project_id: number): Promise<Package[]> {
    const findPackage = await this.packages.findMany({
      where: {
        projectId: project_id,
      },
      orderBy: {
        version: 'desc',
      },
    });

    return findPackage;
  }

  public async newPackage(dto: NewPackageDto): Promise<Package> {
    const modifyPackage = await this.packages.upsert({
      where: {
        projectId_version: {
          version: dto.version,
          projectId: dto.project_id,
        },
      },
      create: {
        htmlHeader: dto.html,
        version: dto.version,
        projectId: dto.project_id,
        clientChangelog: '',
        obsolete: false,
      },
      update: {
        htmlHeader: dto.html,
      },
    });

    return modifyPackage;
  }

  public async updatePackage(packageId: number, dto: UpdatePackageDto): Promise<Package> {
    const updatedPackage = await this.packages.update({
      data: {
        clientChangelog: dto.clientChangelog,
        obsolete: dto.obsolete,
      },
      where: {
        id: packageId,
      },
    });

    return updatedPackage;
  }
}
