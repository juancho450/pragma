import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, map } from 'rxjs';
import { Task } from '../models/task.model';

const STORAGE_KEY = 'pragma_tasks';

@Injectable({ providedIn: 'root' })
export class TaskService {
  private readonly _tasks$ = new BehaviorSubject<Task[]>(this.load());
  private readonly _filter$ = new BehaviorSubject<string | null>(null);

  readonly tasks$ = this._tasks$.asObservable();

  readonly filteredTasks$ = combineLatest([this._tasks$, this._filter$]).pipe(
    map(([tasks, categoryId]) =>
      categoryId ? tasks.filter(t => t.categoryId === categoryId) : tasks
    )
  );

  private load(): Task[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private persist(tasks: Task[]): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    this._tasks$.next(tasks);
  }

  setFilter(categoryId: string | null): void {
    this._filter$.next(categoryId);
  }

  add(title: string, categoryId: string | null = null): void {
    const task: Task = {
      id: crypto.randomUUID(),
      title: title.trim(),
      completed: false,
      categoryId,
      createdAt: Date.now(),
    };
    this.persist([...this._tasks$.value, task]);
  }

  toggle(id: string): void {
    const updated = this._tasks$.value.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    this.persist(updated);
  }

  remove(id: string): void {
    this.persist(this._tasks$.value.filter(task => task.id !== id));
  }
}
