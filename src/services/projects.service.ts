import { Filter } from '@/interfaces/filters.interface';
import { FilterMantis, ProjectMantis } from '@/interfaces/mantis.interface';
import { Project } from '@/interfaces/projects.interface';
import { mantisGET } from '@/mantis/mantis.request';

import { Service } from 'typedi';

@Service()
export class ProjectsService {
  public async findAllProject(mantisToken: string): Promise<Project[]> {
    const data = await mantisGET<{ projects: ProjectMantis[] }>('/projects', mantisToken);

    return data.projects
      .filter(project => project.enabled)
      .map(project => {
        const myProject: Project = {
          id: project.id,
          name: project.name,
          description: project.description,
        };
        return myProject;
      });
  }

  public async findAllFilters(mantisToken: string, project_id: number | null): Promise<Filter[]> {
    const data = await mantisGET<{ filters: FilterMantis[] }>('/filters', mantisToken);

    return data.filters
      .filter(filter => {
        if (!project_id) return true;
        return filter.project.id === project_id;
      })
      .map(filter => {
        const myFilter: Filter = {
          id: filter.id,
          name: filter.name,
          project: filter.project.name,
        };
        return myFilter;
      });
  }
}
