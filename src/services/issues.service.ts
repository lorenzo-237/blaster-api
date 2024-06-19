import { PrismaMantis } from '@/config/prisma';
import { AttachTagsDto, FixIssueDto, UpdateIssueDto } from '@/dtos/issues.dto';
import { FileMantis, IssueMantis } from '@/interfaces/mantis.interface';
import { mantisGET, mantisPATCH, mantisPOST } from '@/mantis/mantis.request';
import { IssueFilesParams } from '@/params/issues.param';
import { IssuesQueries } from '@/queries/issues.query';
import { compareByCategoryAndLastUpdatedAsc, formatIssue, formatIssueMysql, statusToInt } from '@/utils/issues.utils';
import { Service } from 'typedi';

@Service()
export class IssuesService {
  public issue = PrismaMantis.issue;

  public async findAllIssues(queries: IssuesQueries) {
    if (!queries.page) queries.page = 1;
    if (!queries.page_size) queries.page_size = 50;

    const { project_id, fixed_in_version, target_version, status, version, category_id } = queries;

    const issues = await this.issue.findMany({
      where: {
        project_id,
        fixed_in_version: fixed_in_version ? fixed_in_version : undefined,
        target_version: target_version ? target_version : undefined,
        status: status ? +status : undefined,
        version: version ? version : undefined,
        category_id: category_id ? category_id : undefined,
      },
      include: {
        category: true,
        bugText: true,
        tags: {
          select: {
            tag: {
              select: {
                id: true,
                name: true,
                description: true,
              },
            },
          },
        },
        handler: {
          select: {
            id: true,
            email: true,
            username: true,
            realname: true,
          },
        },
        reporter: {
          select: {
            id: true,
            email: true,
            username: true,
            realname: true,
          },
        },
      },
    });

    const issuesMysql = issues.map(issue => formatIssueMysql(issue));
    return issuesMysql.sort(compareByCategoryAndLastUpdatedAsc);
  }

  public async findIssueFiles(mantisToken: string, params: IssueFilesParams) {
    const url = `/issues/${params.issue_id}/files/${params.file_id}`;
    const data = await mantisGET<{ files: FileMantis[] }>(url, mantisToken);

    return data;
  }

  public mapNotes(reporterName: string, notes?: string[]) {
    if (!notes) {
      return undefined;
    }
    if (notes.length <= 0) {
      return undefined;
    }
    return notes.map(note => ({
      reporter: {
        name: reporterName,
      },
      text: note,
      view_state: {
        name: 'public',
      },
      type: 'note',
    }));
  }

  public async fixIssue(mantisToken: string, issue_id: number, reporterName: string, dto: FixIssueDto) {
    const url = `/issues/${issue_id}`;

    const noteMantis = this.mapNotes(reporterName, dto.notes);

    const payload = {
      fixed_in_version: {
        name: dto.fixed_in_version.name,
      },
      status: {
        name: 'resolved',
      },
      resolution: {
        name: 'fixed',
      },
      notes: noteMantis,
    };

    const data = await mantisPATCH<{ issues: IssueMantis[] }>(url, payload, mantisToken);

    const issues = data.issues.map(issue => formatIssue(issue));

    if (issues.length <= 0) return null;

    return issues[0];
  }

  public async updateMinimal(mantisToken: string, issue_id: number, reporterName: string, dto: UpdateIssueDto) {
    const url = `/issues/${issue_id}`;

    const noteMantis = this.mapNotes(reporterName, dto.notes);

    const payload = {
      target_version: dto.target_version
        ? {
            name: dto.target_version.name,
          }
        : undefined,
      status: dto.status
        ? {
            id: statusToInt(dto.status.name),
          }
        : undefined,
      resolution: dto.status
        ? {
            name: 'open',
          }
        : undefined,
      notes: noteMantis,
    };

    const data = await mantisPATCH<{ issues: IssueMantis[] }>(url, payload, mantisToken);

    const issues = data.issues.map(issue => formatIssue(issue));

    if (issues.length <= 0) return null;

    return issues[0];
  }

  public async attachTags(mantisToken: string, issue_id: number, dto: AttachTagsDto) {
    const url = `/issues/${issue_id}/tags`;

    const data = await mantisPOST<{ issues: IssueMantis[] }>(url, dto, mantisToken);

    const issues = data.issues.map(issue => formatIssue(issue));

    if (issues.length <= 0) return null;

    return issues[0];
  }
}
