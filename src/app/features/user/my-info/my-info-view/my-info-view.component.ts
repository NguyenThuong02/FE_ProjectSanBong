import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  requiredMsg: string = '';
  fullName: string = '';
  isLoadingSaveEdit: boolean = false;
  isEdit: boolean = false;
  idOwner: any;
  nameOwner: any;
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
          address: res.address
        });
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


  handleSubmit(): void {
    const body = {
        fullName: this.form.get('fullName')?.value,
        gender: this.form.get('gender')?.value,
        address: this.form.get('address')?.value,
        birthday: this.form.get('dob')?.value,
        phone: this.form.get('phoneNumber')?.value
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
      
  }

}
