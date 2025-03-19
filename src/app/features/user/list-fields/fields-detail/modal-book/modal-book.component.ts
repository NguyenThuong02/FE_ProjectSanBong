import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { phoneNumberValidator } from '../../../../../shared/validate/check-phone-number.directive';

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
    nameCustomer: ['', Validators.required],
    cellPhone: ['', [Validators.required, phoneNumberValidator()]],
    paymentMethod: ['cash', Validators.required],
    description: ['']
  });

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {}

  handleOk(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        control?.markAsTouched();
      });
      
      this.notification.warning(
        'Thông báo',
        'Vui lòng điền đầy đủ thông tin bắt buộc',
        { nzDuration: 3000 }
      );
      return;
    }
    console.log('Form data:', this.form.value);
    // Tiếp tục xử lý đặt sân
    this.notification.success(
      'Thành công',
      'Đặt sân thành công',
      { nzDuration: 3000 }
    );
    this.changeVisibleBook.emit(false);
  }


  handleCancel(): void {
    this.form.reset({
      paymentMethod: 'cash'
    });
    this.changeVisibleBook.emit(false);
  }
}
