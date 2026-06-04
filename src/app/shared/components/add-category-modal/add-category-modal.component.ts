import { ChangeDetectionStrategy, Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
  IonInput, IonButton, IonButtons, IonIcon, ModalController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { closeOutline } from 'ionicons/icons';

const CATEGORY_COLORS = [
  '#6429CD', '#E91E63', '#2196F3', '#4CAF50',
  '#FF9800', '#00BCD4', '#9C27B0', '#F44336',
];

@Component({
  selector: 'app-add-category-modal',
  templateUrl: './add-category-modal.component.html',
  styleUrls: ['./add-category-modal.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
    IonInput, IonButton, IonButtons, IonIcon,
  ],
})
export class AddCategoryModalComponent {
  @Input() editName = '';
  @Input() editColor = CATEGORY_COLORS[0];

  private readonly modalCtrl = inject(ModalController);

  readonly colors = CATEGORY_COLORS;

  name = '';
  selectedColor = CATEGORY_COLORS[0];

  ngOnInit(): void {
    this.name = this.editName;
    this.selectedColor = this.editColor;
  }

  constructor() {
    addIcons({ closeOutline });
  }

  dismiss(): void {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  confirm(): void {
    if (!this.name.trim()) return;
    this.modalCtrl.dismiss({ name: this.name.trim(), color: this.selectedColor }, 'confirm');
  }
}
