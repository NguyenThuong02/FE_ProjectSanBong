import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalComponent, NzModalModule } from 'ng-zorro-antd/modal';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { EmailTemplateService } from '../../../../../core/api/email-template.service';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

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
    CKEditorModule
  ],
  templateUrl: './popup-add-template.component.html',
  styleUrl: './popup-add-template.component.scss'
})
export class PopupAddTemplateComponent implements OnChanges {
  @Input() isVisible!: boolean;
  @Input() isEdit!: boolean;
  @Input() idTemplate: any;
  @Output() changeVisibleDetail = new EventEmitter<any>();
  public Editor = ClassicEditor;
  public form: FormGroup = this.fb.group({
    templateName: ['', Validators.required],
    subject: ['', Validators.required],
    body: ['', Validators.required]
  });
  
  constructor(
    private fb: FormBuilder,
    private notification: NzNotificationService,
    private emailTemplateService: EmailTemplateService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isVisible'] && changes['isVisible'].currentValue) {
      this.resetForm();
      
      if (this.isEdit && this.idTemplate) {
        this.loadTemplateDetails();
      }
    }
  }

  resetForm(): void {
    this.form.reset();
  }

  loadTemplateDetails(): void {
    this.emailTemplateService.getTemplateById(this.idTemplate).subscribe(
      (data: any) => {
        this.form.patchValue({
          templateName: data.templateName,
          subject: data.subject,
          body: data.body
        });
      },
      error => {
        this.notification.error('Lỗi', 'Không thể tải thông tin cấu hình email');
        console.error('Error loading template details:', error);
      }
    );
  }

  handleOk(): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      this.notification.warning('Cảnh báo', 'Vui lòng điền đầy đủ thông tin');
      return;
    }
    
    if (this.isEdit) {
      const body = {
        id: this.idTemplate, 
        templateName: this.form.value.templateName,
        subject: this.form.value.subject,
        body: this.form.value.body
      }
      this.emailTemplateService.updatedTemplate(body).subscribe({
        next: (res) => {
          this.notification.create(
            'success',
            'Thành công!',
            'Cập nhật cấu hình thành công!'
          );
          this.handleCancel();
        },
        error: (err) => {
          this.notification.create(
            'error',
            'Thất bại!',
            'Cập nhật cấu hình thất bại!'
          );
        }
      });
    } else {
      const body = {
        templateName: this.form.value.templateName,
        subject: this.form.value.subject,
        body: this.form.value.body
      }
      this.emailTemplateService.createTemplate(body).subscribe({
          next: (res) => {
            this.notification.create(
              'success',
              'Thành công!',
              'Tạo cấu hình mới thành công!'
            );
            this.handleCancel();
          },
          error: (err) => {
            this.notification.create(
              'error',
              'Thất bại!',
              'Tạo cấu hình mới thất bại!'
            );
          }
        }
      );
    }
  }

  handleCancel(): void {
    this.changeVisibleDetail.emit(false);
  }
}