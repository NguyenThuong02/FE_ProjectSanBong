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
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router, RouterLink } from '@angular/router';
import { rePassValidator } from '../../../shared/validate/check-repass.directive';
import { AccountService } from '../../../core/api/account.service';

@Component({
  selector: 'app-change-password-view',
  standalone: true,
  imports: [
    NzModalModule,
    NzIconModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    TranslateModule,
    NzButtonModule,
    MatInputModule,
    RouterLink
  ],
  templateUrl: './change-password-view.component.html',
  styleUrl: './change-password-view.component.scss'
})
export class ChangePasswordViewComponent {
  hidePass: boolean = true;
  hideRePass: boolean = true;

  public form: FormGroup = this.fb.group({
    password: [null, [Validators.required]],
    passwordNew: [null, [Validators.required, Validators.minLength(6)]],
    passwordConfirm: [null, [Validators.required]]
  }, { validators: this.matchPasswords });

  matchPasswords(group: FormGroup) {
    const passwordNew = group.get('passwordNew')?.value;
    const confirmPassword = group.get('passwordConfirm')?.value;
    return passwordNew === confirmPassword ? null : { passwordMismatch: true };
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
      oldPassword: this.form.get('password')?.value,
      newPassword: this.form.get('passwordNew')?.value,
      comfirmedPassword: this.form.get('passwordConfirm')?.value
    };
    this.accountService.changePassword(body).subscribe({
      next: (res) => {
        this.message.success("Đổi mật khẩu thành công!");
        this.router.navigate(['/home-page']);
      },
      error: (err) => {
        this.message.error("Đổi mật khẩu thất bại!")
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
  showPassNew(e: any) {
    const inputPass = document.querySelector(
      '#inputPassChangePasswordNew',
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
