import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { phoneNumberValidator } from '../../../../../shared/validate/check-phone-number.directive';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-modal-detail',
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
  templateUrl: './modal-detail.component.html',
  styleUrl: './modal-detail.component.scss'
})
export class ModalDetailComponent {
  @Input() isVisibleDetail!: boolean;
  @Input() slot: any;
  @Input() detailInfo: any;
  @Output() changeVisibleDetail = new EventEmitter<any>();

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
    
  }


  handleCancel(): void {
    this.changeVisibleDetail.emit(false);
  }
}
