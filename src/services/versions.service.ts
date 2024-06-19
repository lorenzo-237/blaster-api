import { PrismaMantis } from '@/config/prisma';
import { VersionSimple } from '@/interfaces/versions.interface';
import { Service } from 'typedi';
import { compareByTimestampDesc } from '@/utils/versions.utils';
import { mantisPOST_NoContent } from '@/mantis/mantis.request';
import { NewVersionDto } from '@/dtos/projects.dto';

@Service()
export class VersionService {
  public version = PrismaMantis.version;

  public async findAllVersions(project_id: number, obsolete: boolean | undefined): Promise<VersionSimple[]> {
    const versionsMysql = await this.version.findMany({
      where: {
        project_id,
        obsolete: obsolete,
      },
      orderBy: {
        version: 'desc',
      },
    });
    const versions = versionsMysql.map(v => ({
      description: v.description,
      id: v.id,
      name: v.version,
      released: v.released,
      obsolete: v.obsolete,
      timestamp: new Date(v.date_order * 1000),
    }));

    return versions.sort(compareByTimestampDesc);
  }

  public async createVersion(mantisToken: string, project_id: number, dto: NewVersionDto) {
    const url = `/projects/${project_id}/versions`;
    const response = await mantisPOST_NoContent(url, dto, mantisToken);

    return response;
  }
}
