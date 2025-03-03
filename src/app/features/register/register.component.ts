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
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule} from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { phoneNumberValidator } from '../../shared/validate/check-phone-number.directive';
import { rePassValidator } from '../../shared/validate/check-repass.directive';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AccountService } from '../../core/api/account.service';
import { Router, RouterLink } from '@angular/router';

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
  hidePass: boolean = true;
  hideRePass: boolean = true;
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
    username: [null, Validators.required],
    email: [null, Validators.email],
    cellPhone: [null, [phoneNumberValidator()]],
    password: [null, [Validators.required, Validators.minLength(6)]],
    passwordConfirm: [null, [Validators.required]]
  }, { validators: this.matchPasswords });

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passwordConfirm')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }
  

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private message: NzMessageService,
    private accountService: AccountService,
    private router: Router,
  ) {}
  ngOnInit(): void {

  }
  

  handleOk(): void {
    const body = {
      userName: this.form.get('username')?.value,
      fullName: this.form.get('fullName')?.value,
      cellPhone: this.form.get('cellPhone')?.value,
      email: this.form.get('email')?.value,
      password: this.form.get('password')?.value,
      rePassword: this.form.get('passwordConfirm')?.value
    };
    this.accountService.register(body).subscribe({
      next: (res) => {
        this.message.success("Đăng ký tài khoản thành công!");
        this.router.navigate(['/login']);
      },
      error: (err) => {

      }
    })
  }

  updateValidateRepass(e: any) {
    this.form.get('rePass')?.clearValidators();
    this.form.get('rePass')?.addValidators(rePassValidator(e.target.value));
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
