import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-modal-book',
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
  templateUrl: './modal-book.component.html',
  styleUrl: './modal-book.component.scss'
})
export class ModalBookComponent {
  @Input() isVisibleBook!: boolean;
  @Input() slot: any;
  @Input() detailInfo: any;
  @Output() changeVisibleBook = new EventEmitter<any>();

  public form: FormGroup = this.fb.group({

  });

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}

  handleOk(): void {
    
  }


  handleCancel(): void {
    this.changeVisibleBook.emit(false);
  }
}
