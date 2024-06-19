import { IssueAPI, IssueSimple, IssuePrisma } from '@/interfaces/issues.interface';
import { IssueMantis } from '@/interfaces/mantis.interface';

export function formatIssue(issue: IssueMantis): IssueAPI {
  return {
    description: issue.description,
    category: issue.category ? issue.category.name : 'no category',
    version: issue.version ? issue.version.name : 'no version',
    target_version: issue.target_version ? issue.target_version.name : 'no target version',
    fixed_in_version: issue.fixed_in_version ? issue.fixed_in_version.name : 'not fixed',
    id: issue.id,
    status: {
      color: issue.status.color,
      label: issue.status.label,
      name: issue.status.name,
    },
    project: issue.project.name,
    summary: issue.summary,
    tags: issue.tags ? issue.tags.map(tag => tag.name) : [],
    files: issue.attachments
      ? issue.attachments.map(attachment => ({
          filename: attachment.filename,
          content_type: attachment.content_type,
          id: attachment.id,
          size: attachment.size,
        }))
      : [],
  };
}

// formater l'issue depuis le schema prisma, celui du modèle Mantis vers un objet plus concis
export function formatIssueMysql(issue: IssuePrisma): IssueSimple {
  return {
    id: issue.id,
    version: issue.version,
    target_version: issue.target_version,
    fixed_in_version: issue.fixed_in_version,
    last_updated: new Date(issue.last_updated * 1000),
    status: formatStatusMysql(issue.status),
    category: issue.category.name,
    summary: issue.summary,
    resolution: formatResolutionMysql(issue.resolution),
    handler: issue.handler,
    reporter: issue.reporter,
    bug_text: issue.bugText,
    tags: issue.tags.map(t => t.tag),
  };
}

function formatStatusMysql(status: number) {
  switch (status) {
    case 80:
      return 'resolved';
    case 60:
      return 'dealed'; // vrai valeur = 'waiting_customer_validation'
    case 55:
      return 'planned';
    default:
      return 'assigned'; // valeur = 50
  }
}

function formatResolutionMysql(resolution: number) {
  switch (resolution) {
    case 10:
      return 'open';
    case 20:
      return 'fixed';
    case 30:
      return 'reopened';
    case 40:
      return 'unable_to_reproduce';
    case 50:
      return 'not_fixable';
    case 60:
      return 'duplicate';
    case 70:
      return 'not_a_bug';
    case 80:
      return 'suspended';
    case 90:
      return 'wont_fix';
    default:
      return 'unknown';
  }
}

export function statusToInt(status: string) {
  switch (status) {
    case 'resolved':
      return 80;
    case 'dealed':
      return 60;
    case 'waiting_customer_validation':
      return 60;
    case 'planned':
      return 55;
    case 'waiting_internal_validation':
      return 55;
    default:
      return 50; // valeur = 'assigned'
  }
}

export function compareByCategoryAndLastUpdatedAsc(a: IssueSimple, b: IssueSimple) {
  // Comparaison des catégories
  if (a.category < b.category) {
    return -1;
  }
  if (a.category > b.category) {
    return 1;
  }

  // Si les catégories sont égales, on compare par last updated
  if (a.last_updated < b.last_updated) {
    return 1;
  }
  if (a.last_updated > b.last_updated) {
    return -1;
  }

  // Si les last updated sont égaux, les éléments sont considérés comme égaux
  return 0;
}
