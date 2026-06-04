import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import {
  ModalController, AlertController,
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonButton, IonIcon, IonButtons, IonBackButton,
  IonItemSliding, IonItemOptions, IonItemOption,
  IonFab, IonFabButton,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';
import { CategoryService } from '../../core/services/category.service';
import { AddCategoryModalComponent } from '../../shared/components/add-category-modal/add-category-modal.component';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
    IonLabel, IonButton, IonIcon, IonButtons, IonBackButton,
    IonItemSliding, IonItemOptions, IonItemOption,
    IonFab, IonFabButton,
  ],
})
export class CategoriesPage {
  private readonly categoryService = inject(CategoryService);
  private readonly modalCtrl = inject(ModalController);
  private readonly alertCtrl = inject(AlertController);

  readonly categories$ = this.categoryService.categories$;

  constructor() {
    addIcons({ addOutline, createOutline, trashOutline });
  }

  async openAddModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddCategoryModalComponent,
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 0.7,
      handleBehavior: 'cycle',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.categoryService.add(data.name, data.color);
    }
  }

  async openEditModal(id: string, currentName: string, currentColor: string): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: AddCategoryModalComponent,
      componentProps: { editName: currentName, editColor: currentColor },
      breakpoints: [0, 0.7, 1],
      initialBreakpoint: 0.7,
      handleBehavior: 'cycle',
    });

    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      this.categoryService.update(id, data.name, data.color);
    }
  }

  async deleteCategory(id: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: '¿Eliminar categoría?',
      message: 'Las tareas con esta categoría quedarán sin categoría asignada.',
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        { text: 'Eliminar', role: 'destructive', handler: () => this.categoryService.remove(id) },
      ],
    });
    await alert.present();
  }
}
