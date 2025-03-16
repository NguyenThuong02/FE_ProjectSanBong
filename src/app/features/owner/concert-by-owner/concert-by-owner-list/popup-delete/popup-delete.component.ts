import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { ConcertService } from '../../../../../core/api/concert.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-popup-delete',
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
  templateUrl: './popup-delete.component.html',
  styleUrl: './popup-delete.component.scss'
})
export class PopupDeleteComponent {
  @Input() isVisible!: boolean;
  @Input() eventItem?: any;
  @Output() changeVisibleDelete = new EventEmitter<any>();

  constructor(
    private cdr: ChangeDetectorRef,
    private notification: NzNotificationService,
    private concertService: ConcertService,
  ) {}

  handleOk(): void {
    this.concertService.deleteEvent(this.eventItem.id).subscribe({
      next: (res) => {
        this.notification.create(
          'success',
          'Thành công!',
          'Xoá thành công!'
        );
        this.changeVisibleDelete.emit({ visible: false, isSuccess: true });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thành công!',
          'Xoá không thành công!'
        );
      },
    })
  }

  handleCancel(): void {
    this.changeVisibleDelete.emit(false);
  }
}
