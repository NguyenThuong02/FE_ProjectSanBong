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
  status: 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE' | 'WAITING_APPROVAL';
  price: number;
  description: string;
  slotId?: string;
  imageUrl?: string;
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
  weekOffset: number = 0;
  // Modal properties
  showModal: boolean = false;
  selectedSlot: any;

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
    
    for (let week = -2; week <= 2; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(today);
        const currentDay = today.getDay();
        const diff = currentDay === 0 ? -6 : 1 - currentDay; 
        date.setDate(today.getDate() + diff);
        date.setDate(date.getDate() + (week * 7) + day);
        
        for (let time of this.timeSlots) {
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

  loadScheduleData(): void {
    this.scheduleData = [];
    if (this.apiCalendarData.length > 0) {
      for (const slot of this.apiCalendarData) {
        const startDate = new Date(slot.startDate);
        const startTime = slot.startTime;
        const endTime = slot.endTime;
        const timeSlot = `${startTime}-${endTime}`;
        
        // Determine status based on the API status value
        let status: 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE' | 'WAITING_APPROVAL';
        if (slot.status === 0) {
          status = 'AVAILABLE';
        } else if (slot.status === 1) {
          status = 'BOOKED';
        } else if (slot.status === 2) {
          status = 'CLOSED';
        } else if (slot.status === 4) {
          status = 'WAITING_APPROVAL';
        } else {
          status = 'NOT_AVAILABLE';
        }
        
        this.scheduleData.push({
          date: startDate,
          time: timeSlot,
          status: status,
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
    const currentDay = today.getDay();
    const firstDayOfCurrentWeek = new Date(today);
    const diff = currentDay === 0 ? -6 : 1 - currentDay;
    firstDayOfCurrentWeek.setDate(today.getDate() + diff);

    for (let week = -2; week <= 2; week++) {
      for (let day = 0; day < 7; day++) {
        const date = new Date(firstDayOfCurrentWeek);
        date.setDate(firstDayOfCurrentWeek.getDate() + (week * 7) + day);
        
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

  generateWeekDays(weekOffset: number): void {
    this.weekOffset = weekOffset;
    this.currentWeekDays = [];
    const today = new Date();
    const currentDay = today.getDay(); 
    const firstDayOfWeek = new Date(today);
    const diff = currentDay === 0 ? -6 : 1 - currentDay; // Nếu là CN thì lùi 6 ngày, nếu không thì lùi (currentDay - 1) ngày
    
    firstDayOfWeek.setDate(today.getDate() + diff);
    firstDayOfWeek.setDate(firstDayOfWeek.getDate() + (weekOffset * 7));
    for (let i = 0; i < 7; i++) {
      const nextDay = new Date(firstDayOfWeek);
      nextDay.setDate(firstDayOfWeek.getDate() + i);
      this.currentWeekDays.push(nextDay);
    }
  }

  navigateWeek(direction: number): void {
    const newOffset = this.weekOffset + direction;
    if (newOffset >= -2 && newOffset <= 2) {
      this.generateWeekDays(newOffset);
    }
  }

  getWeekRangeText(): string {
    if (this.currentWeekDays.length === 0) return '';
    
    const firstDay = this.currentWeekDays[0];
    const lastDay = this.currentWeekDays[6];
    
    const formatDay = (date: Date) => {
      return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };
    
    return `${formatDay(firstDay)} - ${formatDay(lastDay)}`;
  }

  getWeekLabel(): string {
    if (this.weekOffset === 0) return 'Tuần hiện tại';
    if (this.weekOffset < 0) return `${Math.abs(this.weekOffset)} tuần trước`;
    return `${this.weekOffset} tuần sau`;
  }

  getCountByStatusForCurrentWeek(status: 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE' | 'WAITING_APPROVAL'): number {
    if (!this.currentWeekDays.length) return 0;
    
    return this.scheduleData.filter(slot => {
      const slotDate = new Date(slot.date);
      const isInCurrentWeek = this.currentWeekDays.some(day => this.isSameDay(day, slotDate));
      
      return isInCurrentWeek && slot.status === status;
    }).length;
  }

  getTotalSlotsForCurrentWeek(): number {
    if (!this.currentWeekDays.length) return 0;
    return this.timeSlots.length * this.currentWeekDays.length;
  }

  // Show a specific week
  showWeek(weekIndex: number): void {
    this.currentWeekIndex = weekIndex;
    this.generateWeekDays(weekIndex);
  }

  // Get slot status
  getSlotStatus(date: Date, time: string): 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE' | 'WAITING_APPROVAL' {
    const slot = this.scheduleData.find(s => 
      this.isSameDay(s.date, date) && s.time === time
    );
    
    if (!slot) {
      return 'NOT_AVAILABLE';
    }
    
    return slot.status;
  }

  // Get CSS class based on slot status
  getSlotClass(day: Date, time: string): string {
    const slot = this.getSlot(day, time);
    if (!slot) return '';
    
    switch (slot.status) {
      case 'AVAILABLE': return 'bg-green-500 text-white';
      case 'BOOKED': return 'bg-red-500 text-white';
      case 'CLOSED': return 'bg-yellow-500 text-white';
      case 'WAITING_APPROVAL': return 'bg-gray-400 text-white';
      case 'NOT_AVAILABLE': return 'bg-white border';
      default: return '';
    }
  }

  // Get slot by date and time
  getSlot(date: Date, time: string): ScheduleSlot | undefined {
    return this.scheduleData.find(s => 
      this.isSameDay(s.date, date) && s.time === time
    );
  }

  // Open edit modal
  openEditModal(date: Date, time: string): void {
    const slot:any = this.scheduleData.find(s => 
      this.isSameDay(s.date, date) && s.time === time
    );
    
    const [startTime, endTime] = slot.time.split('-');
        
    // Format date for API (YYYY-MM-DD)
    const formattedDate = this.formatDateForApi(date);
    
    this.bookService.getSlotDetail(slot.slotId, formattedDate, startTime, endTime).subscribe({
      next: (res) => {
        if (res && res.data) {
          this.selectedSlot = {
            ...res.data,
            status: this.getStatusFromCode(res.data.status)
          };
          this.showModal = true;
        }
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Không thể lấy thông tin chi tiết!'
        );
      }
    });
  }
  
  // Helper method to convert status code to string
  getStatusFromCode(statusCode: number): 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE' | 'WAITING_APPROVAL' {
    switch (statusCode) {
      case 0: return 'AVAILABLE';
      case 1: return 'BOOKED';
      case 2: return 'CLOSED';
      case 4: return 'WAITING_APPROVAL';
      default: return 'NOT_AVAILABLE';
    }
  }

  // Close modal
  closeModal(): void {
    this.showModal = false;
  }

  // Save slot changes
  saveSlotChanges(): void {
    const startDate = typeof this.selectedSlot.startDate === 'string' 
    ? new Date(this.selectedSlot.startDate) 
    : this.selectedSlot.startDate;
    const formattedDate = this.formatDateForApi(startDate);

    const updateData = {
      slotId: this.selectedSlot.slotId,
      date: formattedDate,
      startTime: this.selectedSlot.startTime,
      endTime: this.selectedSlot.endTime,
      note: this.selectedSlot.description,
      finalPrice: this.selectedSlot.finalPrice,
      status: this.getStatusCode(this.selectedSlot.status)
    };
    
    this.bookService.updatedBooking(updateData).subscribe({
      next: (res) => {
        this.notification.create(
          'success',
          'Thành công!',
          'Cập nhật lịch thành công!'
        );
        this.getViewInfo();
        this.closeModal();
      },
      error: (err) => {
        this.notification.create(
          'error',
          'Thất bại!',
          'Không thể cập nhật lịch!'
        );
      }
    });
  }

  formatDateForApi(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  getStatusCode(status: 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE' | 'WAITING_APPROVAL'): number {
    switch (status) {
      case 'AVAILABLE': return 0;
      case 'BOOKED': return 1;
      case 'CLOSED': return 2;
      case 'WAITING_APPROVAL': return 4;
      case 'NOT_AVAILABLE': 
      default: return 3;
    }
  }

  isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }

  formatDate(date: Date): string {
    return `${date.getDate()}/${date.getMonth() + 1}`;
  }

  getDayName(date: Date): string {
    const days = ['Chủ nhật', 'Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7'];
    return days[date.getDay()];
  }

  getCountByStatus(status: 'AVAILABLE' | 'BOOKED' | 'CLOSED' | 'NOT_AVAILABLE' | 'WAITING_APPROVAL'): number {
    return this.scheduleData.filter(slot => slot.status === status).length;
  }

  getTotalSlots(): number {
    return this.scheduleData.length;
  }
}