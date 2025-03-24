import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FacilityService } from '../../../../core/api/facility.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-add-price',
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
    MatNativeDateModule,
    MatSelectModule,
    TranslateModule,
    NzButtonModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-price.component.html',
  styleUrl: './add-price.component.scss'
})
export class AddPriceComponent implements OnInit {
  idOwner: any;
  isEdit: boolean = false;
  idPrice: any;
  listFacility: any;
  listTime: any = [
    {
      value: '06:00',
      label: '06:00'
    },
    {
      value: '07:00',
      label: '07:00'
    },
    {
      value: '08:00',
      label: '08:00'
    },
    {
      value: '09:00',
      label: '09:00'
    },
    {
      value: '10:00',
      label: '10:00'
    },
    {
      value: '11:00',
      label: '11:00'
    },
    {
      value: '12:00',
      label: '12:00'
    },
    {
      value: '13:00',
      label: '13:00'
    },
    {
      value: '14:00',
      label: '14:00'
    },
    {
      value: '15:00',
      label: '15:00'
    },
    {
      value: '16:00',
      label: '16:00'
    },
    {
      value: '17:00',
      label: '17:00'
    },
    {
      value: '18:00',
      label: '18:00'
    },
    {
      value: '19:00',
      label: '19:00'
    },
    {
      value: '20:00',
      label: '20:00'
    },
    {
      value: '21:00',
      label: '21:00'
    },
    {
      value: '22:00',
      label: '22:00'
    },
  ];
  
  public form: FormGroup = this.fb.group({
    name: [null, Validators.required],
    timeStart: [null, Validators.required],
    timeEnd: [null, Validators.required],
    price: [null, Validators.required],
    deposit: [null, Validators.required],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
  });
  
  constructor(
      private fb: FormBuilder,
      private notification: NzNotificationService,
      private cdr: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router,
  ) {}
  
  ngOnInit(): void {
    this.idPrice = this.route.snapshot.paramMap.get('id');
    this.idOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.sub;
    if(this.idPrice) {
      this.getViewInfo();
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  }
  

  getViewInfo(): void {
    if (!this.idPrice) return;
    
    // this.facilityService.getFacilityById(this.idFacility).subscribe({
    //   next: (res) => {
    //     this.form.patchValue({
    //       name: res.data.name,
    //       type: res.data.facilityType,
    //       address: res.data.address,
    //       price: res.data.price,
    //       description: res.data.description,
    //       imageUrl: res.data.image
    //     });
    //   },
    //   error: (err) => {
    //     this.notification.create(
    //       'error',
    //       'Thất bại!',
    //       'Không thể lấy thông tin sân!'
    //     );
    //   }
    // });
  }

  handleSubmit(): void {
    if (this.form.invalid) {
      Object.keys(this.form.controls).forEach(key => {
        const control = this.form.get(key);
        if (control) {
          control.markAsDirty();
          control.markAsTouched();
        }
      });
      this.notification.create(
        'warning',
        'Lỗi!',
        'Vui lòng nhập đầy đủ thông tin bắt buộc!'
      );
      return;
    }
        
    if(!this.isEdit) {
      // const body = {
      //   name: this.form.get('name')?.value,
      //   address: this.form.get('address')?.value,
      //   description: this.form.get('description')?.value,
      //   facilityType: this.form.get('type')?.value,
      //   price: this.form.get('price')?.value,
      //   image: this.form.get('imageUrl')?.value,
      //   status: 1
      // };
      // this.facilityService.createFacility(body).subscribe({
      //   next: (res) => {
      //     this.notification.create(
      //       'success',
      //       'Thành công!',
      //       'Tạo sân mới thành công!'
      //     );
      //     this.cdr.detectChanges();
      //     this.router.navigate(['/facility/list']);
      //   },
      //   error: (err) => {
      //     this.notification.create(
      //       'error',
      //       'Thất bại!',
      //       'Tạo sân mới thất bại!'
      //     );
      //   }
      // });
    } else {
      // const body = {
      //   id: this.idPrice,
      //   ownerId: this.idOwner,
      //   name: this.form.get('name')?.value,
      //   address: this.form.get('address')?.value,
      //   description: this.form.get('description')?.value,
      //   facilityType: this.form.get('type')?.value,
      //   price: this.form.get('price')?.value,
      //   image: this.form.get('imageUrl')?.value,
      //   status: 1
      // };
      // this.facilityService.updateFacility(body).subscribe({
      //   next: (res) => {
      //     this.notification.create(
      //       'success',
      //       'Thành công!',
      //       'Cập nhật sân thành công!'
      //     );
      //     this.cdr.detectChanges();
      //     this.router.navigate(['/facility/list']);
      //   },
      //   error: (err) => {
      //     this.notification.create(
      //       'error',
      //       'Thất bại!',
      //       'Cập nhật sân thất bại!'
      //     );
      //   }
      // });
    }
  }
}
