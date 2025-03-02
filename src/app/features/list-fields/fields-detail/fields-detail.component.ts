import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { FeildsSheduleComponent } from './feilds-shedule/feilds-shedule.component';
import { RouterLink } from '@angular/router';

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
  selectedField = {
    name: 'Sân Bóng đá Đầm Hồng',
    address: 'Thạch Thất, Hà Nội',
    description: 'Sân bóng đá 7 người, chất lương tốt, thời gian thoải mái, giá tiền hợp lý',
    img: 'https://bulbal.vn/wp-content/uploads/2023/01/TOP-10-SAN-BONG-DA-PHUI-TAI-TPHCM-NAM-2023.jpg',
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  nextShedule() {
    this.isShedule = true;
  }
}