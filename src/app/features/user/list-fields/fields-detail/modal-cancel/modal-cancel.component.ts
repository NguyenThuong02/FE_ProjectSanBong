import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-cancel',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NzModalComponent,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
  ],
  templateUrl: './modal-cancel.component.html',
  styleUrl: './modal-cancel.component.scss'
})
export class ModalCancelComponent {
  @Input() isVisibleCancel!: boolean;
  @Input() slot: any;
  @Input() detailInfo: any;
  @Output() changeVisibleCancel = new EventEmitter<any>();

  constructor() {}

  handleCancel(): void {
    this.changeVisibleCancel.emit(false);
  }
  
  formatCurrency(value: number): string {
    if (value === null || value === undefined) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }
}
