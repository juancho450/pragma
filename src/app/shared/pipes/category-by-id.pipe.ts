import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '../../core/models/category.model';

@Pipe({
  name: 'categoryById',
  standalone: true,
  pure: true,
})
export class CategoryByIdPipe implements PipeTransform {
  transform(categoryId: string | null, categories: Category[]): Category | undefined {
    if (!categoryId) return undefined;
    return categories.find(c => c.id === categoryId);
  }
}
