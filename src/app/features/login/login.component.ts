import {
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { SnackbarService } from '../../core/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/api/auth.service';
import { Router, RouterLink } from '@angular/router';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OAuthService } from 'angular-oauth2-oidc';
import { HttpClient } from '@angular/common/http';
import { JwksValidationHandler } from 'angular-oauth2-oidc-jwks';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { SocialLoginModule, FacebookLoginProvider, SocialAuthService, SocialAuthServiceConfig, SocialUser } from '@abacritt/angularx-social-login';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzSelectModule, NzSelectSizeType } from 'ng-zorro-antd/select';
import { NzRadioModule } from 'ng-zorro-antd/radio';
import { NgOtpInputConfig, NgOtpInputModule } from  'ng-otp-input';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-login',
  standalone: true,

  imports: [
    CommonModule,
    MatInput,
    ReactiveFormsModule,
    MatFormFieldModule,
    NzCheckboxModule,
    FormsModule,
    TranslateModule,
    NzButtonModule,
    SocialLoginModule,
    RouterLink,
    NgOtpInputModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: FacebookLoginProvider.PROVIDER_ID,
            provider: new FacebookLoginProvider('1006317877546547')
          }
        ],
        onError: (err) => {
          console.error(err);
        }
      } as SocialAuthServiceConfig,
    }
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public formLogin: FormGroup = this.fb.group({
    userName: [null, Validators.required],
    password: [null, Validators.required],
  });
  public formForGot: FormGroup = this.fb.group({
    email: [null, Validators.required],
  });
  public formNewPassword: FormGroup = this.fb.group({
    password: [null, Validators.required],
    passwordConfirm: [null, Validators.required],
  }, { validators: this.matchPasswords });

  wrongUserNameOrPassword: string;
  remember: boolean = false;
  isLoading: boolean = false;
  user: any;
  loggedIn: any;
  hidePass: boolean = true;
  hideRePass: boolean = true;
  public step: 'login' | 'forgotPassword' | 'otpVerification' | 'resetPassword' = 'login';
  isConfirmLoading = false;
  @ViewChild('ngOtpInput') ngOtpInputRef:any;
  otpConfig :NgOtpInputConfig = {
    allowNumbersOnly: false,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: true,
    inputStyles:{
      'border-radius': '16px'
    },
    containerStyles:{
      'display':'flex'
    },
    inputClass:'each_input',
    containerClass:'all_inputs'
  };

  size: NzSelectSizeType = 'default';
  display: any;
  isLast10Seconds = false;
  timer(minute: any) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;
      this.isLast10Seconds = seconds <= 10;
      if (seconds == 0) {
        console.log("finished");
        clearInterval(timer);
      }
    }, 1000);
  }

  constructor(
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private _snackBar: SnackbarService,
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService,
    private OAuthService: OAuthService,
    private authService: SocialAuthService,
    private http: HttpClient,
    private message: NzMessageService,
  ) {
    window.addEventListener('storage', (event) => {
      // The `key` is `null` if the event was caused by `.clear()`
      if (event.key !== 'access_token' && event.key !== null) {
        return;
      }

      console.warn(
        'Noticed changes to access_token (most likely from another tab), updating isAuthenticated',
      );
      if (!this.OAuthService.hasValidAccessToken()) {
        router.navigate(['/login']);
      }
    });
  }
  idIntervalLoginTrueAccount: any;
  ngOnInit(): void {
    this.translate
      .get('Toast.wrongUserNameOrpassword')
      .subscribe((value) => (this.wrongUserNameOrPassword = value));
    this.translate.onLangChange.subscribe((e) => {
      this.translate
        .get('Toast.wrongUserNameOrpassword')
        .subscribe((value) => (this.wrongUserNameOrPassword = value));
    });
    this.authService.authState.subscribe((user: SocialUser) => {
      this.user = user;
      this.loggedIn = (user != null);
      if (this.loggedIn) {
        this.router.navigate(['/']); 
      }
    });
  }

  login() {
    this.isLoading = true;
    const body = {
      username: this.formLogin.get('userName')?.value,
      password: this.formLogin.get('password')?.value,
      rememberMe: true,
    };
    if (this.formLogin.invalid) {
      this.formLogin.get('userName')?.markAsTouched();
      this.formLogin.get('password')?.markAsTouched();
      this.isLoading = false;

      return;
    }

    this.OAuthService.setStorage(localStorage);
    this.OAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.OAuthService.loadDiscoveryDocumentAndTryLogin()
      .then(() => {
        console.log('Discovery document loaded');
        this.OAuthService.tryLogin();
      })
      .catch((err) => {
        console.error('Error loading discovery document', err);
      });
    this.OAuthService.initImplicitFlow();
    this.OAuthService.fetchTokenUsingPasswordFlowAndLoadUserProfile(
      this.formLogin.get('userName')?.value || 'administrator',
      this.formLogin.get('password')?.value || 'Administrator1',
    )
      .then((res) => {
        this.isLoading = false;
        this.OAuthService.setupAutomaticSilentRefresh();
        this.router.navigate(['/']);
      })
      .catch((err) => {
        this.isLoading = false;
        if (err?.error?.error_description.includes('The user account has been disabled.')) {
          this._snackBar.error('Tài khoản của bạn đã bị vô hiệu hoá');
        } else {
          this._snackBar.error(this.wrongUserNameOrPassword);
        }
      });

    this.OAuthService.events.subscribe((event) => {
      if (event.type === 'token_expires') {
        console.log('Token is about to expire. Performing silent refresh...');
        this.OAuthService.silentRefresh()
          .then((info) => {
            console.log('Silent refresh successful', info);
          })
          .catch((err) => {
            console.error('Silent refresh error', err);
          });
      }
    });

    this.OAuthService.tokenValidationHandler = new JwksValidationHandler();
    this.OAuthService.loadDiscoveryDocumentAndTryLogin();
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

  matchPasswords(group: FormGroup) {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('passwordConfirm')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  signOut(): void {
    this.authService.signOut();
  }

  forGotPass(): void {
    this.step = 'forgotPassword';
  }

  backLogin(): void {
    this.step = 'login';
  }

  btnEmail(): void {
    this.timer(2);
    this.step = 'otpVerification';
  }

  btnOTP(): void {
    const body = {
      otp: this.ngOtpInputRef.currentVal
    }
    if(this.ngOtpInputRef.currentVal === null || this.ngOtpInputRef.currentVal.length !== 6){
      this.message.error("Nhập đầy đủ mã OTP!")
      return;
    } else {
      this.step = 'resetPassword';
    }
  }

  btnNewPassword(): void {
    this.step = 'login';
  }
}
