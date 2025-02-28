import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule, NzSelectSizeType } from 'ng-zorro-antd/select';
import { phoneNumberValidator } from '../../shared/validate/check-phone-number.directive';
import { rePassValidator } from '../../shared/validate/check-repass.directive';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ManagermentService } from '../../core/api/managerment.service';

@Component({
  selector: 'app-register',
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
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent implements OnInit {
  @Input() isVisiblePopUpAddManagement: boolean = true;
  @Input() idManagement: any = ''; 
  @Input() mode: 'create' | 'edit';
  @Output() visiblePopUpAddManagement = new EventEmitter<boolean>();
  public hideOldPass: boolean = true;
  public hidePass: boolean = true;
  public hideRePass: boolean = true;
  public edit: boolean = false;
  avatarUrl: string | null = null;
  identityCardUrl: string | null = null;


  listGender = [
    {
      label: 'Nam',
      value: true,
    },
    {
      label: 'Nữ',
      value: false,
    }
  ];
  listRoles = [
    {
      label: 'Người dùng thường',
      value: false,
    },
    {
      label: 'Quản trị viên',
      value: true,
    }
  ];

  public form: FormGroup = this.fb.group({
    fullName: [null, Validators.required],
    identityCardNumber: [null, Validators.required],
    identityCardDate: [null, Validators.required],
    identityCardPlace: [null, Validators.required],
    username: [null, Validators.required],
    email: [null, Validators.email],
    birthday: [null, Validators.required],
    address: [null, Validators.required],
    gender: [true, Validators.required],
    cellPhone: [null, [phoneNumberValidator()]],
    isAdmin: [false],
    avatarUrl: [''], // Control for avatar
    identityCardUrl: ['']
  });

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private modal: NzModalService,
    private message: NzMessageService,
    private managermentService: ManagermentService,
  ) {}
  ngOnInit(): void {
    this.form.controls['isAdmin'].disable();
    if(this.idManagement && this.mode === 'edit') {
      this.edit = true;
      this.viewInfoUser();
    } else {
      this.edit = false;
      // this.form.reset(); 
    }
  }
  

  handleOk(): void {
    const body = {
      userName: this.form.get('username')?.value,
      fullName: this.form.get('fullName')?.value,
      cellPhone: this.form.get('cellPhone')?.value,
      identityCardNumber: this.form.get('identityCardNumber')?.value,
      identityCardDate: this.form.get('identityCardDate')?.value,
      identityCardPlace: this.form.get('identityCardPlace')?.value,
      email: this.form.get('email')?.value,
      address: this.form.get('address')?.value,
      birthday: this.form.get('birthday')?.value,
      gender: this.form.get('gender')?.value,
      imageUrl: this.avatarUrl,
      urlIdentityCardImage: this.identityCardUrl,
      isAdmin: this.form.get('isAdmin')?.value,
    };
    if (this.form.invalid) {
      this.form.get('username')?.markAsTouched();
      this.form.get('fullName')?.markAsTouched();
      this.form.get('identityCardNumber')?.markAsTouched();
      this.form.get('identityCardDate')?.markAsTouched();
      this.form.get('identityCardPlace')?.markAsTouched();
      this.form.get('cellPhone')?.markAsTouched();
      this.form.get('address')?.markAsTouched();
      this.form.get('birthday')?.markAsTouched();
      this.form.get('gender')?.markAsTouched();
      this.form.get('email')?.markAsTouched();
      return;
    }
    // this.managermentService.addAccountManagementOwner(body).subscribe( => {
    //   if(res) {
    //     this.message.success("Tạo tài khoản thành công")
    //     this.visiblePopUpAddManagement.emit(false);
    //   }
    // }, (err) => {
    //   const errorMessage = err.error ? err.error.split('|')[1] : 'Có lỗi xảy ra';
    //   this.message.error(errorMessage);
    // })
  }

  viewInfoUser(): void {
    // this.managermentService.getUserById(this.idManagement).subscribe({
    //   next: (res) => {
    //     this.form.patchValue({
    //       username: res.userName,
    //       fullName: res.fullname,
    //       cellPhone: res.cellPhone,
    //       birthday: res.birthday,
    //       address: res.address,
    //       identityCardNumber: res.identityCardNumber,
    //       identityCardDate: res.identityCardDate,
    //       identityCardPlace: res.identityCardPlace,
    //       gender: res.gender,
    //       email: res.email,
    //       avatarUrl: res?.imageUrl, 
    //       identityCardUrl: res?.urlIdentityCardImage 
    //     });
    //     this.avatarUrl = res.imageUrl;
    //     this.identityCardUrl = res.identityCardImage;
    //   },
    //   error: (err) => {
    //     this.message.error('Lấy dữ liệu người dùng thất bại!');
    //   }
    // });
  }

  handleCancel(): void {
    this.visiblePopUpAddManagement.emit(false);
  }

  updateValidateRepass(e: any) {
    this.form.get('rePass')?.clearValidators();
    this.form.get('rePass')?.addValidators(rePassValidator(e.target.value));
  }
  showOldPass(e: any) {
    const inputPass = document.querySelector(
      '#inputPassChangeOldPassword',
    ) as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';
      this.hideOldPass = false;
    } else {
      inputPass.type = 'password';
      this.hideOldPass = true;
    }
  }
  showPass(e: any) {
    const inputPass = document.querySelector(
      '#inputPassChangePassword',
    ) as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';
      this.hidePass = false;
    } else {
      inputPass.type = 'password';
      this.hidePass = true;
    }
  }
  showRePass(e: any) {
    const inputPass = document.querySelector(
      '#inputRePassChangePassword',
    ) as HTMLInputElement;
    if (inputPass?.type === 'password') {
      inputPass.type = 'text';

      this.hideRePass = false;
    } else {
      inputPass.type = 'password';
      this.hideRePass = true;
    }
  }
}
