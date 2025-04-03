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
import { PriceService } from '../../../../core/api/price.service';

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
      value: '05:00',
      label: '05:00'
    },
    {
      value: '06:30',
      label: '06:30'
    },
    {
      value: '08:00',
      label: '08:00'
    },
    {
      value: '09:30',
      label: '09:30'
    },
    {
      value: '11:00',
      label: '11:00'
    },
    {
      value: '12:30',
      label: '12:30'
    },
    {
      value: '14:00',
      label: '14:00'
    },
    {
      value: '15:30',
      label: '15:30'
    },
    {
      value: '17:00',
      label: '17:00'
    },
    {
      value: '18:30',
      label: '18:30'
    },
    {
      value: '20:00',
      label: '20:00'
    },
    {
      value: '21:30',
      label: '21:30'
    },
    {
      value: '23:00',
      label: '23:00'
    }
  ];
  
  public form: FormGroup = this.fb.group({
    facility: [null, Validators.required],
    timeStart: [null, Validators.required],
    timeEnd: [null, Validators.required],
    price: [null, Validators.required],
    coefficient: [null, Validators.required],
    lastPrice: [{value: null, disabled: true}],
    deposit: [{value: null, disabled: true}],
    startDate: [null, Validators.required],
    endDate: [null, Validators.required],
  });
  
  constructor(
      private fb: FormBuilder,
      private notification: NzNotificationService,
      private cdr: ChangeDetectorRef,
      private route: ActivatedRoute,
      private router: Router,
      private facilityService: FacilityService,
      private priceService: PriceService,
  ) {}
  
  ngOnInit(): void {
    this.idPrice = this.route.snapshot.paramMap.get('id');
    this.idOwner = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.sub;
    this.viewListFacility();
    if(this.idPrice) {
      this.getViewInfo();
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }

    this.form.get('price')?.valueChanges.subscribe(() => {
      this.calculatePrices();
    });
    
    this.form.get('coefficient')?.valueChanges.subscribe(() => {
      this.calculatePrices();
    });
  }

  calculatePrices(): void {
    const price = this.form.get('price')?.value || 0;
    const coefficient = this.form.get('coefficient')?.value || 0;
    
    if (price && coefficient) {
      const lastPrice = price * coefficient;
      const deposit = lastPrice * 0.3; 
      
      this.form.get('lastPrice')?.setValue(lastPrice);
      this.form.get('deposit')?.setValue(deposit);
    } else {
      this.form.get('lastPrice')?.setValue(null);
      this.form.get('deposit')?.setValue(null);
    }
  }
  
  getViewInfo(): void {
    if (!this.idPrice) return;
    
    this.priceService.getPriceById(this.idPrice).subscribe({
      next: (res) => {
        this.form.patchValue({
          facility: res.name,
          timeStart: res.startTime.substring(0, 5),
          timeEnd: res.endTime.substring(0, 5),
          startDate: res.startDate,
          endDate: res.endDate,
          price: res.basePrice,
          coefficient: res.coefficient,
          lastPrice: res.finalPrice,
          deposit: res.basePrice * 0.3,
        });
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Không thể lấy thông tin giá này!'
        );
      }
    });
  }

  viewListFacility() {
    this.facilityService.getAllFacilityOwner(1, 999)
      .subscribe(res => {
        this.listFacility = res.data;
      });
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
      const body = {
        facilityId: this.form.get('facility')?.value,
        startTime: this.form.get('timeStart')?.value,
        endTime: this.form.get('timeEnd')?.value,
        startDate: this.form.get('startDate')?.value,
        endDate: this.form.get('endDate')?.value,
        basePrice: Number(this.form.get('price')?.value),
        coefficient: Number(this.form.get('coefficient')?.value),
      };
      this.priceService.createPrice(body).subscribe({
        next: (res) => {
          this.notification.create(
            'success',
            'Thành công!',
            'Tạo giá sân mới thành công!'
          );
          this.cdr.detectChanges();
          this.router.navigate(['/price']);
        },
        error: (err) => {
          this.notification.create(
            'error',
            'Thất bại!',
            'Tạo giá sân mới thất bại!'
          );
        }
      });
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
