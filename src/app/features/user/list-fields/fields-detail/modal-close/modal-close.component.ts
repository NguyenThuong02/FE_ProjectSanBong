import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';

@Component({
  selector: 'app-modal-close',
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
  templateUrl: './modal-close.component.html',
  styleUrl: './modal-close.component.scss'
})
export class ModalCloseComponent {
  @Input() isVisibleClosed!: boolean;
  @Output() changeVisibleClosed = new EventEmitter<any>();

  constructor(

  ) {}

  handleOk(): void {
    
  }


  handleCancel(): void {
    this.changeVisibleClosed.emit(false);
  }
}
