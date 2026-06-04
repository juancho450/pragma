import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonSelect, IonSelectOption, IonButton, IonButtons, IonIcon, ModalController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';
import { Category } from '../../../core/models/category.model';

@Component({
  selector: 'app-add-task-modal',
  templateUrl: './add-task-modal.component.html',
  styleUrls: ['./add-task-modal.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
    IonInput, IonSelect, IonSelectOption, IonButton, IonButtons, IonIcon,
  ],
})
export class AddTaskModalComponent {
  @Input() categories: Category[] = [];

  private readonly modalCtrl = inject(ModalController);

  title = '';
  categoryId: string | null = null;

  constructor() {
    addIcons({ closeOutline });
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(): void {
    if (!this.title.trim()) return;
    this.modalCtrl.dismiss({ title: this.title.trim(), categoryId: this.categoryId }, 'confirm');
  }
}
