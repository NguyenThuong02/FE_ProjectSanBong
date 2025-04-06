import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { PopupNeedLoginComponent } from '../popup-need-login/popup-need-login.component';
import { ModalBookComponent } from '../modal-book/modal-book.component';
import { ModalDetailComponent } from '../modal-detail/modal-detail.component';
import { ModalCloseComponent } from '../modal-close/modal-close.component';

interface TimeSlot {
  id: number;
  day: number;
  week: number; 
  startTime: Date;
  endTime: Date;
  status: 'available' | 'booked' | 'closed' | 'user-booked' | 'not-in-api';
  bookedBy?: string;
  title?: string;
  description?: string;
  slotId?: string;
  finalPrice?: number;
}

@Component({
  selector: 'app-feilds-shedule',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    PopupNeedLoginComponent,
    ModalBookComponent,
    ModalDetailComponent,
    ModalCloseComponent
  ],
  templateUrl: './feilds-shedule.component.html',
  styleUrl: './feilds-shedule.component.scss'
})
export class FeildsSheduleComponent implements OnInit{
  timeSlots: TimeSlot[] = [];
  weekDays: Date[] = [];
  timeRanges: {hour: number, minute: number, label: string}[] = [];
  selectedSlot: TimeSlot | null = null;
  bookingForm: FormGroup;
  currentWeekStart: Date = new Date();
  maxWeeks: number = 3; // Tuần hiện tại + 2 tuần tiếp theo
  currentWeekIndex: number = 0; // 0: tuần hiện tại, 1: tuần tiếp theo, 2: tuần sau nữa
  isLoading: boolean = false;
  isVisible: boolean = false;
  isVisibleBook: boolean = false;
  isVisibleDetail: boolean = false;
  isVisibleClosed: boolean = false;
  slot: any;
  currentUserId: string = '';
  @Input() detailInfo: any;
  dayNames = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy'];
  
  statusColorMap = {
    'available': 'bg-green-400',
    'booked': 'bg-blue-400',
    'closed': 'bg-red-400',
    'user-booked': 'bg-red-400',
    'not-in-api': '#fff'
  };
  
  statusTextMap = {
    'available': 'Trống',
    'booked': 'Hết chỗ',
    'closed': 'Đã đóng',
    'user-booked': 'Đã đặt',
    'not-in-api': 'Không có lịch'
  };

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,   
    private oauthService: OAuthService 
  ) {
    this.bookingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      action: ['book'] // 'book' hoặc 'close'
    });
    
    // Thiết lập ngày bắt đầu là ngày hiện tại
    this.setTodayAsStart();
    
    // Tạo dãy thời gian
    this.generateTimeRanges();
  }

  ngOnInit(): void {
    // Lấy ID người dùng hiện tại (nếu đã đăng nhập)
    if (this.isLoggedIn()) {
      this.getCurrentUserId();
    }
    
    // Khởi tạo các ngày trong tuần
    this.generateWeekDays();
    
    // Tải dữ liệu cho tuần hiện tại
    this.fetchTimeSlots();
  }
  
  // Kiểm tra xem người dùng đã đăng nhập chưa
  isLoggedIn(): boolean {
    return this.oauthService.hasValidAccessToken();
  }
  
  // Lấy ID người dùng hiện tại từ token
  getCurrentUserId(): void {
    this.currentUserId = JSON.parse(
      localStorage.getItem('id_token_claims_obj') || '{}',
    )?.sub;
  }
  
  // Thiết lập ngày bắt đầu là ngày hiện tại
  setTodayAsStart(): void {
    this.currentWeekStart = new Date();
    // Đặt giờ về 00:00:00
    this.currentWeekStart.setHours(0, 0, 0, 0);
  }
  
  // Tạo các mốc thời gian trong ngày (1.5 giờ mỗi slot)
  generateTimeRanges(): void {
    // Tạo các khung giờ từ 5:00 đến 23:00, mỗi slot 1.5 giờ
    const startHour = 5;
    const endHour = 23;
    
    for (let hour = startHour; hour < endHour; hour += 1.5) {
      const fullHour = Math.floor(hour);
      const minute = (hour - fullHour) * 60;
      
      const nextHour = hour + 1.5;
      const nextFullHour = Math.floor(nextHour);
      const nextMinute = (nextHour - nextFullHour) * 60;
      
      const startTimeStr = `${fullHour.toString().padStart(2, '0')}:${minute === 0 ? '00' : '30'}`;
      const endTimeStr = `${nextFullHour.toString().padStart(2, '0')}:${nextMinute === 0 ? '00' : '30'}`;
      
      this.timeRanges.push({
        hour: fullHour,
        minute: minute,
        label: `${startTimeStr} - ${endTimeStr}`
      });
    }
  }
  
  // Tạo các ngày trong tuần
  generateWeekDays(): void {
    this.weekDays = [];
    const startDate = new Date(this.currentWeekStart);
    
    // Thêm số ngày tương ứng với tuần hiện tại
    startDate.setDate(startDate.getDate() + (this.currentWeekIndex * 7));
    
    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      this.weekDays.push(date);
    }
  }
  
  // Chuyển đến tuần trước
  previousWeek(): void {
    if (this.currentWeekIndex > 0) {
      this.currentWeekIndex--;
      this.generateWeekDays();
      this.fetchTimeSlots();
    }
  }
  
  // Chuyển đến tuần sau
  nextWeek(): void {
    if (this.currentWeekIndex < this.maxWeeks - 1) {
      this.currentWeekIndex++;
      this.generateWeekDays();
      this.fetchTimeSlots();
    }
  }
  
  // Kiểm tra xem có thể đi tới tuần tiếp theo không
  canGoNext(): boolean {
    return this.currentWeekIndex < this.maxWeeks - 1;
  }
  
  // Kiểm tra xem có thể quay lại tuần trước không
  canGoPrevious(): boolean {
    return this.currentWeekIndex > 0;
  }
  
  // Lấy tên của tuần hiện tại
  getCurrentWeekName(): string {
    if (this.currentWeekIndex === 0) {
      return "Tuần hiện tại";
    } else if (this.currentWeekIndex === 1) {
      return "Tuần tiếp theo";
    } else {
      return "2 tuần tiếp theo";
    }
  }

  // Lấy dữ liệu lịch từ API
  fetchTimeSlots(): void {
    this.isLoading = true;
    try {
      // Sử dụng dữ liệu từ API
      if (this.detailInfo && this.detailInfo.calendar) {
        this.processApiData();
      } else {
        console.error('Không có dữ liệu từ API');
        this.createEmptySlots();
      }
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
      this.createEmptySlots();
    } finally {
      this.isLoading = false;
    }
  }
  
  // Xử lý dữ liệu từ API
  processApiData(): void {
    const slots: TimeSlot[] = [];
    // Tham khảo dữ liệu từ API
    const calendarData = this.detailInfo.calendar || [];
    
    // Lặp qua mỗi ngày trong tuần
    for (let dayIndex = 0; dayIndex < this.weekDays.length; dayIndex++) {
      const currentDate = this.weekDays[dayIndex];
      const dateString = this.formatDateForComparison(currentDate);
      
      // Lặp qua các khoảng thời gian
      for (let timeRangeIndex = 0; timeRangeIndex < this.timeRanges.length; timeRangeIndex++) {
        const timeRange = this.timeRanges[timeRangeIndex];
        
        // Tạo đối tượng thời gian cho slot
        const startTime = new Date(currentDate);
        startTime.setHours(timeRange.hour, timeRange.minute, 0, 0);
        
        // Tính thời gian kết thúc (1.5 giờ sau)
        const endTime = new Date(startTime);
        if (timeRange.minute === 0) {
          endTime.setHours(timeRange.hour + 1, 30, 0, 0);
        } else {
          endTime.setHours(timeRange.hour + 2, 0, 0, 0);
        }
        
        // Format thời gian để so sánh với API
        const startTimeStr = `${timeRange.hour.toString().padStart(2, '0')}:${timeRange.minute === 0 ? '00' : '30'}`;
        const endTimeStr = endTime.getHours().toString().padStart(2, '0') + ":" + (endTime.getMinutes() === 0 ? '00' : '30');
        
        // Tìm slot từ API có cùng ngày và thời gian
        const apiSlot = calendarData.find((slot: any) => {
          const apiStartDate = new Date(slot.startDate);
          const apiDateStr = this.formatDateForComparison(apiStartDate);
          
          return apiDateStr === dateString && 
                slot.startTime === startTimeStr && 
                slot.endTime === endTimeStr;
        });
        
        if (apiSlot) {
          // Nếu tìm thấy thông tin từ API
          const status = apiSlot.status === 0 ? 'available' : 
                        apiSlot.status === 1 ? 'booked' : 'closed';
                        
          slots.push({
            id: slots.length + 1,
            day: dayIndex,
            week: this.currentWeekIndex,
            startTime,
            endTime,
            status,
            title: status !== 'available' ? this.statusTextMap[status] : '',
            description: apiSlot.note || '',
            slotId: apiSlot.slotId,
            finalPrice: apiSlot.finalPrice
          });
        } else {
          // Không tìm thấy dữ liệu từ API, đánh dấu là "not-in-api"
          slots.push({
            id: slots.length + 1,
            day: dayIndex,
            week: this.currentWeekIndex,
            startTime,
            endTime,
            status: 'not-in-api',
            title: this.statusTextMap['not-in-api'],
            description: ''
          });
        }
      }
    }
    
    this.timeSlots = slots;
  }
  
  // Tạo các slot trống khi không có dữ liệu
  createEmptySlots(): void {
    const slots: TimeSlot[] = [];
    
    // Lặp qua mỗi ngày trong tuần
    for (let dayIndex = 0; dayIndex < this.weekDays.length; dayIndex++) {
      const currentDate = this.weekDays[dayIndex];
      
      // Lặp qua các khoảng thời gian
      for (let timeRangeIndex = 0; timeRangeIndex < this.timeRanges.length; timeRangeIndex++) {
        const timeRange = this.timeRanges[timeRangeIndex];
        
        const startTime = new Date(currentDate);
        startTime.setHours(timeRange.hour, timeRange.minute, 0, 0);
        
        const endTime = new Date(startTime);
        if (timeRange.minute === 0) {
          endTime.setHours(timeRange.hour + 1, 30, 0, 0);
        } else {
          endTime.setHours(timeRange.hour + 2, 0, 0, 0);
        }
        
        slots.push({
          id: slots.length + 1,
          day: dayIndex,
          week: this.currentWeekIndex,
          startTime,
          endTime,
          status: 'not-in-api',
          title: this.statusTextMap['not-in-api'],
          description: ''
        });
      }
    }
    
    this.timeSlots = slots;
  }
  
  // Format ngày để so sánh với dữ liệu API
  formatDateForComparison(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Lấy slot theo ngày và giờ
  getSlot(dayIndex: number, timeRangeIndex: number): TimeSlot | undefined {
    return this.timeSlots.find(slot => 
      slot.day === dayIndex && 
      slot.startTime.getHours() === this.timeRanges[timeRangeIndex].hour &&
      slot.startTime.getMinutes() === this.timeRanges[timeRangeIndex].minute
    );
  }
  
  selectSlot(slot: TimeSlot): void {
    if (!this.isLoggedIn()) {
      // Lưu URL hiện tại vào localStorage
      localStorage.setItem('redirectUrl', window.location.pathname);
      localStorage.setItem('requiresLogin', 'true');
      this.isVisible = true;
      return;
    }
    
    // Định dạng thông tin slot
    const formattedSlot = {
      ...slot,
      date: this.formatDateForDisplay(slot.startTime)
    };
    
    this.slot = formattedSlot;
    
    // Xử lý dựa vào trạng thái của slot
    if (slot.status === 'available') {
      this.isVisibleBook = true;
    } else if (slot.status === 'user-booked') {
      this.isVisibleDetail = true;
    } else if (slot.status === 'booked') {
      // Slot đã đặt bởi người khác
    } else if (slot.status === 'closed') {
      this.isVisibleClosed = true;
    } else if (slot.status === 'not-in-api') {
      // Slot không có trong API
    }
  }

  formatDateForDisplay(date: Date): string {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }
  
  formatDate(date: Date): string {
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  handleChangeVisible(data: any) {
    this.isVisible = data.visible;
  }

  handleChangeVisibleBook(data: any) {
    this.isVisibleBook = data.visible;
  }

  handleChangeVisibleDetail(data: any) {
    this.isVisibleDetail = data.visible;
  }

  handleChangeVisibleClosed(data: any) {
    this.isVisibleClosed = data.visible;
  }
}