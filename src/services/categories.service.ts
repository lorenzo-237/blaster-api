import { PrismaMantis } from '@/config/prisma';
import { Category } from '@/interfaces/categories.interface';
import { Service } from 'typedi';

@Service()
export class CategoryService {
  public categories = PrismaMantis.category;

  public async findAllCategories(project_id: number): Promise<Category[]> {
    const findCategories = await this.categories.findMany({
      where: {
        project_id,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return findCategories;
  }
}
