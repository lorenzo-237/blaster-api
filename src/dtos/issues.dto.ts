export class FixIssueDto {
  fixed_in_version: {
    name: string;
  };
  notes?: string[];
}
type statusMinimal = 'assigned' | 'dealed' | 'planned';

export class UpdateIssueDto {
  fixed_in_version?: {
    name: string;
  };
  target_version?: {
    name: string;
  };
  status?: {
    name: statusMinimal;
  };
  notes?: string[];
}

export class AttachTagsDto {
  tags: { id: number }[];
}
