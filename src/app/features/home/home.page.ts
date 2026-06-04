import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { combineLatest, map } from 'rxjs';
import { ScrollingModule } from '@angular/cdk/scrolling';
import {
  ModalController, AlertController,
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonButton, IonIcon, IonChip, IonLabel, IonButtons,
  IonFab, IonFabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, pricetagsOutline } from 'ionicons/icons';
import { TaskService } from '../../core/services/task.service';
import { CategoryService } from '../../core/services/category.service';
import { RemoteConfigService } from '../../core/services/remote-config.service';
import { TaskItemComponent } from '../../shared/components/task-item/task-item.component';
import { TaskStatsComponent } from '../../shared/components/task-stats/task-stats.component';
import { AddTaskModalComponent } from '../../shared/components/add-task-modal/add-task-modal.component';
import { CategoryByIdPipe } from '../../shared/pipes/category-by-id.pipe';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe, RouterLink, ScrollingModule, CategoryByIdPipe,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonButton, IonIcon, IonChip, IonLabel, IonButtons,
    IonFab, IonFabButton,
    TaskItemComponent, TaskStatsComponent,
  ],
})
export class HomePage {
  private readonly taskService = inject(TaskService);
  private readonly categoryService = inject(CategoryService);
  private readonly remoteConfigService = inject(RemoteConfigService);
  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);

  readonly taskPageData$ = combineLatest([
    this.taskService.filteredTasks$,
    this.categoryService.categories$,
    this.remoteConfigService.showTaskStats$,
  ]).pipe(
    map(([tasks, categories, showStats]) => ({ tasks, categories, showStats }))
  );

  activeFilter: string | null = null;

  readonly itemSize = 64;

  trackByTaskId(_index: number, task: { id: string }): string {
    return task.id;
  }

  constructor() {
    addIcons({ addOutline, pricetagsOutline });
  }

  async openAddTaskModal(categories: any[]): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddTaskModalComponent,
      componentProps: { categories },
      breakpoints: [0, 0.65, 1],
      initialBreakpoint: 0.65,
      handleBehavior: 'cycle',
    });
    await modal.present();
    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.taskService.add(data.title, data.categoryId);
    }
  }

  toggleTask(id: string): void {
    this.taskService.toggle(id);
  }

  async deleteTask(id: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar tarea?',
      message: 'Esta acción no se puede deshacer.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.taskService.remove(id) },
      ],
    });
    await alert.present();
  }

  setFilter(categoryId: string | null): void {
    this.activeFilter = categoryId;
    this.taskService.setFilter(categoryId);
  }
}
