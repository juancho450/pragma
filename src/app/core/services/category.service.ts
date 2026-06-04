import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../models/category.model';

const STORAGE_KEY = 'pragma_categories';

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly _categories$ = new BehaviorSubject<Category[]>(this.load());

  readonly categories$ = this._categories$.asObservable();

  private load(): Category[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private persist(categories: Category[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
    this._categories$.next(categories);
  }

  add(name: string, color: string): void {
    const category: Category = {
      id: crypto.randomUUID(),
      name: name.trim(),
      color,
      createdAt: Date.now(),
    };
    this.persist([...this._categories$.value, category]);
  }

  update(id: string, name: string, color: string): void {
    const updated = this._categories$.value.map(category =>
      category.id === id ? { ...category, name: name.trim(), color } : category
    );
    this.persist(updated);
  }

  remove(id: string): void {
    this.persist(this._categories$.value.filter(category => category.id !== id));
  }

  getById(id: string): Category | undefined {
    return this._categories$.value.find(category => category.id === id);
  }
}
