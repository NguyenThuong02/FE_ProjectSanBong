import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FeildsSheduleComponent } from './feilds-shedule/feilds-shedule.component';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { BookService } from '../../../../core/api/book.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
    private cdr: ChangeDetectorRef,
    private bookService: BookService,
    private notification: NzNotificationService
  ){}

  ngOnInit(): void {
    this.idFacility = this.route.snapshot.paramMap.get('id');
    this.getViewInfo();
  }

  getViewInfo(): void {
    if (!this.idFacility) return;
    this.bookService.getCalendarIdByCustomer(this.idFacility).subscribe({
      next: (res) => {
        this.selectedField = res.data;
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Không thể lấy thông tin sân!'
        );
      }
    });
  }

  nextShedule() {
    this.isShedule = true;
  }
}