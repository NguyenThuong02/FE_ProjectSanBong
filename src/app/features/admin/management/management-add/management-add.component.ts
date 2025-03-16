import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule} from 'ng-zorro-antd/modal';
import { ManagermentService } from '../../../../core/api/managerment.service';
import { phoneNumberValidator } from '../../../../shared/validate/check-phone-number.directive';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NzNotificationService } from 'ng-zorro-antd/notification';

@Component({
  selector: 'app-management-add',
  standalone: true,
  imports: [
    FormsModule,
    MatInput,
    CommonModule,
    RouterModule,
    NzModalModule,
    NzIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatSelectModule,
    TranslateModule,
    NzButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './management-add.component.html',
  styleUrl: './management-add.component.scss'
})
export class ManagementAddComponent implements OnInit {
  requiredMsg: string = '';
  fullName: string = '';
  isLoadingSaveEdit: boolean = false;
  isEdit: boolean = false;
  idOwner: any;
  nameOwner: any;
  cityData: any = [];
  districtData: any = [];
  wardsData: any = [];
  identityCardUrl: string | null = null;
  idUser: any;
  avatarPreview:string = "../../../assets/img/Logo-Hoc-Vien-Ky-Thuat-Mat-Ma-ACTVN.webp"
  public listGender: any = [
    {
      value: true,
      label: 'Nam',
    },
    {
      value: false,
      label: 'Nữ',
    },
  ];
  public listRole: any = [
    {
      value: 'User',
      label: 'Khách hàng',
    },
    {
      value: 'FacilityOwner',
      label: 'Chủ sân',
    }
  ]
  constructor(
      private fb: FormBuilder,
      private notification: NzNotificationService,
      private cdr: ChangeDetectorRef,
      private managermentService: ManagermentService,
      private route: ActivatedRoute,
      private router: Router,
  ) {}
  ngOnInit(): void {
    this.idUser = this.route.snapshot.paramMap.get('id');
    if(this.idUser) {
      this.getViewInfo();
    }
  }
  
  public form: FormGroup = this.fb.group({
    fullName: [{ value: null, disabled: true }, Validators.required],
    userName: [{ value: null, disabled: true }, Validators.required],
    dob: [{ value: null, disabled: true }, Validators.required],
    phoneNumber: [{ value: null, disabled: true }, [Validators.required, phoneNumberValidator()]],
    email: [{ value: null, disabled: true }, [Validators.required, Validators.email]],
    gender: [{ value: true, disabled: true }, Validators.required],
    role: [null, Validators.required], 
    status: [null, Validators.required], 
  });

    // avatar change
  public avatarChangeForm: FormGroup = this.fb.group({
      image: [null]
  }) 

  getViewInfo(): void {
    this.managermentService.getUserById(this.idUser).subscribe({
      next: (res) => {
        this.form.patchValue({
          fullName: res.fullname,
          userName: res.userName,
          email: res.email,
          gender: res.gender,
          phoneNumber: res.cellPhone,
          dob: res.birthday,
          role: res.role,
          status: res.status,
        });
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Lấy thông tin thất bại!'
        );
      },
    })
  }

  handleSubmit(): void {
    if(this.form.get('status')?.value === 'Active'){
      this.managermentService.activeAccount(this.idUser).subscribe ({
        next: (res) => {
          this.managermentService.changeRole(this.idUser, this.form.get('role')?.value).subscribe ({
            next: (res2) => {
              this.notification.create(
                'success',
                'Thành công!',
                'Cập nhật thành công!'
              );
              this.cdr.detectChanges();
              this.router.navigate([`/user-management/list`]);
            },
            error: (err) => {
              this.notification.create(
                'error',
                'Thất bại!',
                'Cấp quyền thất bại!'
              );
            }
          })
        },
        error: (err) => {
          this.notification.create(
            'error',
            'Thất bại!',
            'Cập nhật thông tin thất bại!'
          );
        }
      })
    }
    if(this.form.get('status')?.value === 'Disable'){
      this.managermentService.disableAccount(this.idUser).subscribe ({
        next: (res) => {
          this.managermentService.changeRole(this.idUser, this.form.get('role')?.value).subscribe ({
            next: (res2) => {
              this.notification.create(
                'success',
                'Thành công!',
                'Cập nhật thành công!'
              );
              this.cdr.detectChanges();
              this.router.navigate([`/user-management/list`]);
            },
            error: (err) => {
              this.notification.create(
                'error',
                'Thất bại!',
                'Cấp quyền thất bại!'
              );
            }
          })
        },
        error: (err) => {
          this.notification.create(
            'error',
            'Thất bại!',
            'Cập nhật thông tin thất bại!'
          );
        }
      })
    }
}

  changeStatus(status: string): void {
    this.form.get('status')?.setValue(status);
  }

  handleFileChange(event: Event, type: 'avatar' | 'identityCard'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.uploadFile(file, type);
    }
  }
  
  uploadFile(file: File, type: 'avatar' | 'identityCard'): void {
    const formData = new FormData();
    formData.append('file', file);
  
    this.managermentService.uploadImage(formData).subscribe(
      (response) => {
        if (type === 'avatar') {
          this.avatarPreview = response.filename;
          this.avatarChangeForm.get('image')?.setValue(this.avatarPreview);
        } else {
          this.identityCardUrl = response.filename;
          this.form.get('identityCardUrl')?.setValue(this.identityCardUrl);
        }
        this.notification.create(
          'success',
          'Thành công!',
          'Upload thành công!'
        );
      },
      (error) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Upload thất bại. Vui lòng thử lại!'
        );
      }
    );
  }


}
