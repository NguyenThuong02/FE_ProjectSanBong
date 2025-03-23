import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-history-detail',
  standalone: true,
  imports: [
    RouterLink,
    CommonModule,
  ],
  templateUrl: './history-detail.component.html',
  styleUrl: './history-detail.component.scss'
})
export class HistoryDetailComponent {
  historyDetail: any = {
    image: 'assets/img/evenBongDa.png',
    name: 'Sân Đầm Hồng 1',
    nameOwner: 'Nguyễn Văn A',
    cellPhone: '0123456789',
    address: '20 Đầm Hồng, Nam Từ Liêm, Hà Nội',
    bookingDate: '20:30 24/03/2025',
    scheduleDate: '20:00 - 21:00 27/03/2025',
    price: '500.000',
    deposit: '100.000',
    status: 0,
    description: 'Mình muốn đặt sân lúc 20:00 - 21:00 ngày 27/03/2025 cho 10 người. Mình sẽ chuyển khoản 100.000đ để đặt cọc. Cảm ơn bạn.',
  };
}
