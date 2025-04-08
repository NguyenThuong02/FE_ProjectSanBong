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
  selector: 'app-popup-add-template',
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
  templateUrl: './popup-add-template.component.html',
  styleUrl: './popup-add-template.component.scss'
})
export class PopupAddTemplateComponent {
  @Input() isVisible!: boolean;
  @Input() isEdit!: boolean;
  @Input() idTemplate: any;
  @Output() changeVisibleDetail = new EventEmitter<any>();

  public form: FormGroup = this.fb.group({

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
