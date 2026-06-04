import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { Task } from '../../../core/models/task.model';

@Component({
  selector: 'app-task-stats',
  templateUrl: './task-stats.component.html',
  styleUrls: ['./task-stats.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TaskStatsComponent {
  @Input({ required: true }) tasks: Task[] = [];

  get total(): number { return this.tasks.length; }
  get completed(): number { return this.tasks.filter(t => t.completed).length; }
  get pending(): number { return this.total - this.completed; }
}
