import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmailTemplateService } from '../../../../../core/api/email-template.service';

@Component({
  selector: 'app-popup-delete-template',
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
  templateUrl: './popup-delete-template.component.html',
  styleUrl: './popup-delete-template.component.scss'
})
export class PopupDeleteTemplateComponent {
  @Input() isVisibleDelete!: boolean;
  @Input() item?: any;
  @Output() changeVisibleDelete = new EventEmitter<any>();

  constructor(
    private cdr: ChangeDetectorRef,
    private notification: NzNotificationService,
    private emailTemplateService: EmailTemplateService
  ) {}

  handleOk(): void {
    this.emailTemplateService.deleteTemplate(this.item.id).subscribe({
      next: (res) => {
        this.notification.create(
          'success',
          'Xác thực thành công!',
          'Xoá cấu hình email thành công!'
        );
        this.changeVisibleDelete.emit({ visible: false, isSuccess: true });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Xác thực thất bại!',
          'Xoá cấu hình email thất bại!'
        );
      },
    })
  }

  handleCancel(): void {
    this.changeVisibleDelete.emit(false);
  }
}
