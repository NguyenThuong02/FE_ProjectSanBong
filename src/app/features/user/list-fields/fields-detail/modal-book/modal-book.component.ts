import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { phoneNumberValidator } from '../../../../../shared/validate/check-phone-number.directive';
import { BookService } from '../../../../../core/api/book.service';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

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
  styleUrl: './modal-book.component.scss',
  providers: [DatePipe]
})
export class ModalBookComponent {
  isVNPayModalVisible = false;
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
    private bookService: BookService,
    private route: ActivatedRoute,
    private notification: NzNotificationService,
    private datePipe: DatePipe
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

  let formattedBookingDate = this.slot.startDate;
  if (this.slot.startDate instanceof Date) {
    formattedBookingDate = this.datePipe.transform(this.slot.startDate, 'yyyy-MM-dd');
  } else if (typeof this.slot.startDate === 'string') {
    // Parse the date string and ensure it's in the correct format yyyy-MM-dd
    const dateObj = new Date(this.slot.startDate);
    formattedBookingDate = this.datePipe.transform(dateObj, 'yyyy-MM-dd');
  }
  let formattedStartTime = this.slot.startTime;
  let formattedEndTime = this.slot.endTime;

  if (this.slot.startTime instanceof Date) {
    formattedStartTime = this.datePipe.transform(this.slot.startTime, 'HH:mm');
  }
  
  if (this.slot.endTime instanceof Date) {
    formattedEndTime = this.datePipe.transform(this.slot.endTime, 'HH:mm');
  }

  const body = {
    facilityTimeSlotId: this.slot.slotId,
    facilityId: this.route.snapshot.paramMap.get('id'),
    bookingDate: formattedBookingDate.toString(), 
    startTime: formattedStartTime,
    endTime: formattedEndTime,
    customerName: this.form.value.nameCustomer,
    customerPhone: this.form.value.cellPhone,
    paymentMethod: this.form.value.paymentMethod,
    note: this.form.value.description,
    finalPrice: this.slot.finalPrice,
    // Add the missing required fields
    // ownerFullName: this.slot.ownerFullName, 
    // ownerPhone: this.slot.ownerPhone
  }

  this.bookService.createBooking(body).subscribe({
    next: (res) => {
      this.notification.success(
        'Thành công',
        'Đặt sân thành công',
        { nzDuration: 3000 }
      );
      this.form.reset({
        paymentMethod: 'cash'
      });
      this.changeVisibleBook.emit({ visible: false, success: true });
    },
    error: (err) => {
      this.notification.error(
        'Thất bại',
        'Đặt sân không thành công',
        { nzDuration: 3000 }
      );
    }
  })
}

  onPaymentMethodChange(event: Event){
    this.isVNPayModalVisible = true;
  }

  handleVNPayCancel(){
    this.isVNPayModalVisible = false;
  }

  handleCancel(): void {
    this.form.reset({
      paymentMethod: 'cash'
    });
    this.changeVisibleBook.emit({ visible: false, success: false });
  }
}