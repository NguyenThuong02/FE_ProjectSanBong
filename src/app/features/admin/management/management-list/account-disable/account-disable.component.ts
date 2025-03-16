import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { AccountService } from '../../../../../core/api/account.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-account-disable',
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
  templateUrl: './account-disable.component.html',
  styleUrl: './account-disable.component.scss'
})
export class AccountDisableComponent {
  @Input() isVisible!: boolean;
  @Input() idManagement?: any;
  @Input() nameManagement?: any;
  @Output() changeVisibleDelete = new EventEmitter<any>();

  constructor(
    private cdr: ChangeDetectorRef,
    private notification: NzNotificationService,
    private accountService: AccountService
  ) {}

  handleOk(): void {
    this.accountService.disableAccount(this.idManagement).subscribe({
      next: (res) => {
        this.notification.create(
          'success',
          'Xác thực thành công!',
          'Vô hiệu hoá tài khoản thành công!'
        );
        this.changeVisibleDelete.emit({ visible: false, isSuccess: true });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Xác thực thất bại!',
          'Vô hiệu hoá tài khoản thất bại!'
        );
      },
    })
  }

  handleCancel(): void {
    this.changeVisibleDelete.emit(false);
  }
}
