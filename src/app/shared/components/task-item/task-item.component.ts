import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { IonItem, IonLabel, IonCheckbox, IonButton, IonIcon, IonBadge } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Task } from '../../../core/models/task.model';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [IonItem, IonLabel, IonCheckbox, IonButton, IonIcon, IonBadge],
})
export class TaskItemComponent {
  @Input({ required: true }) task!: Task;
  @Input() category: Category | undefined;
  @Output() toggled = new EventEmitter<string>();
  @Output() deleted = new EventEmitter<string>();

  constructor() {
    addIcons({ trashOutline });
  }
}
