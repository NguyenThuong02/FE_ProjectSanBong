import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FacilityService } from '../../../../core/api/facility.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';

interface ScheduleSlot {
  date: Date;
  time: string;
  status: 'AVAILABLE' | 'BOOKED' | 'CLOSED';
  price: number;
  description: string;
}

@Component({
  selector: 'app-schedule-owner-book',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink
  ],
  templateUrl: './schedule-owner-book.component.html',
  styleUrl: './schedule-owner-book.component.scss'
})
export class ScheduleOwnerBookComponent {
  idFacility: any;
  selectedField: any = {};
  
  // Schedule data
  scheduleData: ScheduleSlot[] = [];
  timeSlots: string[] = [
    '06:00-07:00', '07:00-08:00', '08:00-09:00', '09:00-10:00',
    '10:00-11:00', '11:00-12:00', '12:00-13:00', '13:00-14:00',
    '14:00-15:00', '15:00-16:00', '16:00-17:00', '17:00-18:00',
    '18:00-19:00', '19:00-20:00', '20:00-21:00', '21:00-22:00'
  ];
  
  // Week navigation
  currentWeekIndex: number = 0;
  currentWeekDays: Date[] = [];
  
  // Modal properties
  showModal: boolean = false;
  selectedSlot: ScheduleSlot = {
    date: new Date(),
    time: '',
    status: 'AVAILABLE',
    price: 0,
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private facilityService: FacilityService,
    private notification: NzNotificationService
  ){}

  ngOnInit(): void {
    this.idFacility = this.route.snapshot.paramMap.get('id');
    this.getViewInfo();
    this.initializeSchedule();
    this.generateWeekDays(0); // Generate days for current week
  }

  getViewInfo(): void {
    if (!this.idFacility) return;

    this.facilityService.getFacilityById(this.idFacility).subscribe({
      next: (res) => {
        this.selectedField = res.data;
        // After loading field data, load schedule data
        this.loadScheduleData();
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

  // Initialize empty schedule
  initializeSchedule(): void {
    const today = new Date();
    
    // Generate slots for 3 weeks
    for (let week = 0; week < 3; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + (week * 7) + day);
        
        for (let time of this.timeSlots) {
          this.scheduleData.push({
            date: new Date(date),
            time: time,
            status: 'AVAILABLE', // Default to available
            price: 100000, // Default price
            description: ''
          });
        }
      }
    }
  }

  // Load schedule data from API
  loadScheduleData(): void {
    // In real implementation, you would fetch data from backend
    // For now, we'll just use the initialized data
    
    // Example of API call:
    /*
    this.facilityService.getSchedule(this.idFacility).subscribe({
      next: (res) => {
        // Map response data to scheduleData
        this.scheduleData = res.data.map(item => ({
          date: new Date(item.date),
          time: item.time,
          status: item.status,
          price: item.price,
          description: item.description
        }));
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Không thể lấy thông tin lịch!'
        );
      }
    });
    */
  }

  // Generate days for a specific week
  generateWeekDays(weekIndex: number): void {
    this.currentWeekDays = [];
    const today = new Date();
    
    // Find the first day of the week (Sunday)
    const firstDay = new Date(today);
    const day = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    firstDay.setDate(today.getDate() - day); // Go to Sunday
    
    // Add weekIndex weeks
    firstDay.setDate(firstDay.getDate() + (weekIndex * 7));
    
    // Generate 7 days from Sunday
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(firstDay);
      nextDay.setDate(firstDay.getDate() + i);
      this.currentWeekDays.push(nextDay);
    }
  }

  // Show a specific week
  showWeek(weekIndex: number): void {
    this.currentWeekIndex = weekIndex;
    this.generateWeekDays(weekIndex);
  }

  // Get slot status
  getSlotStatus(date: Date, time: string): 'AVAILABLE' | 'BOOKED' | 'CLOSED' {
    const slot = this.scheduleData.find(s => 
      this.isSameDay(s.date, date) && s.time === time
    );
    return slot ? slot.status : 'AVAILABLE';
  }

  // Get CSS class based on slot status
  getSlotClass(date: Date, time: string): string {
    const status = this.getSlotStatus(date, time);
    switch(status) {
      case 'AVAILABLE': return 'bg-green-100 hover:bg-green-200';
      case 'BOOKED': return 'bg-red-100 hover:bg-red-200';
      case 'CLOSED': return 'bg-gray-100 hover:bg-gray-200';
      default: return '';
    }
  }

  // Open edit modal
  openEditModal(date: Date, time: string): void {
    const slot = this.scheduleData.find(s => 
      this.isSameDay(s.date, date) && s.time === time
    );
    
    if (slot) {
      this.selectedSlot = {...slot};
    } else {
      this.selectedSlot = {
        date: new Date(date),
        time: time,
        status: 'AVAILABLE',
        price: 100000,
        description: ''
      };
    }
    
    this.showModal = true;
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
  }

  // Save slot changes
  saveSlotChanges(): void {
    const index = this.scheduleData.findIndex(s => 
      this.isSameDay(s.date, this.selectedSlot.date) && s.time === this.selectedSlot.time
    );
    
    if (index !== -1) {
      this.scheduleData[index] = {...this.selectedSlot};
    } else {
      this.scheduleData.push({...this.selectedSlot});
    }
    
    // In real implementation, you would update to backend:
    /*
    this.facilityService.updateScheduleSlot(this.idFacility, this.selectedSlot).subscribe({
      next: (res) => {
        this.notification.create(
          'success',
          'Thành công!',
          'Cập nhật lịch thành công!'
        );
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Không thể cập nhật lịch!'
        );
      }
    });
    */
    
    // Show success notification
    this.notification.create(
      'success',
      'Thành công!',
      'Cập nhật lịch thành công!'
    );
    
    this.closeModal();
  }

  // Helper to check if two dates are the same day
  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  // Format date for display
  formatDate(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  // Get day name
  getDayName(date: Date): string {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  }

  // Get count by status for display in sidebar
  getCountByStatus(status: 'AVAILABLE' | 'BOOKED' | 'CLOSED'): number {
    return this.scheduleData.filter(slot => slot.status === status).length;
  }

  // Get total slots
  getTotalSlots(): number {
    return this.scheduleData.length;
  }
}