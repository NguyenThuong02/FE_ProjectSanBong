import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { phoneNumberValidator } from '../../../../shared/validate/check-phone-number.directive';
import { AccountService } from '../../../../core/api/account.service';
import { RouterLink } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { HttpClient, HttpEventType } from '@angular/common/http';


@Component({
  selector: 'app-my-info-view',
  standalone: true,
  imports: [
    NzModalModule,
    NzIconModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    NzSelectModule,
    TranslateModule,
    NzButtonModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    RouterLink
  ],
  templateUrl: './my-info-view.component.html',
  styleUrl: './my-info-view.component.scss'
})
export class MyInfoViewComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef;
  requiredMsg: string = '';
  fullName: string = '';
  isLoadingSaveEdit: boolean = false;
  imagePreview: string | null = null;
  isEdit: boolean = false;
  idOwner: any;
  nameOwner: any;
  uploadProgress: number = 0;
  selectedFileName: string = '';
  
  public listGender: any = [
    {
      value: 0,
      label: 'Nam',
    },
    {
      value: 1,
      label: 'Nữ',
    },
  ];
  constructor(
      private fb: FormBuilder,
      private cdr: ChangeDetectorRef,
      private accountService: AccountService,
      private notification: NzNotificationService,
      private http: HttpClient
  ) {     
  }
  ngOnInit(): void {
      this.form.disable();
      this.idOwner = JSON.parse(
        localStorage.getItem('id_token_claims_obj') || '{}',
      )?.sub;
      this.nameOwner = JSON.parse(
        localStorage.getItem('id_token_claims_obj') || '{}',
      )?.name;
      this.getViewInfo();
  }
  
  handleEdit(): void {
      this.isEdit = !this.isEdit
      if( this.isEdit ){
          this.form.enable()
          this.form.get('email')?.disable();
          this.form.get('userName')?.disable();
      } else {
          this.form.disable();
      }
  }
  public form: FormGroup = this.fb.group({
      fullName: [null, Validators.required],
      userName: [null, Validators.required],
      dob: [null, Validators.required],
      phoneNumber: [null, [Validators.required, phoneNumberValidator()]],
      email: [null, [Validators.required, Validators.email]],
      address: [null, Validators.required],
      gender: [true, Validators.required],
      avatarUrl: [null]
  });


  getViewInfo(): void {
    this.accountService.getViewInfo().subscribe({
      next: (res) => {
        this.fullName = res.fullname;
        this.form.patchValue({
          fullName: res.fullName,
          userName: res.username,
          dob: res.birthday,
          gender: res.gender,
          phoneNumber: res.phone,
          email: res.email,
          address: res.address,
          avatarUrl: res.avatarUrl
        });
        
        if (res.avatarUrl) {
          this.imagePreview = res.avatarUrl;
        }
        
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Không thể lấy thông tin!'
        );
      },
    })
  }

  // Image upload methods
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFileName = file.name;
      
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
      this.uploadFile(file);
    }
  }

  uploadFile(file: File): void {
    const formData = new FormData();
    formData.append('file', file);
    
    this.http.post('https://cdn-test.eztek.net/gateway/Media/Upload', formData, {
      reportProgress: true,
      observe: 'events'
    }).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress && event.total) {
          this.uploadProgress = Math.round(100 * event.loaded / event.total);
          this.cdr.detectChanges();
        } else if (event.type === HttpEventType.Response) {
          const response = event.body as any;
          if (response && Array.isArray(response) && response.length > 0) {
            this.form.patchValue({
              avatarUrl: response[0]
            });
            this.notification.create(
              'success',
              'Thành công!',
              'Tải ảnh lên thành công!'
            );
          }
        }
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Tải ảnh lên thất bại!'
        );
        this.uploadProgress = 0;
        this.cdr.detectChanges();
      }
    });
  }

  removeImage(): void {
    this.imagePreview = null;
    this.form.patchValue({
      avatarUrl: null
    });
    this.selectedFileName = '';
  }

  handleSubmit(): void {
    const body = {
        fullName: this.form.get('fullName')?.value,
        gender: this.form.get('gender')?.value,
        address: this.form.get('address')?.value,
        birthday: this.form.get('dob')?.value,
        phone: this.form.get('phoneNumber')?.value,
        avatarUrl: this.form.get('avatarUrl')?.value,
    }
    this.accountService.updateInfo(body).subscribe({
      next: (res) => {
        this.notification.create(
          'success',
          'Thành công!',
          'Cập nhật thông tin thành công!'
        );
        this.getViewInfo();
        this.isEdit = false;
        this.form.disable();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Cập nhật thông tin thất bại!'
        );
      },
    });
  }
  
  handleCancel(): void {
    this.isEdit = false;
    this.form.disable();
    this.getViewInfo();
  }
}
