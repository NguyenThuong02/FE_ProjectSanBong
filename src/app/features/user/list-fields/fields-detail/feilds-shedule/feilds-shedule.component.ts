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
  status: 'available' | 'booked' | 'closed' | 'user-booked';
  bookedBy?: string;
  title?: string;
  description?: string;
}

interface FixedDataSlot {
  id: number;
  status: 'available' | 'booked' | 'closed';
  bookedBy?: string;
  date: string;
  startTime: string;
  endTime: string;
  note: string;
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
  timeRanges: {hour: number, label: string}[] = [];
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
    'available': '#fff',
    'booked': 'bg-blue-100',
    'closed': 'bg-gray-100',
    'user-booked': 'bg-yellow-100'
  };
  
  statusTextMap = {
    'available': 'Trống',
    'booked': 'Hết chỗ',
    'closed': 'Đã đóng',
    'user-booked': 'Đã đặt'
  };

  // Dữ liệu cố định
  fixedFieldData: FixedDataSlot[] = [
    {
      id: 1,
      status: 'available',
      date: '2025-03-20',
      startTime: '07:00',
      endTime: '08:00',
      note: ''
    },
    {
      id: 2,
      status: 'booked',
      bookedBy: '7c5e5a7a-3e85-4c4b-adf9-cc64ad277798',
      date: '2025-03-24',
      startTime: '08:00',
      endTime: '09:00',
      note: 'Đặt bởi anh Minh - SĐT: 0912345678'
    },
    {
      id: 3,
      status: 'booked',
      bookedBy: '7c5e5a7a-3e85-4c4b-adf9-cc64ad277798',
      date: '2025-03-24',
      startTime: '09:00',
      endTime: '10:00',
      note: 'Đội 11 người, có thuê trọng tài riêng'
    },
    {
      id: 4,
      status: 'closed',
      date: '2025-03-20',
      startTime: '10:00',
      endTime: '11:00',
      note: 'Bảo trì hệ thống đèn chiếu sáng'
    },
    {
      id: 5,
      status: 'available',
      date: '2025-03-19',
      startTime: '11:00',
      endTime: '12:00',
      note: ''
    },
    {
      id: 6,
      status: 'booked',
      bookedBy: '7c5e5a7a-3e85-4c4b-adf9-cc64ad277798',
      date: '2025-03-20',
      startTime: '12:00',
      endTime: '13:00',
      note: 'Đặt trước 3 ngày, đã đặt cọc 50%'
    },
    {
      id: 7,
      status: 'booked',
      bookedBy: '70d4518e-9aec-443a-992f-8b9b4ea61cd0', // Giả sử đây là lịch của người dùng hiện tại
      date: '2025-03-20',
      startTime: '13:00',
      endTime: '14:00',
      note: 'Cần chuẩn bị phòng thay đồ cho 22 người'
    },
    {
      id: 8,
      status: 'available',
      date: '2025-03-21',
      startTime: '14:00',
      endTime: '15:00',
      note: ''
    },
    {
      id: 9,
      status: 'available',
      date: '2025-03-22',
      startTime: '07:00',
      endTime: '08:00',
      note: ''
    },
    {
      id: 10,
      status: 'closed',
      date: '2025-03-23',
      startTime: '08:00',
      endTime: '09:00',
      note: 'Yêu cầu 2 bình nước lớn và khăn lạnh'
    },
    {
      id: 11,
      status: 'booked',
      bookedBy: '70d4518e-9aec-443a-992f-8b9b4ea61cd0', // Giả sử đây là lịch của người dùng hiện tại
      date: '2025-03-22',
      startTime: '09:00',
      endTime: '10:00',
      note: 'Đã thanh toán đầy đủ, cần hóa đơn VAT'
    },
    {
      id: 12,
      status: 'booked',
      bookedBy: '7c5e5a7a-3e85-4c4b-adf9-cc64ad277798',
      date: '2025-03-24',
      startTime: '10:00',
      endTime: '11:00',
      note: 'Trận đấu giao hữu giữa hai công ty'
    },
    {
      id: 13,
      status: 'closed',
      date: '2025-03-21',
      startTime: '11:00',
      endTime: '12:00',
      note: 'Bảo dưỡng định kỳ'
    },
    {
      id: 14,
      status: 'available',
      date: '2025-03-20',
      startTime: '12:00',
      endTime: '13:00',
      note: ''
    },
    {
      id: 15,
      status: 'available',
      date: '2025-03-22',
      startTime: '13:00',
      endTime: '14:00',
      note: ''
    }
  ];

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
  
  // Tạo các mốc thời gian trong ngày
  generateTimeRanges(): void {
    // Tạo các khung giờ từ 7:00 đến 21:00
    for (let hour = 6; hour <= 21; hour++) {
      this.timeRanges.push({
        hour,
        label: `${hour}:00 - ${hour + 1}:00`
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

  // Lấy dữ liệu lịch từ dữ liệu cố định
  fetchTimeSlots(): void {
    this.isLoading = true;
    try {
      // Sử dụng dữ liệu cố định thay vì gọi API
      this.convertFixedDataToTimeSlots();
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    } finally {
      this.isLoading = false;
    }
  }
  
  // Chuyển đổi dữ liệu cố định thành TimeSlot
  convertFixedDataToTimeSlots(): void {
    const slots: TimeSlot[] = [];
    const isUserLoggedIn = this.isLoggedIn();
    
    // Lặp qua mỗi ngày trong tuần
    for (let dayIndex = 0; dayIndex < this.weekDays.length; dayIndex++) {
      const currentDate = this.weekDays[dayIndex];
      const dateString = this.formatDateForComparison(currentDate);
      
      // Lọc các slot thuộc về ngày hiện tại
      const daySlots = this.fixedFieldData.filter(slot => 
        slot.date === dateString
      );
      
      // Nếu không có dữ liệu cho ngày này, tạo slot mặc định
      if (daySlots.length === 0) {
        // Tạo các slot mặc định cho ngày này
        for (let timeRange of this.timeRanges) {
          const hour = timeRange.hour;
          
          const startTime = new Date(currentDate);
          startTime.setHours(hour, 0, 0, 0);
          
          const endTime = new Date(currentDate);
          endTime.setHours(hour + 1, 0, 0, 0);
          
          slots.push({
            id: slots.length + 1,
            day: dayIndex,
            week: this.currentWeekIndex,
            startTime,
            endTime,
            status: 'available',
            title: '',
            description: ''
          });
        }
      } else {
        // Sử dụng dữ liệu có sẵn cho ngày này
        for (let timeRange of this.timeRanges) {
          const hour = timeRange.hour;
          const hourString = `${hour.toString().padStart(2, '0')}:00`;
          
          // Tìm slot có thời gian bắt đầu khớp với giờ hiện tại
          const matchingSlot = daySlots.find(slot => 
            slot.startTime === hourString
          );
          
          const startTime = new Date(currentDate);
          startTime.setHours(hour, 0, 0, 0);
          
          const endTime = new Date(currentDate);
          endTime.setHours(hour + 1, 0, 0, 0);
          
          if (matchingSlot) {
            // Xử lý trạng thái dựa vào việc người dùng đã đăng nhập hay chưa
            let status: any = matchingSlot.status;
            
            // Nếu đã đăng nhập, kiểm tra xem có phải slot do người dùng đặt không
            if (isUserLoggedIn && matchingSlot.status === 'booked' && matchingSlot.bookedBy === this.currentUserId) {
              status = 'user-booked';
            }
            
            slots.push({
              id: matchingSlot.id,
              day: dayIndex,
              week: this.currentWeekIndex,
              startTime,
              endTime,
              status: status,
              bookedBy: matchingSlot.bookedBy,
              title: matchingSlot.status !== 'available' ? 
                  (status === 'user-booked' ? 'Đã đặt' : 
                   matchingSlot.status === 'booked' ? 'Hết chỗ' : 'Đã đóng') : '',
              description: matchingSlot.note
            });
          } else {
            // Nếu không tìm thấy, tạo slot mặc định
            slots.push({
              id: slots.length + 1,
              day: dayIndex,
              week: this.currentWeekIndex,
              startTime,
              endTime,
              status: 'available',
              title: '',
              description: ''
            });
          }
        }
      }
    }
    
    this.timeSlots = slots;
  }
  
  // Lấy class CSS cho slot dựa vào trạng thái
  getSlotClass(dayIndex: number, timeHour: number): string {
    const slot = this.getSlot(dayIndex, timeHour);
    if (slot) {
      if (slot.status === 'available') return '';
      if (slot.status === 'booked') return 'bg-blue-100';
      if (slot.status === 'closed') return 'bg-gray-100';
      if (slot.status === 'user-booked') return 'bg-yellow-100';
    }
    return '';
  }
  
  // Lấy text hiển thị cho trạng thái slot
  getSlotStatusText(slot: TimeSlot): string {
    return this.statusTextMap[slot.status];
  }
  
  // Format ngày để so sánh với dữ liệu cố định
  formatDateForComparison(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
  
  // Lấy các slot theo ngày và giờ
  getSlot(dayIndex: number, timeHour: number): TimeSlot | undefined {
    return this.timeSlots.find(slot => 
      slot.day === dayIndex && 
      slot.startTime.getHours() === timeHour
    );
  }
  
  selectSlot(slot: TimeSlot): void {
    if (!this.isLoggedIn()) {
      // Lưu URL hiện tại vào localStorage
      localStorage.setItem('redirectUrl', window.location.pathname);
      // Thêm flag thông báo cần hiển thị
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
      // Nếu là slot đã đặt bởi người dùng hiện tại
      this.isVisibleDetail = true;
    } else if (slot.status === 'booked') {
      // Nếu là slot đã đặt bởi người khác
      // this.isVisibleDetail = true;
    } else if (slot.status === 'closed') {
      this.isVisibleClosed = true;
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