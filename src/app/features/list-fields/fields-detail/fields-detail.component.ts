import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FeildsSheduleComponent } from './feilds-shedule/feilds-shedule.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { FacilityService } from '../../../core/api/facility.service';

interface TimeSlot {
  id: number;
  day: number;
  week: number; 
  startTime: Date;
  endTime: Date;
  status: 'available' | 'booked' | 'closed';
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-fields-detail',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FeildsSheduleComponent,
    RouterLink
  ],
  templateUrl: './fields-detail.component.html',
  styleUrl: './fields-detail.component.scss'
})
export class FieldsDetailComponent implements OnInit {
  isShedule: boolean = false;
  idFacility: any;
  selectedField: any;

  constructor(
    private route: ActivatedRoute,
    private message: NzMessageService,
    private cdr: ChangeDetectorRef,
    private facilityService: FacilityService,
  ){}

  ngOnInit(): void {
    this.idFacility = this.route.snapshot.paramMap.get('id');
    this.getViewInfo();
  }

  getViewInfo(): void {
    if (!this.idFacility) return;

    this.facilityService.getFacilityById(this.idFacility).subscribe({
      next: (res) => {
        this.selectedField = res.data;
      },
      error: (err) => {
        this.message.error('Không thể lấy thông tin sân!');
      }
    });
  }

  nextShedule() {
    this.isShedule = true;
  }
}