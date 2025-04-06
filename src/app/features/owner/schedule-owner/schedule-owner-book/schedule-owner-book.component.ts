import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FacilityService } from '../../../../core/api/facility.service';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { BookService } from '../../../../core/api/book.service';

interface ScheduleSlot {
  date: Date;
  time: string;
  status: 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE';
  price: number;
  description: string;
  slotId?: string;
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
  apiCalendarData: any[] = [];
  
  // Schedule data
  scheduleData: ScheduleSlot[] = [];
  timeSlots: string[] = [
    '05:00-06:30', '06:30-08:00', '08:00-09:30', '09:30-11:00',
    '11:00-12:30', '12:30-14:00', '14:00-15:30', '15:30-17:00',
    '17:00-18:30', '18:30-20:00', '20:00-21:30', '21:30-23:00'
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
    private bookService: BookService,
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
    this.bookService.getCalendarId(this.idFacility).subscribe({
      next: (res) => {
        this.selectedField = res;
        this.apiCalendarData = res.calendar || [];
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

  loadScheduleData(): void {
    this.scheduleData = [];
    if (this.apiCalendarData.length > 0) {
      for (const slot of this.apiCalendarData) {
        const startDate = new Date(slot.startDate);
        const startTime = slot.startTime;
        const endTime = slot.endTime;
        const timeSlot = `${startTime}-${endTime}`;
        this.scheduleData.push({
          date: startDate,
          time: timeSlot,
          status: slot.status === 0 ? 'AVAILABLE' : 'BOOKED', 
          price: slot.finalPrice,
          description: slot.note || '',
          slotId: slot.slotId
        });
      }
    }
    this.generateMissingSlots();
  }
  
  generateMissingSlots(): void {
    const today = new Date();

    for (let week = 0; week < 3; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        date.setDate(today.getDate() + (week * 7) + day);
        
        for (let time of this.timeSlots) {
          // Check if this slot exists in scheduleData
          const exists = this.scheduleData.some(s => 
            this.isSameDay(s.date, date) && s.time === time
          );
          
          // If not exists, add as NOT_AVAILABLE
          if (!exists) {
            this.scheduleData.push({
              date: new Date(date),
              time: time,
              status: 'NOT_AVAILABLE',
              price: 0,
              description: 'Chưa tạo giá tiền'
            });
          }
        }
      }
    }
  }

  // Generate days for a specific week
  generateWeekDays(weekIndex: number): void {
    this.currentWeekDays = [];
    const today = new Date();
    
    // Start from today instead of finding Sunday
    const firstDay = new Date(today);
    
    // Add weekIndex weeks
    if (weekIndex > 0) {
      firstDay.setDate(firstDay.getDate() + (weekIndex * 7));
    }
    
    // Generate 7 days starting from today
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
  getSlotStatus(date: Date, time: string): 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE' {
    const slot = this.scheduleData.find(s => 
      this.isSameDay(s.date, date) && s.time === time
    );
    
    if (!slot) {
      return 'NOT_AVAILABLE';
    }
    
    return slot.status;
  }

  // Get CSS class based on slot status
  getSlotClass(date: Date, time: string): string {
    const status = this.getSlotStatus(date, time);
    switch(status) {
      case 'AVAILABLE': return 'bg-green-100 hover:bg-green-200';
      case 'BOOKED': return 'bg-red-100 hover:bg-red-200';
      case 'CLOSED': return 'bg-gray-100 hover:bg-gray-200';
      case 'NOT_AVAILABLE': return 'bg-white-100 hover:bg-white-200';
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
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[date.getDay()];
  }

  // Get count by status for display in sidebar
  getCountByStatus(status: 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE'): number {
    return this.scheduleData.filter(slot => slot.status === status).length;
  }

  // Get total slots
  getTotalSlots(): number {
    return this.scheduleData.length;
  }
}