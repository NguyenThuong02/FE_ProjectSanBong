import { CommonModule, DatePipe } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BookService } from '../../../../../core/api/book.service';

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
    NzPopconfirmModule,
  ],
  templateUrl: './modal-cancel.component.html',
  styleUrl: './modal-cancel.component.scss',
  providers: [DatePipe] 
})
export class ModalCancelComponent {
  @Input() isVisibleCancel!: boolean;
  @Input() slot: any;
  @Input() detailInfo: any;
  @Output() changeVisibleCancel = new EventEmitter<any>();

  constructor(
    private notification: NzNotificationService,
    private bookService: BookService,
    private datePipe: DatePipe 
  ) {}

  handleCancel(): void {
    this.changeVisibleCancel.emit(false);
  }
  
  formatCurrency(value: number): string {
    if (value === null || value === undefined) return '';
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  }

  handleCancelOrder(): void {
      let formattedDate = this.slot?.startDate;
      if (typeof this.slot?.startDate === 'string') {
        const dateObj = new Date(this.slot.startDate);
        formattedDate = this.datePipe.transform(dateObj, 'yyyy-MM-dd');
      }
      
      const body = {
        slotId: this.slot?.slotId,
        date: formattedDate, 
        startTime: this.slot?.startTime,
        endTime: this.slot?.endTime
      }
      
    this.bookService.cancelBooking(body).subscribe({
      next: (res: any) => {
          this.notification.success(
            'Thành công',
            'Huỷ đơn thành công',
            { nzDuration: 3000 }
          );
          this.changeVisibleCancel.emit(false);
      },
      error: (err: any) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Huỷ đơn thất bại!'
        );
      },
    })
  }
}
