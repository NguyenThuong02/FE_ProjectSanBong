import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalComponent, NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import { ManagermentService } from '../../../core/api/managerment.service';
import { phoneNumberValidator } from '../../../shared/validate/check-phone-number.directive';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FacilityService } from '../../../core/api/facility.service';

@Component({
  selector: 'app-add-facility',
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
  templateUrl: './add-facility.component.html',
  styleUrl: './add-facility.component.scss'
})
export class AddFacilityComponent implements OnInit {
  isEdit: boolean = false;
  idUser: any;
  public listType: any = [
    {
      value: 'Football',
      label: 'Football',
    },
    {
      value: 'Pickerball',
      label: 'Pickerball',
    },
    {
      value: 'Tenis',
      label: 'Tenis',
    },
    {
      value: 'Bóng rổ',
      label: 'Bóng rổ',
    },
    {
      value: 'Cầu lông',
      label: 'Cầu lông',
    },
  ];
  constructor(
      private fb: FormBuilder,
      private message: NzMessageService,
      private cdr: ChangeDetectorRef,
      private facilityService: FacilityService,
      private route: ActivatedRoute,
      private router: Router,
  ) {}
  ngOnInit(): void {
    this.idUser = this.route.snapshot.paramMap.get('id');
    if(this.idUser) {
      this.getViewInfo();
      this.isEdit = true;
    } else {
      this.isEdit = false;
    }
  }
  
  public form: FormGroup = this.fb.group({
    name: [null, Validators.required],
    type: ['Football', Validators.required],
    address: [null, Validators.required],
    price: [null, Validators.required],
    description: [null, Validators.required]
  });

    // avatar change
  public avatarChangeForm: FormGroup = this.fb.group({
      image: [null]
  }) 

  getViewInfo(): void {

  }

  handleSubmit(): void {
    const body = {
      name: this.form.get('name')?.value,
      address: this.form.get('address')?.value,
      description: this.form.get('description')?.value,
      facilityType: this.form.get('type')?.value,
      status: 0
    };
    if(!this.isEdit) {
      this.facilityService.createFacility(body).subscribe({
        next: (res) => {
          this.message.success('Tạo sân mới thành công');
          this.cdr.detectChanges();
          this.router.navigate([`/facility/list`]);
        },
        error: (err) => {
          this.message.error('Tạo sân mới thất bại!');
        }
      })
    } else {
      
    }
  }
}
