import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzRateModule } from 'ng-zorro-antd/rate';

@Component({
  selector: 'app-history-rate',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzIconModule,
    NzRateModule,
    ReactiveFormsModule
  ],
  templateUrl: './history-rate.component.html',
  styleUrls: ['./history-rate.component.scss']
})
export class HistoryRateComponent {
  @Input() isVisibleRate!: boolean;
  @Input() item: any;
  @Output() changeVisibleRate = new EventEmitter<any>();
  @Output() submitSuccess = new EventEmitter<any>();
  
  rateForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService
  ) {
    this.rateForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  getRatingText(): string {
    const rating = this.rateForm.get('rating')?.value || 0;
    
    if (rating === 0) return 'Vui lòng chọn số sao đánh giá';
    if (rating <= 1) return 'Rất tệ';
    if (rating <= 2) return 'Tệ';
    if (rating <= 3) return 'Bình thường';
    if (rating <= 4) return 'Tốt';
    return 'Rất tốt';
  }

  getRatingClass(): string {
    const rating = this.rateForm.get('rating')?.value || 0;
    
    if (rating === 0) return 'text-gray-500';
    if (rating <= 1) return 'text-red-600';   
    if (rating <= 2) return 'text-orange-500'; 
    if (rating <= 3) return 'text-yellow-500'; 
    if (rating <= 4) return 'text-green-500';  
    return 'text-green-700';                  
  }

  handleCancel(): void {
    this.rateForm.reset({
      rating: 0,
      description: ''
    });
    this.changeVisibleRate.emit(false);
  }
  
  submitRating(): void {
    if (this.rateForm.invalid) {
      this.notification.warning(
        'Cảnh báo',
        'Vui lòng đánh giá ít nhất 1 sao và viết nhận xét tối thiểu 10 ký tự'
      );
      return;
    }
    
    const ratingData = {
      itemId: this.item?.id,
      rating: this.rateForm.get('rating')?.value,
      description: this.rateForm.get('description')?.value
    };
 
    this.notification.success(
      'Thành công',
      'Cảm ơn bạn đã đánh giá!'
    );
    
    this.submitSuccess.emit(ratingData);
    this.handleCancel();
  }
}